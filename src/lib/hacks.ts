/**
 * BodyShift Alltags-Hacks — der USP der App.
 *
 * Kleine, wissenschaftlich fundierte Kniffe die im Alltag sofort umsetzbar sind.
 * Kein Equipment, kein Zeitfresser. Jeder Hack mit konkretem Effekt.
 *
 * Kategorien:
 * - stoffwechsel: Metabolismus aktivieren
 * - blutzucker:   Insulin-Peaks glaetten
 * - saettigung:   Ohne Hunger essen
 * - bewegung:     Micro-Movements im Alltag
 * - schlaf:       Regeneration = Fettverbrennung
 * - wasser:       Hydration-Tricks
 * - protein:      Muskelerhalt beim Abnehmen
 * - timing:       Wann statt was
 * - mental:       Cortisol runter, Bauchfett runter
 * - kaelte:       Braunes Fettgewebe aktivieren
 */

export type HackCategory =
  | 'stoffwechsel'
  | 'blutzucker'
  | 'saettigung'
  | 'bewegung'
  | 'schlaf'
  | 'wasser'
  | 'protein'
  | 'timing'
  | 'mental'
  | 'kaelte';

export type HackTime = 'morning' | 'midday' | 'evening' | 'anytime';

export type Hack = {
  id: string;
  number: string;
  title: string;
  body: string;
  category: HackCategory;
  time: HackTime;
  effortMinutes: number; // wie lang dauert das umzusetzen
  effect: string; // konkreter Nutzen in einem Satz
};

