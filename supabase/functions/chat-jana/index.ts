// Supabase Edge Function: chat-jana
//
// KI-Chat mit Coach Jana. User schickt Nachricht + Konversations-Verlauf +
// aktueller BodyShift-Kontext (Ziel, Verbrauch, Gewicht). Claude antwortet
// in Jana-Persona.
//
// Deploy: supabase functions deploy chat-jana
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@^0.127.0';
import { BODYSHIFT_KNOWLEDGE } from './bodyshift-knowledge.ts';

interface ChatContext {
  firstName?: string;
  age?: number;
  goalKg?: number;
  currentKg?: number;
  dailyTargetKcal?: number;
  consumedTodayKcal?: number;
  weekRemainingKcal?: number;
  lastMeals?: { name: string; kcal: number; when: string }[];
  weightTrend7d?: number;
  weightTrend30d?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  context?: ChatContext;
}

const JANA_SYSTEM = `Du bist Jana - persoenliche Ernaehrungscoach und Wellness-Begleiterin in der BodyShift Companion App.

DEINE PERSOENLICHKEIT:
- Warm, direkt, wissend - wie eine erfahrene Freundin die Ahnung von Ernaehrung hat
- Nie strafend, nie moralisierend, nie diaetig
- Feierst kleine Erfolge, holst bei Rueckschlaegen sanft ab
- Sprichst in Du-Form, oesterreichisch/deutsch neutral
- Kurze Antworten (2-4 Saetze), keine Bullet-Point-Listen ausser konkret hilfreich

DEIN WISSEN:
- Ernaehrungswissenschaft (Kalorien, Makros, Mikroernaehrung, Timing)
- Stoffwechsel-Physiologie (Insulin, Cortisol, braunes Fett, Muskelerhalt)
- Alltagshacks (Bewegung, Schlaf, Stress, Hydration)
- Rezept-Ideen (schnell, eiweissreich, low-carb)
- BodyShift-Prinzip: Wochenkonto statt Tageslimit, kein Verzicht, kleine Kniffe

WAS DU NIE TUST:
- Kalorien-Ziele hart durchsetzen ("du hast dein Ziel ueberschritten")
- Verzicht predigen ("iss keine Suessigkeiten")
- Mediziner-Ratschlaege geben (Krankheiten, Medikamente -> Arzt empfehlen)
- Wagen, ob User zunehmen/abnehmen soll wenn nicht danach gefragt

BEI KONKRETEN FRAGEN:
- "Was koche ich?" -> 1-2 konkrete Vorschlaege mit kcal, kurze Zubereitung
- "Warum nehme ich nicht ab?" -> ruhig, faktenbasiert, meist Antwort: Wasser, Schlaf, Muskelmasse, Wochendurchschnitt statt Tagesnadel
- "Ich hab suendigt" -> "kein Drama, morgen frisch" - nie schuldzuweisend
- "Ist X ok?" -> Meist ja, mit kurzer Erklaerung warum

BEI FRAGEN ZU BODY SHIFT UND DER ABL-BEHANDLUNG:
Du kennst die Firma und die Behandlung. Nutze die Info in der Wissensdatenbank unten wenn User danach fragen ("Wie funktioniert ABL?", "Wie oft soll ich kommen?", "Was koste die Behandlung?", "Was mach ich nach der Behandlung?"). Bei sehr spezifischen medizinischen oder Preis-Fragen verweise ans Team.

Antworte immer als Jana - kein "Als KI-Assistent" oder aehnliches.

${BODYSHIFT_KNOWLEDGE}`;

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return json({ error: 'POST erforderlich' }, 405);
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return json({ error: 'ANTHROPIC_API_KEY fehlt in Supabase Secrets' }, 500);
    }

    const anthropic = new Anthropic({ apiKey });

    const body = (await req.json()) as RequestBody;
    if (!body.message?.trim()) {
      return json({ error: 'message fehlt' }, 400);
    }

    // Kontext-Zeile bauen - kommt in die erste User-Nachricht rein
    const ctx = body.context ?? {};
    const contextLines: string[] = [];
    if (ctx.firstName) contextLines.push(`Name: ${ctx.firstName}`);
    if (ctx.age) contextLines.push(`Alter: ${ctx.age}`);
    if (ctx.currentKg) contextLines.push(`Aktuelles Gewicht: ${ctx.currentKg} kg`);
    if (ctx.goalKg) contextLines.push(`Zielgewicht: ${ctx.goalKg} kg`);
    if (ctx.dailyTargetKcal) contextLines.push(`Tages-Ziel: ${ctx.dailyTargetKcal} kcal`);
    if (ctx.consumedTodayKcal != null) contextLines.push(`Heute verbraucht: ${ctx.consumedTodayKcal} kcal`);
    if (ctx.weekRemainingKcal != null) contextLines.push(`Wochen-Rest: ${ctx.weekRemainingKcal} kcal`);
    if (ctx.weightTrend7d != null) contextLines.push(`Trend 7 Tage: ${ctx.weightTrend7d > 0 ? '+' : ''}${ctx.weightTrend7d} kg`);
    if (ctx.weightTrend30d != null) contextLines.push(`Trend 30 Tage: ${ctx.weightTrend30d > 0 ? '+' : ''}${ctx.weightTrend30d} kg`);
    if (ctx.lastMeals && ctx.lastMeals.length > 0) {
      contextLines.push('Letzte Mahlzeiten heute:');
      ctx.lastMeals.forEach((m) => contextLines.push(`  - ${m.name}: ${m.kcal} kcal (${m.when})`));
    }

    const contextBlock = contextLines.length > 0
      ? `Kontext ueber den User (nutze das nur wenn relevant, nicht immer explizit erwaehnen):\n${contextLines.join('\n')}\n\n---\n\n`
      : '';

    // Historie + neue Nachricht
    const messages: ChatMessage[] = [
      ...(body.history ?? []).slice(-10), // max 10 letzte Nachrichten
      { role: 'user' as const, content: contextBlock + body.message },
    ];

    // Sonnet 5 - gute Persoenlichkeits-Konsistenz + Wissen. Kosten ~0,01 EUR pro Antwort.
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 600,
      system: JANA_SYSTEM,
      messages,
    });

    const block = response.content[0];
    if (!block || block.type !== 'text') {
      return json({ error: 'Unerwarteter Antworttyp von Claude' }, 500);
    }

    return json({
      reply: block.text.trim(),
      usage: response.usage,
    });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    if (msg.includes('401') || msg.includes('403') || msg.includes('invalid_api_key')) {
      return json(
        {
          error: msg,
          hint: 'Anthropic-API-Key pruefen in Supabase Secrets',
        },
        500
      );
    }
    return json({ error: msg }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
