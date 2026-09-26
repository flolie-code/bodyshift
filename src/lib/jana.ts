/**
 * Coach Jana — persoenliche Stimme der BodyShift-App.
 *
 * Warm, wissend, nie strafend. Feiert Fortschritt, holt bei
 * Rueckschlaegen ab, motiviert mit Fakten statt Druck.
 *
 * Alle Nachrichten in Du-Form, auf Deutsch (oesterreichisch neutral),
 * max. 2 Saetze pro Nachricht.
 */

export type JanaContext = {
  firstName: string;
  hour: number;
  dailyGoalKcal: number;
  consumedKcal: number;
  remainingKcal: number;
  weekRemainingKcal: number;
  streakDays?: number;
  lastMealHoursAgo?: number;
};

export type JanaMessage = {
  emoji: string;
  text: string;
  tone: 'motivate' | 'celebrate' | 'nudge' | 'reflect' | 'inform';
};

/** Zufaellig eines aus einer Liste (deterministisch nach Datum, damit sich morgens die Message nicht wechselt) */
function pickForToday<T>(list: T[]): T {
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  return list[seed % list.length];
}

/** Feste Auswahl (nicht random) — z.B. fuer Streak-Message */
function pickByIndex<T>(list: T[], idx: number): T {
  return list[idx % list.length];
}

const MORNING_GREETINGS = [
  'Guten Morgen',
  'Morgen',
  'Schoen dass du da bist',
  'Guten Start in den Tag',
];

const EVENING_GREETINGS = [
  'Guten Abend',
  'Feierabend, gut so',
  'Schoen dich zu sehen',
];

/** Morgen-Nachricht (bis 11 Uhr) — motiviert, gibt Fokus fuer den Tag */
function morningMessage(ctx: JanaContext): JanaMessage {
  const greet = pickForToday(MORNING_GREETINGS);
  const name = ctx.firstName ? `, ${ctx.firstName}` : '';

  const hooks = [
    `${greet}${name}. Ein Glas Wasser vor dem Fruehstueck — der einfachste Kick fuer den Stoffwechsel.`,
    `${greet}${name}. 30g Protein zum Fruehstueck sparen dir heute zwei Snack-Attacken.`,
    `${greet}${name}. Setz dir heute eine Sache vor: 10.000 Schritte oder 30g Protein. Reicht.`,
    `${greet}${name}. Heute ist ein guter Tag um schon vor dem Fruehstueck 500ml Wasser zu trinken.`,
    `${greet}${name}. Denk dran: kein Tag ist perfekt, aber die Woche ist es oft.`,
    `${greet}${name}. Ich helf dir heute — foto von deiner Mahlzeit und ich rechne den Rest aus.`,
  ];

  return {
    emoji: '🌅',
    text: pickForToday(hooks),
    tone: 'motivate',
  };
}

/** Mittags-Nachricht (11-17 Uhr) — abhaengig vom aktuellen Verbrauch */
function middayMessage(ctx: JanaContext): JanaMessage {
  const name = ctx.firstName ? ctx.firstName : 'du';
  const pctConsumed = ctx.dailyGoalKcal > 0 ? ctx.consumedKcal / ctx.dailyGoalKcal : 0;

  // Noch nichts getrackt
  if (ctx.consumedKcal === 0) {
    return {
      emoji: '☀️',
      text: `${name}, noch nichts getrackt — willst du dein Fruehstueck oder deinen Kaffee mit mir festhalten?`,
      tone: 'nudge',
    };
  }

  // Auf Kurs
  if (pctConsumed < 0.5) {
    return {
      emoji: '☀️',
      text: `Sauber unterwegs, ${name}. Nach dem Mittag ein 10-Min-Spaziergang senkt den Blutzucker-Peak um bis zu 30%.`,
      tone: 'motivate',
    };
  }

  // Ueber Halb, aber im Rahmen
  if (pctConsumed < 0.85) {
    return {
      emoji: '☀️',
      text: `Passt, ${name}. Noch ${Math.round(ctx.remainingKcal)} kcal Spielraum — beim Abendessen also entspannt.`,
      tone: 'inform',
    };
  }

  // Grenze erreicht
  return {
    emoji: '☀️',
    text: `Heute schon 85% durch, ${name}. Am Abend ein leichtes Eiweiss (Skyr, Ei, Huehnchen) — dann bleibt die Woche im Plan.`,
    tone: 'nudge',
  };
}

