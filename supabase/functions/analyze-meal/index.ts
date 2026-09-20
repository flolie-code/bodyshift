// Supabase Edge Function: analyze-meal
// Nimmt ein Base64-Foto einer Mahlzeit, ruft Claude Vision auf,
// gibt strukturierte Nährwert-Analyse zurück.
//
// Deploy: supabase functions deploy analyze-meal
// Secret setzen: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@^0.32.1';

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
});

const SYSTEM_PROMPT = `Du bist ein Ernährungsanalyse-System für die BodyShift Companion App.
Analysiere Fotos von Mahlzeiten und schätze die Kalorien und Makronährstoffe.

Antworte AUSSCHLIESSLICH mit validem JSON in genau diesem Format:
{
  "items": [
    {
      "name": "Deutscher Lebensmittelname",
      "amountGrams": 150,
      "confidence": 0.95,
      "kcal": 165,
      "protein": 31,
      "carbs": 0,
      "fat": 4
    }
  ],
  "overallConfidence": 0.9
}

Regeln:
- name: auf Deutsch, präzise (z.B. "Hähnchenbrust gegrillt" nicht "Fleisch")
- amountGrams: realistische Portions-Schätzung
- confidence: 0.0-1.0 pro Item
- kcal/protein/carbs/fat: Nährwerte für die geschätzte Portion (nicht pro 100g!)
- Bei Unsicherheit lieber kleinere Portion schätzen, User kann korrigieren
- Wenn kein Essen erkennbar: leere items-Liste`;

interface RequestBody {
  imageBase64: string;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { imageBase64 } = (await req.json()) as RequestBody;

    if (!imageBase64) {
      return json({ error: 'imageBase64 fehlt' }, 400);
    }

    // Model: Haiku 4.5 für Geschwindigkeit + Kosten (~0,004€/Foto).
    // Später ggf. auf Sonnet 5 upgraden für höhere Genauigkeit.
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'Analysiere diese Mahlzeit und antworte NUR mit dem JSON-Objekt (kein Markdown, keine Erklärung).',
            },
          ],
        },
      ],
    });

    // Text extrahieren
    const firstBlock = response.content[0];
    if (firstBlock.type !== 'text') {
      return json({ error: 'Unerwarteter Antworttyp von Claude' }, 500);
    }

    // JSON parsen — Claude gibt manchmal Markdown-Fences dazu
    let parsed: { items: unknown[]; overallConfidence: number };
    try {
      const cleaned = firstBlock.text.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return json(
        { error: 'JSON-Parse fehlgeschlagen', raw: firstBlock.text },
        500
      );
    }

    // Summen berechnen
    const items = parsed.items as Array<{
      name: string;
      amountGrams: number;
      confidence: number;
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;

    const totals = items.reduce(
      (acc, it) => ({
        totalKcal: acc.totalKcal + (it.kcal ?? 0),
        totalProtein: acc.totalProtein + (it.protein ?? 0),
        totalCarbs: acc.totalCarbs + (it.carbs ?? 0),
        totalFat: acc.totalFat + (it.fat ?? 0),
      }),
      { totalKcal: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    return json({
      items,
      ...totals,
      overallConfidence: parsed.overallConfidence,
    });
  } catch (err) {
    console.error('analyze-meal error:', err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
