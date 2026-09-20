/**
 * Wochenkonto — das Kern-Feature.
 *
 * Prinzip: Statt strengem Tageslimit ein Wochenbudget.
 * - Tages-Überzug wird automatisch aus Wochen-Puffer abgezogen (positiv formuliert).
 * - User kann Budget manuell zwischen Tagen verschieben (50-kcal-Schritte).
 * - Gönn-Tag = Tag mit erhöhtem Budget, kompensiert durch andere Tage.
 * - Wochensumme bleibt IMMER konstant.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Mo, 6=So

export type DayBudget = {
  weekday: Weekday;
  dateISO: string;
  baseKcal: number;   // Standard-Tagesbudget
  adjustedKcal: number; // nach manueller Verschiebung / Gönn-Tag
  consumedKcal: number;
  isTreatDay: boolean;
};

export type WeekAccount = {
  weekStartISO: string; // Montag
  weeklyBudget: number;
  days: DayBudget[];
};

export function totalConsumed(week: WeekAccount): number {
  return week.days.reduce((sum, d) => sum + d.consumedKcal, 0);
}

export function totalAdjusted(week: WeekAccount): number {
  return week.days.reduce((sum, d) => sum + d.adjustedKcal, 0);
}

export function remainingKcal(week: WeekAccount): number {
  return week.weeklyBudget - totalConsumed(week);
}

/**
 * Verschiebt kcal zwischen Tagen — Wochensumme bleibt konstant.
 * Positive delta → auf targetDay (aus donorDays abgezogen).
 * Negative delta → von targetDay (auf donorDays verteilt).
 */
export function shiftBudget(
  week: WeekAccount,
  targetDay: Weekday,
  deltaKcal: number,
  donorDays: Weekday[]
): WeekAccount {
  const snapped = Math.round(deltaKcal / 50) * 50;
  if (snapped === 0 || donorDays.length === 0) return week;

  const perDonor = Math.round(snapped / donorDays.length);
  const days = week.days.map((d) => {
    if (d.weekday === targetDay) {
      return { ...d, adjustedKcal: Math.max(500, d.adjustedKcal + snapped) };
    }
    if (donorDays.includes(d.weekday)) {
      return { ...d, adjustedKcal: Math.max(500, d.adjustedKcal - perDonor) };
    }
    return d;
  });

  return { ...week, days };
}

/**
 * Markiert Tag als Gönn-Tag mit extra Budget.
 * Extra kcal werden gleichmäßig von den anderen Tagen abgezogen.
 */
export function planTreatDay(
  week: WeekAccount,
  treatDay: Weekday,
  extraKcal: number
): WeekAccount {
  const otherDays = week.days.map((d) => d.weekday).filter((w) => w !== treatDay) as Weekday[];
  const withExtra = shiftBudget(week, treatDay, extraKcal, otherDays);
  return {
    ...withExtra,
    days: withExtra.days.map((d) =>
      d.weekday === treatDay ? { ...d, isTreatDay: true } : d
    ),
  };
}

/**
 * Positives, nie schuldzuweisendes Ein-Satz-Feedback.
 * Automatische Regel: Tages-Überzug still aus Wochen-Puffer,
 * Alarm erst wenn Wochenbudget wirklich knapp wird.
 */
export function weekFeedback(week: WeekAccount, todayWeekday: Weekday): string {
  const remaining = remainingKcal(week);
  const daysLeft = 7 - todayWeekday - 1;
  const today = week.days.find((d) => d.weekday === todayWeekday);
  const treatDay = week.days.find((d) => d.isTreatDay && d.weekday > todayWeekday);

  if (remaining < 0) {
    return 'Woche voll — nächste Woche startet Montag frisch. Alles gut.';
  }
  if (daysLeft > 0 && remaining / Math.max(daysLeft, 1) < 500) {
    return 'Wochenbudget wird knapp — heute etwas leichter, dann passt es.';
  }
  if (treatDay) {
    return `Sauber unterwegs — noch Puffer für ${weekdayName(treatDay.weekday)} (Gönn-Tag).`;
  }
  if (today && today.consumedKcal > today.adjustedKcal) {
    return 'Heute drüber, Puffer angepasst — die Woche passt.';
  }
  return 'Sauber unterwegs — du bist im Plan.';
}

const WEEKDAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;

export function weekdayName(w: Weekday): string {
  return WEEKDAY_NAMES[w];
}