export const HACKS: Hack[] = [
  // ============ STOFFWECHSEL ============
  {
    id: 'kaffee-kniebeugen',
    number: '01',
    title: 'Nach jedem Kaffee 30 Kniebeugen',
    body: 'Aktiviert den Glukose-Transport in die Muskeln. Das Koffein wirkt starker weil dein Kreislauf oben ist.',
    category: 'stoffwechsel',
    time: 'anytime',
    effortMinutes: 2,
    effect: '+40 kcal pro Runde, stabilerer Blutzucker',
  },
  {
    id: 'kalt-duschen',
    number: '02',
    title: 'Kalt duschen (30 Sek. am Ende)',
    body: 'Aktiviert braunes Fettgewebe. Dein Koerper verbrennt Kalorien um sich aufzuwaermen.',
    category: 'kaelte',
    time: 'morning',
    effortMinutes: 1,
    effect: '+100-250 kcal pro Session',
  },
  {
    id: 'gewuerze-scharf',
    number: '03',
    title: 'Chili oder Ingwer zu Mittag',
    body: 'Capsaicin und Gingerol erhoehen den Ruhe-Energieumsatz voruebergehend um 5-8%.',
    category: 'stoffwechsel',
    time: 'midday',
    effortMinutes: 0,
    effect: '+50-80 kcal am Tag',
  },
  {
    id: 'gruener-tee',
    number: '04',
    title: '2 Tassen Gruener Tee ueber den Tag',
    body: 'Catechine + Koffein wirken zusammen — sanfter als Kaffee, aber laenger.',
    category: 'stoffwechsel',
    time: 'anytime',
    effortMinutes: 2,
    effect: '+80-100 kcal Fettverbrennung',
  },
  {
    id: 'nuechtern-morgens',
    number: '05',
    title: '90 Min nach dem Aufstehen nichts essen',
    body: 'Cortisol ist morgens hoch — dein Koerper zieht Energie aus Fettreserven. Wasser und Kaffee sind ok.',
    category: 'timing',
    time: 'morning',
    effortMinutes: 0,
    effect: '~150 kcal aus Fettreserven statt Fruehstueck',
  },

  // ============ BLUTZUCKER ============
  {
    id: 'spaziergang-mahlzeit',
    number: '06',
    title: '10-Min-Spaziergang nach jeder Mahlzeit',
    body: 'Studie zeigt: Blutzucker-Peak sinkt um bis zu 30%. Weniger Insulin, weniger Fettspeicherung.',
    category: 'blutzucker',
    time: 'anytime',
    effortMinutes: 10,
    effect: '-30% Blutzucker-Peak',
  },
  {
    id: 'essreihenfolge',
    number: '07',
    title: 'Erst Gemuese, dann Protein, dann Kohlenhydrate',
    body: 'Diese Reihenfolge senkt den Blutzucker-Anstieg der gleichen Mahlzeit um bis zu 73% (Cornell-Studie).',
    category: 'blutzucker',
    time: 'anytime',
    effortMinutes: 0,
    effect: '-73% Blutzucker-Spike',
  },
  {
    id: 'apfelessig-vor-mahlzeit',
    number: '08',
    title: '1 EL Apfelessig in Wasser vor Kohlenhydraten',
    body: 'Reduziert den Blutzucker-Anstieg nach Pasta oder Reis nachweislich um 20-30%.',
    category: 'blutzucker',
    time: 'anytime',
    effortMinutes: 1,
    effect: '-20-30% Blutzucker-Peak',
  },
  {
    id: 'zimt-morgens',
    number: '09',
    title: 'Zimt in den Kaffee oder Haferbrei',
    body: 'Verbessert die Insulinsensitivitaet — dein Koerper braucht weniger Insulin fuer dieselbe Menge Zucker.',
    category: 'blutzucker',
    time: 'morning',
    effortMinutes: 0,
    effect: 'Weniger Zuckertief 2h spaeter',
  },
  {
    id: 'nussdiebspot',
    number: '10',
    title: 'Handvoll Mandeln VOR dem Suessen',
    body: 'Die Fette und Ballaststoffe daempfen die Zucker-Aufnahme aus dem Nachtisch drastisch.',
    category: 'blutzucker',
    time: 'anytime',
    effortMinutes: 1,
    effect: 'Kein Zuckertief nach dem Dessert',
  },

  // ============ SAETTIGUNG ============
  {
    id: 'wasser-vor-mahlzeit',
    number: '11',
    title: '500 ml Wasser 20 Min vor jeder Mahlzeit',
    body: 'Studien zeigen ~20% weniger Kalorien-Aufnahme pro Mahlzeit — ohne Verzicht, nur mit Wasser.',
    category: 'saettigung',
    time: 'anytime',
    effortMinutes: 1,
    effect: '-20% Kalorien pro Mahlzeit',
  },
  {
    id: 'kleiner-teller',
    number: '12',
    title: 'Auf kleinerem Teller essen (max 22 cm)',
    body: 'Delboeuf-Illusion: Dein Gehirn sieht mehr, du isst automatisch 20-25% weniger.',
    category: 'saettigung',
    time: 'anytime',
    effortMinutes: 0,
    effect: '-20% Portionsgroesse ohne Hunger',
  },
  {
    id: 'protein-frueh',
    number: '13',
    title: '30 g Protein zum Fruehstueck',
    body: 'Sattigt 4-5 Stunden. Heisshunger am Nachmittag verschwindet fast komplett.',
    category: 'protein',
    time: 'morning',
    effortMinutes: 5,
    effect: 'Kein Nachmittag-Snack noetig',
  },
  {
    id: '20-min-warten',
    number: '14',
    title: 'Nach der ersten Portion 20 Min warten',
    body: 'Dein Saettigungs-Signal braucht 20 Min bis Gehirn. Danach realisierst du: du bist satt.',
    category: 'saettigung',
    time: 'anytime',
    effortMinutes: 20,
    effect: 'Meistens kein Nachschlag noetig',
  },
  {
    id: 'ballaststoffe-vorne',
    number: '15',
    title: 'Ein Salat vor der Hauptmahlzeit',
    body: 'Ballaststoffe blaehen im Magen — du wirst 30% frueher satt bei derselben Hauptmahlzeit.',
    category: 'saettigung',
    time: 'anytime',
    effortMinutes: 3,
    effect: '-200-300 kcal pro Mahlzeit',
  },
  {
    id: 'kaugummi-nachmittags',
    number: '16',
    title: 'Kaugummi bei aufkommender Lust',
    body: 'Die Kaubewegung sendet dem Gehirn ein "gerade gegessen"-Signal. Wirkt in ~5 Min.',
    category: 'saettigung',
    time: 'anytime',
    effortMinutes: 5,
    effect: 'Snack-Attacke oft weg',
  },

  // ============ BEWEGUNG ============
  {
    id: 'treppe-statt-lift',
    number: '17',
    title: 'Immer die Treppe statt Aufzug',
    body: 'Bei 3 Stockwerken x 5x/Tag = 90 kcal extra — ohne einen Meter fuers Training zu machen.',
    category: 'bewegung',
    time: 'anytime',
    effortMinutes: 2,
    effect: '+90 kcal pro Tag',
  },
  {
    id: 'stehschreibtisch-1h',
    number: '18',
    title: '1 Stunde pro Arbeitstag im Stehen',
    body: 'Verbrennt +50 kcal/h und aktiviert die grossen Beinmuskeln. Buechergrapfelt reicht als Notfall-Stand.',
    category: 'bewegung',
    time: 'midday',
    effortMinutes: 60,
    effect: '+50 kcal/h',
  },
  {
    id: 'micro-workouts',
    number: '19',
    title: 'Alle 45 Min: 20 Sekunden aufstehen',
    body: 'Verhindert Stoffwechsel-Absturz beim Sitzen. Genug fuer eine Kurz-Aktivierung.',
    category: 'bewegung',
    time: 'anytime',
    effortMinutes: 1,
    effect: 'Kein Stoffwechsel-Nap',
  },
  {
    id: 'telefonieren-gehen',
    number: '20',
    title: 'Beim Telefonieren immer gehen',
    body: 'Ein 20-Min-Anruf im Sitzen = 20 kcal. Im Gehen = 80 kcal. 4x mehr, kein extra Aufwand.',
    category: 'bewegung',
    time: 'anytime',
    effortMinutes: 0,
    effect: '+60 kcal pro langem Call',
  },
  {
    id: 'einkauf-tragen',
    number: '21',
    title: 'Einkaeufe tragen statt schieben',
    body: 'Aktiviert Rumpf und Arme. Regelmaessig = kostenloses Ganzkoerper-Training.',
    category: 'bewegung',
    time: 'anytime',
    effortMinutes: 0,
    effect: '+50 kcal pro Einkauf',
  },
  {
    id: 'parkplatz-weit',
    number: '22',
    title: 'Immer den letzten Parkplatz',
    body: '2x pro Tag 200m Umweg = 800m extra. Ueber ein Jahr: 300 km — reicht fuer 3 kg Fett.',
    category: 'bewegung',
    time: 'anytime',
    effortMinutes: 3,
    effect: '-3 kg im Jahr aus 0 Aufwand',
  },
  {
    id: 'wandsitz-tv',
    number: '23',
    title: 'Wandsitz waehrend Zaehneputzen',
    body: 'Ruecken an die Wand, Beine 90°. 2 Min beim Zaehneputzen = starke Beinmuskel-Aktivierung.',
    category: 'bewegung',
    time: 'morning',
    effortMinutes: 2,
    effect: 'Beintraining ohne Zeitverlust',
  },

  // ============ SCHLAF ============
  {
    id: 'schlaf-7h',
    number: '24',
    title: 'Mindestens 7 Stunden Schlaf',
    body: 'Unter 6h steigt Ghrelin (Hungerhormon) um 15%, Leptin (Saettigung) sinkt um 15%. Du hast staendig Hunger.',
    category: 'schlaf',
    time: 'evening',
    effortMinutes: 0,
    effect: '-15% Hungergefuehl am Tag',
  },
  {
    id: 'handy-30min-vorher',
    number: '25',
    title: 'Handy 30 Min vor dem Schlafen weg',
    body: 'Blaulicht blockiert Melatonin — deine Fettverbrennung im Tiefschlaf leidet.',
    category: 'schlaf',
    time: 'evening',
    effortMinutes: 0,
    effect: 'Tieferer Schlaf, mehr Regeneration',
  },
  {
    id: 'schlafzimmer-kuehl',
    number: '26',
    title: 'Schlafzimmer auf 17-19 °C',
    body: 'Kaelte im Schlaf aktiviert braunes Fettgewebe — dein Koerper verbrennt Kalorien fuer die Waermeregulation.',
    category: 'kaelte',
    time: 'evening',
    effortMinutes: 0,
    effect: '+100 kcal pro Nacht',
  },
  {
    id: 'kein-alkohol-abends',
    number: '27',
    title: 'Kein Alkohol nach 20 Uhr',
    body: 'Alkohol reduziert REM-Schlaf um 40% — dein Wachstumshormon-Peak faellt aus, weniger Muskelerhalt.',
    category: 'schlaf',
    time: 'evening',
    effortMinutes: 0,
    effect: 'Wachstumshormon-Peak bleibt intakt',
  },
  {
    id: 'schlaf-routine',
    number: '28',
    title: 'Immer zur gleichen Zeit ins Bett',
    body: 'Regelmaessige Schlafenszeit stabilisiert Cortisol. Chaotischer Schlaf = mehr Bauchfett.',
    category: 'schlaf',
    time: 'evening',
    effortMinutes: 0,
    effect: '-15% Cortisol = weniger Bauchfett',
  },

  // ============ WASSER ============
  {
    id: 'zitronenwasser',
    number: '29',
    title: 'Morgens 500ml warmes Zitronenwasser',
    body: 'Startet den Stoffwechsel, aktiviert die Verdauung, du bist nicht so hungrig zum Fruehstueck.',
    category: 'wasser',
    time: 'morning',
    effortMinutes: 2,
    effect: 'Weniger Fruehstueck noetig',
  },
  {
    id: 'wasser-durst',
    number: '30',
    title: 'Bei "Hunger" erst 1 Glas Wasser',
    body: 'Durst wird oft als Hunger interpretiert. 80% aller Snack-Impulse sind Durst.',
    category: 'wasser',
    time: 'anytime',
    effortMinutes: 1,
    effect: '~200 kcal weniger pro Tag',
  },
  {
    id: 'eiswasser',
    number: '31',
    title: 'Eiswasser statt Zimmertemperatur',
    body: 'Dein Koerper braucht Energie um es aufzuwaermen. 1L Eiswasser = 30 kcal extra.',
    category: 'wasser',
    time: 'anytime',
    effortMinutes: 0,
    effect: '+30 kcal pro Liter',
  },

  // ============ PROTEIN ============
  {
    id: 'protein-erst',
    number: '32',
    title: 'Bei jeder Mahlzeit erst das Protein',
    body: 'Protein sattigt 3x staerker als Kohlenhydrate. Wenn es zuerst kommt, isst du automatisch weniger vom Rest.',
    category: 'protein',
    time: 'anytime',
    effortMinutes: 0,
    effect: 'Automatisch -15% Gesamtkalorien',
  },
  {
    id: 'skyr-nachmittag',
    number: '33',
    title: 'Skyr statt Suessigkeit am Nachmittag',
    body: '150g Skyr = 100 kcal, 17g Protein, sattigt 3h. Schokoriegel = 250 kcal, 2g Protein, hungrig in 45 Min.',
    category: 'protein',
    time: 'midday',
    effortMinutes: 1,
    effect: '-150 kcal, 8x mehr Protein',
  },
  {
    id: 'ei-immer',
    number: '34',
    title: 'Immer 2 Eier im Haus',
    body: '2 Eier = 12g Protein, 140 kcal, in 3 Min fertig. Beste Notfall-Waffe gegen Mikrowellen-Fertiggerichte.',
    category: 'protein',
    time: 'anytime',
    effortMinutes: 3,
    effect: 'Notfall-Mahlzeit statt Lieferservice',
  },
  {
    id: 'huettenkaese-abends',
    number: '35',
    title: 'Huettenkaese als Spaet-Snack',
    body: 'Casein-Protein wird langsam verdaut — versorgt deine Muskeln die ganze Nacht mit Aminosaeuren.',
    category: 'protein',
    time: 'evening',
    effortMinutes: 1,
    effect: 'Muskelabbau in der Nacht verhindert',
  },

  // ============ TIMING ============
  {
    id: 'fenster-12h',
    number: '36',
    title: '12 Stunden Ess-Pause pro Tag',
    body: 'Von 20:00 bis 8:00 nichts essen — nicht mal Milch im Kaffee. Insulin sinkt, Fettverbrennung startet.',
    category: 'timing',
    time: 'evening',
    effortMinutes: 0,
    effect: '~12h Fettverbrennungs-Modus',
  },
  {
    id: 'abendessen-fruehe',
    number: '37',
    title: 'Abendessen vor 19 Uhr',
    body: 'Frueh gegessene Kalorien werden anders verstoffwechselt — Studien zeigen -2-3 kg im Jahr bei gleicher Kalorienzahl.',
    category: 'timing',
    time: 'evening',
    effortMinutes: 0,
    effect: '-2-3 kg im Jahr, gleiche Kcal',
  },
  {
    id: 'training-nuechtern',
    number: '38',
    title: '2x/Woche nuechtern trainieren',
    body: '20 Min zuegiges Gehen vor dem Fruehstueck — der Koerper zieht Energie aus Fettreserven statt Glukose.',
    category: 'timing',
    time: 'morning',
    effortMinutes: 20,
    effect: '+30% Fettverbrennung pro Session',
  },
  {
    id: 'kein-snack-nach-abend',
    number: '39',
    title: 'Nach dem Abendessen: Zaehne putzen',
    body: 'Signalisiert dem Gehirn: fertig. Und der Minz-Geschmack macht Suessen weniger appetitlich.',
    category: 'timing',
    time: 'evening',
    effortMinutes: 2,
    effect: 'Keine Abend-Snacks mehr',
  },

  // ============ MENTAL ============
  {
    id: 'atem-5min',
    number: '40',
    title: '5 Minuten tief atmen bei Stress',
    body: 'Cortisol steuert Bauchfett-Speicherung. Tiefes Atmen senkt es messbar innerhalb von 3-5 Min.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 5,
    effect: '-20% Cortisol in 5 Min',
  },
  {
    id: 'sonne-morgens',
    number: '41',
    title: '10 Min Morgensonne (auch bewoelkt)',
    body: 'Reguliert Schlafhormon-Zyklus und senkt Abend-Cortisol. Weniger Nacht-Snacks, besserer Schlaf.',
    category: 'mental',
    time: 'morning',
    effortMinutes: 10,
    effect: 'Besserer Schlaf, weniger Bauchfett',
  },
  {
    id: 'essstop-drittel',
    number: '42',
    title: 'Bei Restaurant: 1/3 gleich in eine Box',
    body: 'Amerikanische Portionen sind kein Standard. Ein Drittel weg = du isst bewusst weniger.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 1,
    effect: '-33% Restaurant-Kalorien',
  },
  {
    id: 'foto-vorher-nachher',
    number: '43',
    title: 'Jede Woche 1 Foto von dir',
    body: 'Die Waage luegt taeglich. Ein Foto pro Woche zeigt echte Veraenderung — Motivations-Boost der Extra-Klasse.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 1,
    effect: 'Motivation bleibt hoch',
  },
  {
    id: 'stopp-emotional-essen',
    number: '44',
    title: 'Vor dem Snack: 3 Fragen',
    body: 'Habe ich Hunger? Bin ich muede? Bin ich gestresst? Wenn 2 und 3 mit ja — der Snack loest das Problem nicht.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 1,
    effect: '-50% emotionale Snacks',
  },

  // ============ KAELTE ============
  {
    id: 'jacke-1h-aus',
    number: '45',
    title: '1 Grad kaelter im Wohnzimmer',
    body: 'Dein Koerper aktiviert braunes Fett um sich warmzuhalten. -1°C = etwa +50 kcal/Tag ohne Aufwand.',
    category: 'kaelte',
    time: 'anytime',
    effortMinutes: 0,
    effect: '+50 kcal/Tag',
  },
  {
    id: 'gesichtwaschen-kalt',
    number: '46',
    title: 'Morgens Gesicht mit eiskaltem Wasser',
    body: 'Aktiviert Vagusnerv und senkt Morgen-Cortisol. Wacher als jeder Kaffee, kein Crash.',
    category: 'kaelte',
    time: 'morning',
    effortMinutes: 1,
    effect: 'Wach wie nach Kaffee, kein Crash',
  },

  // ============ EXTRA (Alltags-Kniffe) ============
  {
    id: 'kokosoel-cocking',
    number: '47',
    title: 'MCT-Oel oder Kokosoel statt Butter',
    body: 'MCTs werden direkt in Energie umgewandelt statt gespeichert. Gleicher Geschmack, weniger Fettdepot.',
    category: 'stoffwechsel',
    time: 'anytime',
    effortMinutes: 0,
    effect: 'Direkter Energie-Modus',
  },
  {
    id: 'zwei-fasten-tage',
    number: '48',
    title: 'Suessigkeiten nur an 2 Tagen pro Woche',
    body: 'Nicht komplett verzichten — begrenzen. Sa und So Deals. Rest der Woche = klar.',
    category: 'timing',
    time: 'anytime',
    effortMinutes: 0,
    effect: '-70% Zucker ohne Verzicht',
  },
  {
    id: 'meal-prep-sonntag',
    number: '49',
    title: 'Sonntag Abend: 3 Portionen kochen',
    body: 'Bereite Mo/Di/Mi vor. Wenn du muede aus der Arbeit kommst, gibts keinen Grund zu bestellen.',
    category: 'timing',
    time: 'evening',
    effortMinutes: 45,
    effect: 'Keine Impuls-Bestellungen mehr',
  },
  {
    id: 'wasser-flasche-sichtbar',
    number: '50',
    title: 'Wasser-Flasche immer im Blick',
    body: 'Was du siehst, benutzt du. Eine 750ml-Flasche auf dem Schreibtisch = automatisch 2L pro Tag.',
    category: 'wasser',
    time: 'anytime',
    effortMinutes: 0,
    effect: '+1 L Wasser ohne Willenskraft',
  },
  {
    id: 'obst-augenhoehe',
    number: '51',
    title: 'Obst auf Augenhoehe, Suesses ganz oben',
    body: 'Aus den Augen aus dem Sinn. Was du sehen musst um es zu holen, wird 30% weniger konsumiert.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 5,
    effect: '-30% Suesses-Konsum',
  },
  {
    id: 'einkauf-satt',
    number: '52',
    title: 'Nie hungrig einkaufen',
    body: 'Hungrige Einkaufe enden mit 40% mehr Junk im Wagen. Vorher eine Handvoll Nuesse.',
    category: 'mental',
    time: 'anytime',
    effortMinutes: 1,
    effect: '-40% Junk-Kaeufe',
  },
  {
    id: 'muesli-selbst',
    number: '53',
    title: 'Muesli selber mischen',
    body: 'Fertigmuesli hat 30-40% Zucker. Deins: Haferflocken, Nuesse, Beeren = 5%.',
    category: 'blutzucker',
    time: 'morning',
    effortMinutes: 3,
    effect: '-30% Zucker beim Fruehstueck',
  },
];