/** Nachmittag/Fruehabend (17-21 Uhr) */
function eveningMessage(ctx: JanaContext): JanaMessage {
  const name = ctx.firstName ? ctx.firstName : 'du';
  const greet = pickForToday(EVENING_GREETINGS);

  // Noch viel Puffer
  if (ctx.remainingKcal > 500) {
    return {
      emoji: '🌆',
      text: `${greet}, ${name}. ${Math.round(ctx.remainingKcal)} kcal freies Budget — genug fuer ein gutes Abendessen.`,
      tone: 'inform',
    };
  }

  // Knapp
  if (ctx.remainingKcal > 100) {
    return {
      emoji: '🌆',
      text: `${greet}, ${name}. Noch ${Math.round(ctx.remainingKcal)} kcal — ein Salat mit Ei oder Skyr passt gut.`,
      tone: 'nudge',
    };
  }

  // Ueber Ziel
  return {
    emoji: '🌆',
    text: `${greet}, ${name}. Heute etwas drueber — kein Drama. Die Woche gleicht sich selber aus, ich hab den Puffer im Blick.`,
    tone: 'reflect',
  };
}

/** Spaeter Abend / Nacht (21+) */
function nightMessage(ctx: JanaContext): JanaMessage {
  const name = ctx.firstName ? ctx.firstName : 'du';

  return {
    emoji: '🌙',
    text: `Zeit runterzukommen, ${name}. Handy dunkler, ein Tee, morgen frisch. Guter Schlaf ist die halbe Miete.`,
    tone: 'reflect',
  };
}

/** Hauptfunktion: liefert die passende Nachricht basierend auf Kontext */
export function getJanaMessage(ctx: JanaContext): JanaMessage {
  const h = ctx.hour;
  if (h < 11) return morningMessage(ctx);
  if (h < 17) return middayMessage(ctx);
  if (h < 21) return eveningMessage(ctx);
  return nightMessage(ctx);
}

/** Feedback nach Meal-Eintrag */
export function janaOnMealLogged(kcal: number, remaining: number): JanaMessage {
  if (kcal < 200) {
    return {
      emoji: '👌',
      text: `Guter Snack. Kleine Portionen halten den Blutzucker stabil.`,
      tone: 'celebrate',
    };
  }
  if (remaining > 300) {
    return {
      emoji: '✓',
      text: `Notiert. Noch ${Math.round(remaining)} kcal fuer heute.`,
      tone: 'inform',
    };
  }
  if (remaining > 0) {
    return {
      emoji: '👌',
      text: `Fast am Tagesziel — beim Abend was Leichtes und wir sind im Plan.`,
      tone: 'nudge',
    };
  }
  return {
    emoji: '🤝',
    text: `Drueber heute. Kein Drama, ich hol das aus dem Wochen-Puffer. Morgen frisch.`,
    tone: 'reflect',
  };
}

/** Feedback nach Wasser-Eintrag */
export function janaOnWaterLogged(totalMl: number): JanaMessage {
  if (totalMl < 800) {
    return {
      emoji: '💧',
      text: `Guter Start. Tagesziel: 2,5 Liter.`,
      tone: 'inform',
    };
  }
  if (totalMl < 2000) {
    return {
      emoji: '💧',
      text: `Auf Kurs. Weiter regelmaessig — nicht auf einen Rutsch.`,
      tone: 'motivate',
    };
  }
  return {
    emoji: '🎉',
    text: `Tagesziel geknackt. So faellt das Abnehmen leichter.`,
    tone: 'celebrate',
  };
}

/** Feedback nach Workout */
export function janaOnWorkoutDone(minutes: number): JanaMessage {
  return {
    emoji: '💪',
    text: `${minutes} Min bewegt — mehr als 90% der Leute heute. Sauber.`,
    tone: 'celebrate',
  };
}

/** Push-Notification-Texte (kurz, direkt) */
export const JANA_NOTIFICATIONS = {
  morning: [
    'Guten Morgen. Was startet den Tag heute?',
    'Neuer Tag, frischer Start. 500ml Wasser zuerst.',
    'Guten Morgen. Was liegt heute an?',
  ],
  waterReminder: [
    'Kurzer Reminder: 250ml Wasser.',
    'Wasser-Check — noch ein Glas?',
    'Hast du in der letzten Stunde was getrunken?',
  ],
  movementNoon: [
    '5 Minuten aufstehen — Stoffwechsel dankt es.',
    'Kaffee holen? Nimm die Treppe.',
    '3 Minuten Gehen jetzt = klarer Kopf gleich.',
  ],
  eveningReflect: [
    'Wie war der Tag? Ich hab die Daten fuer dich.',
    'Kurz reingeschaut? Ich zeig dir die Woche.',
    'Feierabend — schau kurz auf deinen Tag.',
  ],
};

/** Sprich Jana als Signatur aus (fuer Feedback-Toasts, Karten-Footer) */
export const JANA_NAME = 'Jana';
export const JANA_TITLE = 'Coach';
