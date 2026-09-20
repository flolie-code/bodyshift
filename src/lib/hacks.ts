/**
 * Alltags-Hacks für Stoffwechsel-Aktivierung.
 * Statisch für Start, später aus Supabase mit Rotation.
 */

export type Hack = {
  id: string;
  number: string;
  title: string;
  body: string;
};

export const HACKS: Hack[] = [
  {
    id: 'kaffee-kniebeugen',
    number: '01',
    title: 'Nach jedem Kaffee 30 Kniebeugen',
    body: 'Aktiviert Glukose-Transport in die Muskeln — verbrennt bis zu 40 kcal extra pro Runde und stabilisiert den Blutzucker.',
  },
  {
    id: 'spaziergang-mahlzeit',
    number: '02',
    title: '10-Minuten-Spaziergang nach jeder Mahlzeit',
    body: 'Senkt den Blutzucker-Peak nachweislich um bis zu 30 % — kein Insulinstoß, weniger Fettspeicherung.',
  },
  {
    id: 'kalt-duschen',
    number: '03',
    title: 'Kalt duschen (30 Sek. am Ende)',
    body: 'Aktiviert braunes Fettgewebe — dein Körper verbrennt 100–250 kcal zusätzlich zum Aufwärmen.',
  },
  {
    id: 'wasser-vor-mahlzeit',
    number: '04',
    title: '500 ml Wasser 20 Min vor jeder Mahlzeit',
    body: 'Studien zeigen ~20 % weniger Kalorien-Aufnahme pro Mahlzeit — ohne Verzicht, nur mit Wasser.',
  },
  {
    id: 'protein-frueh',
    number: '05',
    title: '30 g Protein zum Frühstück',
    body: 'Sättigt für 4-5 Stunden, reduziert Heißhunger am Nachmittag deutlich. Skyr, Eier oder Proteinshake.',
  },
  {
    id: 'treppe-statt-lift',
    number: '06',
    title: 'Immer die Treppe statt Aufzug',
    body: 'Klingt trivial — bei 3 Stockwerken × 5×/Tag = 90 kcal extra am Tag, ohne einen Meter fürs Training zu machen.',
  },
];

/** Gibt den Hack des Tages zurück (rotiert basierend auf Datum) */
export function todaysHack(): Hack {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return HACKS[dayOfYear % HACKS.length];
}
