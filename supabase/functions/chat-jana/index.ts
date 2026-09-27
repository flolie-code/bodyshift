// Supabase Edge Function: chat-jana
//
// KI-Chat mit Coach Jana. User schickt Nachricht + Konversations-Verlauf +
// aktueller BodyShift-Kontext (Ziel, Verbrauch, Gewicht). Claude antwortet
// in Jana-Persona.
//
// Deploy: supabase functions deploy chat-jana
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@^0.127.0';

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

const BODYSHIFT_KNOWLEDGE = `
INFORMATION UEBER BODY SHIFT FLB GmbH UND DIE BEHANDLUNG "ABNEHMEN IM LIEGEN":

# Ueber Body Shift

- Firma: Body Shift FLB GmbH, Oesterreich
- Kern-Behandlung: Abnehmen im Liegen (ABL) - technologisch unterstuetztes Koerperkonturieren
- Ziel: Umfangs- und Fettreduktion in Problemzonen (Bauch, Huefte, Oberschenkel, Arme)
- Zielgruppe: Menschen die abnehmen wollen ohne extreme Diaet oder Sport, oder gezielt Problemzonen angehen
- Website: bodyshift-abnehmen.at

# Wie funktioniert Abnehmen im Liegen?

Waehrend der Behandlung liegst du entspannt auf einer Liege. Elektroden werden an den zu behandelnden Zonen angebracht (Bauch, Huefte, Oberschenkel, etc.). Ueber Bioimpuls-Technologie (EMS + Waerme + Ultraschall-Kavitation je nach Programm) werden Fettzellen angeregt sich zu entleeren und die Muskulatur gleichzeitig aktiviert (30 Min = ca. 400 Sit-Ups aequivalent). Das Fett wird ueber Lymphsystem und Ausscheidung abgebaut.

# Typische Behandlungs-Details

- Dauer pro Sitzung: 60 Minuten
- Anzahl fuer sichtbare Ergebnisse: 10-15 Behandlungen (individuell)
- Rhythmus: 2x pro Woche in der Intensivphase, danach Erhaltung 1x/Monat
- Ergebnis: 2-8 cm Umfangreduktion an behandelten Stellen (variiert)
- Erhalt der Ergebnisse: dauerhaft bei stabilem Gewicht - regelmaessige Erhaltung empfohlen

# Vor der Behandlung

- 2 Stunden vor der Behandlung nichts essen (leichter Magen)
- 30 Min vor der Behandlung 500ml Wasser trinken
- Am Behandlungstag keine schweren Mahlzeiten, kein Alkohol
- Bequeme Kleidung mitbringen

# Nach der Behandlung

- Die naechsten 24-48 Stunden viel Wasser trinken (2-3 Liter) - hilft dem Koerper das geloeste Fett auszuscheiden
- 24 Stunden Alkohol vermeiden (blockiert Fettabbau)
- Bewegung foerdert das Ergebnis (Spazieren, kein Hochleistungssport)
- Kein Solarium/Sauna direkt nach der Behandlung
- Leichte Ernaehrung, eiweissbetont

# Wer sollte NICHT behandelt werden

- Schwangere und stillende Frauen
- Menschen mit Herzschrittmacher oder aktiven Implantaten
- Schwere Herzkrankheit
- Akute Infektionen
- Krebspatienten
- Personen mit Epilepsie sollten vorher aerztliche Ruecksprache halten
- Unter 18 Jahren nur mit Einverstaendnis

# Ergaenzt die Behandlung eine gesunde Lebensweise?

Ja - die BodyShift Companion App unterstuetzt genau das: gesunde Ernaehrung (Kalorientracker), regelmaessige Bewegung (Home-Workouts + Alltags-Hacks), ausreichend Wasser (Wasser-Widget), guter Schlaf (Reminder). Die Behandlung entfernt Fettzellen - dein Lebensstil sorgt dafuer, dass keine neuen entstehen.

# Was wenn ich einen Termin absagen muss

Bitte 24 Stunden vorher Bescheid geben - dann koennen wir den Termin verschieben ohne Kosten.

# Preise (Standard-Angabe, anpassen an eure aktuellen Preise)

Konkrete Preise besprechen wir immer im persoenlichen Beratungsgespraech. Wir bieten Pakete fuer verschiedene Ziele - je nach Koerperzone und Anzahl der Behandlungen. Ein kostenloses Beratungsgespraech ist der beste Weg um herauszufinden was fuer dich passt.

# Wenn Jana eine Frage nicht beantworten kann

Bei sehr spezifischen medizinischen Fragen, Preis-Details oder Terminvereinbarungen sag immer:
"Da schreib am besten unserem Team direkt eine Nachricht - die kennen deinen persoenlichen Fall am besten. Nummer: [PLATZHALTER Telefonnummer], oder Email an [PLATZHALTER Email]."

WICHTIG FUER JANA:
- Diese Informationen SPARSAM nutzen - nur wenn User direkt danach fragt
- Nicht ungefragt ueber ABL predigen
- Bei Verdacht auf medizinische Fragen (Kontraindikationen, konkrete Wirkung, Nebenwirkungen) immer aerztliche Ruecksprache empfehlen
- Bei Preis- oder Termin-Fragen an das Team verweisen
- Ein warmer Ton wie bei allen anderen Antworten - keine PR-Sprache
`;

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
