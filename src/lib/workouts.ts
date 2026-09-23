/**
 * Home-Workouts fuer BodyShift.
 * Statische Sammlung — kein Equipment noetig, alle in <20 min umsetzbar.
 */

export type Workout = {
  id: string;
  title: string;
  minutes: number;
  level: 'einsteiger' | 'mittel' | 'fortgeschritten';
  kcalEstimate: number;
  focus: 'ganzkoerper' | 'core' | 'beine' | 'oberkoerper' | 'ausdauer';
  emoji: string;
  intro: string;
  exercises: {
    name: string;
    detail: string;
    reps: string; // "3x 12" oder "40s"
  }[];
  tip: string;
};

export const WORKOUTS: Workout[] = [
  {
    id: 'morning-kickstart',
    title: 'Morgen-Kickstart',
    minutes: 8,
    level: 'einsteiger',
    kcalEstimate: 80,
    focus: 'ganzkoerper',
    emoji: '🌅',
    intro: 'Kurz und knackig — bringt den Kreislauf in Schwung und aktiviert alle grossen Muskelgruppen.',
    exercises: [
      { name: 'Jumping Jacks', detail: 'Locker, gleichmaessig atmen', reps: '3x 30s' },
      { name: 'Kniebeugen', detail: 'Fersen bleiben am Boden', reps: '3x 15' },
      { name: 'Liegestuetz (auf Knien geht auch)', detail: 'Ruecken gerade halten', reps: '3x 8' },
      { name: 'Plank', detail: 'Bauch anspannen, Huefte hoch', reps: '3x 30s' },
    ],
    tip: 'Nach dem Aufstehen, vor dem Fruehstueck — Nuechtern-Effekt verbrennt zusaetzlich Fett.',
  },
  {
    id: 'fettverbrenner-15',
    title: 'Fettverbrenner 15',
    minutes: 15,
    level: 'mittel',
    kcalEstimate: 180,
    focus: 'ausdauer',
    emoji: '🔥',
    intro: 'HIIT-Style: 40 Sekunden Vollgas, 20 Sekunden Pause. Kurbelt den Nachbrenneffekt richtig an.',
    exercises: [
      { name: 'Burpees', detail: 'Vom Stand in den Liegestuetz, hoch, Sprung', reps: '4x 40s' },
      { name: 'Mountain Climbers', detail: 'Knie schnell abwechselnd zur Brust', reps: '4x 40s' },
      { name: 'Squat Jumps', detail: 'Aus Kniebeuge nach oben abdruecken', reps: '4x 40s' },
      { name: 'High Knees', detail: 'Knie auf Huefthoehe, Arme mitschwingen', reps: '4x 40s' },
    ],
    tip: 'Am wichtigsten: die 20 Sekunden Pause EINHALTEN — nicht laenger, sonst geht der Puls runter.',
  },
  {
    id: 'core-crusher',
    title: 'Core-Crusher',
    minutes: 10,
    level: 'mittel',
    kcalEstimate: 90,
    focus: 'core',
    emoji: '🎯',
    intro: 'Alles fuer die Mitte. Bauch, Ruecken, Rumpfstabilitaet — der Motor fuer Alltag und Sport.',
    exercises: [
      { name: 'Plank', detail: 'Gerade Linie Kopf bis Fuesse', reps: '3x 45s' },
      { name: 'Russian Twists', detail: 'Fuesse leicht anheben, seitlich drehen', reps: '3x 20' },
      { name: 'Beinheben', detail: 'Rueckenlage, Beine langsam heben/senken', reps: '3x 12' },
      { name: 'Seitliche Planke', detail: 'Pro Seite 30s', reps: '2x 30s pro Seite' },
    ],
    tip: 'Bauch bewusst einziehen, nicht rausdruecken — dann trainiert der tiefe Rumpf mit.',
  },
  {
    id: 'lower-body-power',
    title: 'Lower Body Power',
    minutes: 12,
    level: 'mittel',
    kcalEstimate: 130,
    focus: 'beine',
    emoji: '🦵',
    intro: 'Die groessten Muskeln = die groesste Kalorienverbrennung. Beine sind Fett-Killer Nummer eins.',
    exercises: [
      { name: 'Kniebeugen', detail: 'Tief runter, Knie ueber den Zehen', reps: '4x 20' },
      { name: 'Ausfallschritte', detail: 'Abwechselnd links/rechts', reps: '4x 12 pro Bein' },
      { name: 'Wadenheben', detail: 'Ferse hoch, kurz halten', reps: '4x 20' },
      { name: 'Wall Sit', detail: 'Ruecken zur Wand, Beine 90 Grad', reps: '3x 45s' },
    ],
    tip: 'Ausatmen beim Aufstehen aus der Kniebeuge — das schuetzt den Blutdruck.',
  },
  {
    id: 'oberkoerper-basic',
    title: 'Oberkoerper Basic',
    minutes: 12,
    level: 'einsteiger',
    kcalEstimate: 100,
    focus: 'oberkoerper',
    emoji: '💪',
    intro: 'Formt Arme, Schultern und Brust — ohne Hanteln, nur mit dem eigenen Koerpergewicht.',
    exercises: [
      { name: 'Liegestuetz', detail: 'Bei Bedarf auf Knien oder Wand', reps: '4x 8-12' },
      { name: 'Dips (Stuhl)', detail: 'Haende auf Stuhlkante, Ellbogen zurueck', reps: '4x 10' },
      { name: 'Schulter-Kreise', detail: 'Vorwaerts + rueckwaerts', reps: '2x 20' },
      { name: 'Superman', detail: 'Bauchlage, Arme + Beine heben', reps: '3x 15' },
    ],
    tip: 'Statt der klassischen Liegestuetz: Haende an Wand oder Tisch auflegen — trotzdem effektiv.',
  },
  {
    id: 'abend-cooldown',
    title: 'Abend-Cooldown',
    minutes: 10,
    level: 'einsteiger',
    kcalEstimate: 40,
    focus: 'ganzkoerper',
    emoji: '🌙',
    intro: 'Ruhig, dehnend, entspannend. Senkt Cortisol, verbessert Schlaf, unterstuetzt Regeneration.',
    exercises: [
      { name: 'Katze-Kuh', detail: 'Ruecken langsam rund + hohl', reps: '2 min' },
      { name: 'Hueftoeffner (Taube)', detail: 'Pro Seite 1 min', reps: '2 min' },
      { name: 'Vorbeuge im Sitzen', detail: 'Locker, kein Ziehen erzwingen', reps: '2 min' },
      { name: 'Rueckenlage, Knie zur Brust', detail: 'Tief atmen', reps: '2 min' },
    ],
    tip: 'Handy weglegen, Licht dimmen — der Koerper braucht das Signal, dass Ruhe ansteht.',
  },
];

export function getWorkout(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}

export function workoutOfDay(): Workout {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return WORKOUTS[dayOfYear % WORKOUTS.length];
}