/** Hack des Tages — rotiert deterministisch je Datum */
export function todaysHack(): Hack {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return HACKS[dayOfYear % HACKS.length];
}

/** Hack passend zur aktuellen Tageszeit */
export function hackForNow(): Hack {
  const h = new Date().getHours();
  const target: HackTime = h < 11 ? 'morning' : h < 17 ? 'midday' : 'evening';
  const relevant = HACKS.filter((x) => x.time === target || x.time === 'anytime');
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return relevant[dayOfYear % relevant.length];
}

/** Kategorie-Meta fuer die UI */
export const CATEGORY_META: Record<
  HackCategory,
  { label: string; emoji: string; tagline: string }
> = {
  stoffwechsel: {
    label: 'Stoffwechsel',
    emoji: '🔥',
    tagline: 'Turbo fuer deinen Metabolismus',
  },
  blutzucker: {
    label: 'Blutzucker',
    emoji: '📉',
    tagline: 'Insulin-Peaks glaetten',
  },
  saettigung: {
    label: 'Saettigung',
    emoji: '🍽️',
    tagline: 'Weniger essen ohne Hunger',
  },
  bewegung: {
    label: 'Bewegung',
    emoji: '🚶',
    tagline: 'Micro-Movements im Alltag',
  },
  schlaf: {
    label: 'Schlaf',
    emoji: '🌙',
    tagline: 'Regeneration = Fettverbrennung',
  },
  wasser: { label: 'Wasser', emoji: '💧', tagline: 'Hydration-Kniffe' },
  protein: {
    label: 'Protein',
    emoji: '💪',
    tagline: 'Muskeln erhalten beim Abnehmen',
  },
  timing: { label: 'Timing', emoji: '⏰', tagline: 'Wann statt was' },
  mental: {
    label: 'Mental',
    emoji: '🧠',
    tagline: 'Kopf statt Verzicht',
  },
  kaelte: {
    label: 'Kaelte',
    emoji: '❄️',
    tagline: 'Braunes Fett aktivieren',
  },
};

export function hacksByCategory(cat: HackCategory): Hack[] {
  return HACKS.filter((h) => h.category === cat);
}
