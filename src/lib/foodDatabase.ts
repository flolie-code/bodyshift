/**
 * Deutsche Lebensmittel-Datenbank fuer BodyShift.
 *
 * Naehrwerte pro 100 g bzw. 100 ml (Fluessigkeiten).
 * Quelle: Bundeslebensmittelschluessel + eigene Recherche.
 *
 * Fuer den User: statt manuell Kalorien zu wissen, tippt er den Namen,
 * die App zeigt Vorschlaege und rechnet auf die eingegebene Portion um.
 */

export type FoodItem = {
  id: string;
  name: string;
  aliases?: string[]; // alternative Suchbegriffe
  kcalPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  defaultPortion?: number; // typische Portionsgroesse in g
  emoji?: string;
  category: FoodCategory;
};

export type FoodCategory =
  | 'obst'
  | 'gemuese'
  | 'fleisch'
  | 'fisch'
  | 'milchprodukt'
  | 'getreide'
  | 'huelsenfruechte'
  | 'nuesse'
  | 'suesses'
  | 'getraenk'
  | 'fett'
  | 'fertiggericht'
  | 'sonstiges';

export const FOODS: FoodItem[] = [
  // ============ OBST ============
  { id: 'apfel', name: 'Apfel', kcalPer100: 52, proteinPer100: 0.3, carbsPer100: 14, fatPer100: 0.2, defaultPortion: 150, emoji: '🍎', category: 'obst' },
  { id: 'banane', name: 'Banane', kcalPer100: 89, proteinPer100: 1.1, carbsPer100: 23, fatPer100: 0.3, defaultPortion: 120, emoji: '🍌', category: 'obst' },
  { id: 'orange', name: 'Orange', kcalPer100: 47, proteinPer100: 0.9, carbsPer100: 12, fatPer100: 0.1, defaultPortion: 130, emoji: '🍊', category: 'obst' },
  { id: 'birne', name: 'Birne', kcalPer100: 57, proteinPer100: 0.4, carbsPer100: 15, fatPer100: 0.1, defaultPortion: 150, emoji: '🍐', category: 'obst' },
  { id: 'erdbeeren', name: 'Erdbeeren', aliases: ['erdbeere'], kcalPer100: 32, proteinPer100: 0.7, carbsPer100: 8, fatPer100: 0.3, defaultPortion: 150, emoji: '🍓', category: 'obst' },
  { id: 'heidelbeeren', name: 'Heidelbeeren', aliases: ['blaubeeren'], kcalPer100: 42, proteinPer100: 0.7, carbsPer100: 10, fatPer100: 0.6, defaultPortion: 100, emoji: '🫐', category: 'obst' },
  { id: 'himbeeren', name: 'Himbeeren', kcalPer100: 43, proteinPer100: 1.3, carbsPer100: 5, fatPer100: 0.3, defaultPortion: 100, emoji: '🫐', category: 'obst' },
  { id: 'weintrauben', name: 'Weintrauben', aliases: ['trauben'], kcalPer100: 69, proteinPer100: 0.7, carbsPer100: 17, fatPer100: 0.2, defaultPortion: 100, emoji: '🍇', category: 'obst' },
  { id: 'mango', name: 'Mango', kcalPer100: 60, proteinPer100: 0.8, carbsPer100: 15, fatPer100: 0.4, defaultPortion: 150, emoji: '🥭', category: 'obst' },
  { id: 'ananas', name: 'Ananas', kcalPer100: 50, proteinPer100: 0.5, carbsPer100: 13, fatPer100: 0.1, defaultPortion: 150, emoji: '🍍', category: 'obst' },
  { id: 'wassermelone', name: 'Wassermelone', kcalPer100: 30, proteinPer100: 0.6, carbsPer100: 8, fatPer100: 0.2, defaultPortion: 200, emoji: '🍉', category: 'obst' },
  { id: 'kiwi', name: 'Kiwi', kcalPer100: 61, proteinPer100: 1.1, carbsPer100: 15, fatPer100: 0.5, defaultPortion: 80, emoji: '🥝', category: 'obst' },
  { id: 'avocado', name: 'Avocado', kcalPer100: 160, proteinPer100: 2, carbsPer100: 9, fatPer100: 15, defaultPortion: 150, emoji: '🥑', category: 'obst' },

  // ============ GEMUESE ============
  { id: 'tomate', name: 'Tomate', kcalPer100: 18, proteinPer100: 0.9, carbsPer100: 3.9, fatPer100: 0.2, defaultPortion: 100, emoji: '🍅', category: 'gemuese' },
  { id: 'gurke', name: 'Gurke', kcalPer100: 15, proteinPer100: 0.7, carbsPer100: 3.6, fatPer100: 0.1, defaultPortion: 150, emoji: '🥒', category: 'gemuese' },
  { id: 'paprika', name: 'Paprika', kcalPer100: 31, proteinPer100: 1, carbsPer100: 6, fatPer100: 0.3, defaultPortion: 100, emoji: '🫑', category: 'gemuese' },
  { id: 'karotte', name: 'Karotte', aliases: ['moehre'], kcalPer100: 41, proteinPer100: 0.9, carbsPer100: 10, fatPer100: 0.2, defaultPortion: 100, emoji: '🥕', category: 'gemuese' },
  { id: 'brokkoli', name: 'Brokkoli', kcalPer100: 34, proteinPer100: 2.8, carbsPer100: 7, fatPer100: 0.4, defaultPortion: 150, emoji: '🥦', category: 'gemuese' },
  { id: 'blumenkohl', name: 'Blumenkohl', kcalPer100: 25, proteinPer100: 1.9, carbsPer100: 5, fatPer100: 0.3, defaultPortion: 200, emoji: '🥦', category: 'gemuese' },
  { id: 'spinat', name: 'Spinat', kcalPer100: 23, proteinPer100: 2.9, carbsPer100: 4, fatPer100: 0.4, defaultPortion: 100, emoji: '🥬', category: 'gemuese' },
  { id: 'salat', name: 'Kopfsalat', aliases: ['salat'], kcalPer100: 15, proteinPer100: 1.4, carbsPer100: 2.9, fatPer100: 0.1, defaultPortion: 80, emoji: '🥬', category: 'gemuese' },
  { id: 'zucchini', name: 'Zucchini', kcalPer100: 17, proteinPer100: 1.2, carbsPer100: 3.1, fatPer100: 0.3, defaultPortion: 150, emoji: '🥒', category: 'gemuese' },
  { id: 'aubergine', name: 'Aubergine', kcalPer100: 25, proteinPer100: 1, carbsPer100: 6, fatPer100: 0.2, defaultPortion: 150, emoji: '🍆', category: 'gemuese' },
  { id: 'kartoffel', name: 'Kartoffel gekocht', aliases: ['kartoffel', 'erdapfel'], kcalPer100: 77, proteinPer100: 2, carbsPer100: 17, fatPer100: 0.1, defaultPortion: 200, emoji: '🥔', category: 'gemuese' },
  { id: 'suesskartoffel', name: 'Suesskartoffel', kcalPer100: 86, proteinPer100: 1.6, carbsPer100: 20, fatPer100: 0.1, defaultPortion: 150, emoji: '🍠', category: 'gemuese' },
  { id: 'champignons', name: 'Champignons', kcalPer100: 22, proteinPer100: 3.1, carbsPer100: 3.3, fatPer100: 0.3, defaultPortion: 100, emoji: '🍄', category: 'gemuese' },

  // ============ FLEISCH ============
  { id: 'haehnchenbrust', name: 'Haehnchenbrust', aliases: ['hendlbrust', 'hendl'], kcalPer100: 165, proteinPer100: 31, carbsPer100: 0, fatPer100: 4, defaultPortion: 150, emoji: '🍗', category: 'fleisch' },
  { id: 'putenbrust', name: 'Putenbrust', kcalPer100: 135, proteinPer100: 30, carbsPer100: 0, fatPer100: 1.5, defaultPortion: 150, emoji: '🍗', category: 'fleisch' },
  { id: 'rindfleisch-mager', name: 'Rindfleisch mager', aliases: ['rind'], kcalPer100: 158, proteinPer100: 21, carbsPer100: 0, fatPer100: 8, defaultPortion: 150, emoji: '🥩', category: 'fleisch' },
  { id: 'schweinefleisch-mager', name: 'Schweinefleisch mager', aliases: ['schwein'], kcalPer100: 143, proteinPer100: 21, carbsPer100: 0, fatPer100: 6.5, defaultPortion: 150, emoji: '🥩', category: 'fleisch' },
  { id: 'schweineschnitzel', name: 'Schweineschnitzel paniert', aliases: ['wiener schnitzel', 'schnitzel'], kcalPer100: 250, proteinPer100: 20, carbsPer100: 12, fatPer100: 14, defaultPortion: 200, emoji: '🍖', category: 'fleisch' },
  { id: 'wurst', name: 'Wurst gemischt', kcalPer100: 300, proteinPer100: 13, carbsPer100: 2, fatPer100: 27, defaultPortion: 50, emoji: '🌭', category: 'fleisch' },
  { id: 'salami', name: 'Salami', kcalPer100: 400, proteinPer100: 22, carbsPer100: 1, fatPer100: 34, defaultPortion: 30, emoji: '🍕', category: 'fleisch' },
  { id: 'schinken', name: 'Kochschinken', aliases: ['schinken'], kcalPer100: 105, proteinPer100: 21, carbsPer100: 0.5, fatPer100: 2, defaultPortion: 40, emoji: '🥓', category: 'fleisch' },
  { id: 'speck', name: 'Speck', kcalPer100: 400, proteinPer100: 25, carbsPer100: 0, fatPer100: 34, defaultPortion: 30, emoji: '🥓', category: 'fleisch' },

  // ============ FISCH ============
  { id: 'lachs', name: 'Lachs', kcalPer100: 208, proteinPer100: 20, carbsPer100: 0, fatPer100: 13, defaultPortion: 150, emoji: '🐟', category: 'fisch' },
  { id: 'thunfisch-frisch', name: 'Thunfisch frisch', kcalPer100: 144, proteinPer100: 23, carbsPer100: 0, fatPer100: 5, defaultPortion: 150, emoji: '🐟', category: 'fisch' },
  { id: 'thunfisch-dose', name: 'Thunfisch in Wasser (Dose)', kcalPer100: 116, proteinPer100: 26, carbsPer100: 0, fatPer100: 1, defaultPortion: 100, emoji: '🐟', category: 'fisch' },
  { id: 'forelle', name: 'Forelle', kcalPer100: 130, proteinPer100: 20, carbsPer100: 0, fatPer100: 5, defaultPortion: 150, emoji: '🐟', category: 'fisch' },
  { id: 'garnelen', name: 'Garnelen', kcalPer100: 99, proteinPer100: 24, carbsPer100: 0, fatPer100: 0.3, defaultPortion: 150, emoji: '🍤', category: 'fisch' },
  { id: 'fischstaebchen', name: 'Fischstaebchen', kcalPer100: 225, proteinPer100: 13, carbsPer100: 20, fatPer100: 10, defaultPortion: 120, emoji: '🐟', category: 'fisch' },

  // ============ MILCHPRODUKT ============
  { id: 'milch-vollmilch', name: 'Vollmilch 3,5%', aliases: ['milch'], kcalPer100: 64, proteinPer100: 3.3, carbsPer100: 4.8, fatPer100: 3.5, defaultPortion: 250, emoji: '🥛', category: 'milchprodukt' },
  { id: 'milch-fettarm', name: 'Fettarme Milch 1,5%', kcalPer100: 47, proteinPer100: 3.5, carbsPer100: 4.9, fatPer100: 1.5, defaultPortion: 250, emoji: '🥛', category: 'milchprodukt' },
  { id: 'joghurt-natur', name: 'Joghurt natur 3,5%', kcalPer100: 60, proteinPer100: 3.5, carbsPer100: 4.7, fatPer100: 3.5, defaultPortion: 150, emoji: '🥛', category: 'milchprodukt' },
  { id: 'skyr', name: 'Skyr', kcalPer100: 62, proteinPer100: 11, carbsPer100: 4, fatPer100: 0.2, defaultPortion: 150, emoji: '🥛', category: 'milchprodukt' },
  { id: 'huettenkaese', name: 'Huettenkaese', kcalPer100: 98, proteinPer100: 12, carbsPer100: 3, fatPer100: 4.3, defaultPortion: 200, emoji: '🧀', category: 'milchprodukt' },
  { id: 'quark-mager', name: 'Magertopfen', aliases: ['quark', 'magerquark', 'topfen'], kcalPer100: 71, proteinPer100: 13, carbsPer100: 4, fatPer100: 0.2, defaultPortion: 250, emoji: '🥛', category: 'milchprodukt' },
  { id: 'quark-halbfett', name: 'Halbfett-Topfen 20%', aliases: ['topfen'], kcalPer100: 108, proteinPer100: 12, carbsPer100: 3.2, fatPer100: 5, defaultPortion: 200, emoji: '🥛', category: 'milchprodukt' },
  { id: 'gouda', name: 'Gouda', kcalPer100: 356, proteinPer100: 25, carbsPer100: 2.2, fatPer100: 27, defaultPortion: 30, emoji: '🧀', category: 'milchprodukt' },
  { id: 'mozzarella', name: 'Mozzarella', kcalPer100: 253, proteinPer100: 18, carbsPer100: 2, fatPer100: 20, defaultPortion: 125, emoji: '🧀', category: 'milchprodukt' },
  { id: 'feta', name: 'Feta', kcalPer100: 264, proteinPer100: 14, carbsPer100: 4, fatPer100: 21, defaultPortion: 50, emoji: '🧀', category: 'milchprodukt' },
  { id: 'butter', name: 'Butter', kcalPer100: 720, proteinPer100: 0.7, carbsPer100: 0.7, fatPer100: 82, defaultPortion: 10, emoji: '🧈', category: 'milchprodukt' },
  { id: 'ei', name: 'Ei (60 g)', aliases: ['huehnerei'], kcalPer100: 155, proteinPer100: 13, carbsPer100: 1.1, fatPer100: 11, defaultPortion: 60, emoji: '🥚', category: 'milchprodukt' },

  // ============ GETREIDE / BROT ============
  { id: 'brot-vollkorn', name: 'Vollkornbrot', kcalPer100: 235, proteinPer100: 9, carbsPer100: 41, fatPer100: 3, defaultPortion: 50, emoji: '🍞', category: 'getreide' },
  { id: 'brot-weiss', name: 'Weissbrot', aliases: ['brot', 'weissbrot'], kcalPer100: 267, proteinPer100: 8, carbsPer100: 53, fatPer100: 3, defaultPortion: 50, emoji: '🍞', category: 'getreide' },
  { id: 'semmel', name: 'Semmel', aliases: ['broetchen'], kcalPer100: 280, proteinPer100: 9, carbsPer100: 55, fatPer100: 2, defaultPortion: 45, emoji: '🥐', category: 'getreide' },
  { id: 'toast', name: 'Toastbrot', kcalPer100: 275, proteinPer100: 8, carbsPer100: 51, fatPer100: 4, defaultPortion: 30, emoji: '🍞', category: 'getreide' },
  { id: 'haferflocken', name: 'Haferflocken', kcalPer100: 368, proteinPer100: 13, carbsPer100: 59, fatPer100: 7, defaultPortion: 50, emoji: '🥣', category: 'getreide' },
  { id: 'muesli', name: 'Muesli natur', aliases: ['muesli'], kcalPer100: 350, proteinPer100: 10, carbsPer100: 60, fatPer100: 7, defaultPortion: 60, emoji: '🥣', category: 'getreide' },
  { id: 'cornflakes', name: 'Cornflakes', kcalPer100: 360, proteinPer100: 7, carbsPer100: 84, fatPer100: 0.9, defaultPortion: 40, emoji: '🥣', category: 'getreide' },
  { id: 'reis-gekocht', name: 'Reis gekocht', aliases: ['reis'], kcalPer100: 130, proteinPer100: 2.7, carbsPer100: 28, fatPer100: 0.3, defaultPortion: 200, emoji: '🍚', category: 'getreide' },
  { id: 'basmatireis', name: 'Basmatireis gekocht', kcalPer100: 138, proteinPer100: 3, carbsPer100: 30, fatPer100: 0.4, defaultPortion: 200, emoji: '🍚', category: 'getreide' },
  { id: 'nudeln-gekocht', name: 'Nudeln gekocht', aliases: ['nudeln', 'pasta'], kcalPer100: 158, proteinPer100: 5.8, carbsPer100: 31, fatPer100: 0.9, defaultPortion: 250, emoji: '🍝', category: 'getreide' },
  { id: 'vollkornnudeln', name: 'Vollkornnudeln gekocht', kcalPer100: 149, proteinPer100: 6, carbsPer100: 30, fatPer100: 1.3, defaultPortion: 250, emoji: '🍝', category: 'getreide' },
  { id: 'couscous', name: 'Couscous gekocht', kcalPer100: 112, proteinPer100: 3.8, carbsPer100: 23, fatPer100: 0.2, defaultPortion: 200, emoji: '🍚', category: 'getreide' },
  { id: 'quinoa', name: 'Quinoa gekocht', kcalPer100: 120, proteinPer100: 4.4, carbsPer100: 21, fatPer100: 1.9, defaultPortion: 200, emoji: '🍚', category: 'getreide' },
  { id: 'bulgur', name: 'Bulgur gekocht', kcalPer100: 83, proteinPer100: 3, carbsPer100: 19, fatPer100: 0.2, defaultPortion: 200, emoji: '🍚', category: 'getreide' },

  // ============ HUELSENFRUECHTE ============
  { id: 'linsen-gekocht', name: 'Linsen gekocht', kcalPer100: 116, proteinPer100: 9, carbsPer100: 20, fatPer100: 0.4, defaultPortion: 150, emoji: '🫘', category: 'huelsenfruechte' },
  { id: 'kichererbsen', name: 'Kichererbsen gekocht', kcalPer100: 164, proteinPer100: 9, carbsPer100: 27, fatPer100: 2.6, defaultPortion: 150, emoji: '🫘', category: 'huelsenfruechte' },
  { id: 'bohnen-weiss', name: 'Weisse Bohnen gekocht', aliases: ['bohnen'], kcalPer100: 139, proteinPer100: 9, carbsPer100: 25, fatPer100: 0.5, defaultPortion: 150, emoji: '🫘', category: 'huelsenfruechte' },
  { id: 'kidney-bohnen', name: 'Kidneybohnen', kcalPer100: 127, proteinPer100: 9, carbsPer100: 23, fatPer100: 0.5, defaultPortion: 150, emoji: '🫘', category: 'huelsenfruechte' },
  { id: 'tofu', name: 'Tofu natur', kcalPer100: 76, proteinPer100: 8, carbsPer100: 2, fatPer100: 4.8, defaultPortion: 150, emoji: '🍱', category: 'huelsenfruechte' },

  // ============ NUESSE ============
  { id: 'mandeln', name: 'Mandeln', kcalPer100: 579, proteinPer100: 21, carbsPer100: 22, fatPer100: 50, defaultPortion: 30, emoji: '🌰', category: 'nuesse' },
  { id: 'walnuesse', name: 'Walnuesse', kcalPer100: 654, proteinPer100: 15, carbsPer100: 14, fatPer100: 65, defaultPortion: 30, emoji: '🌰', category: 'nuesse' },
  { id: 'cashewkerne', name: 'Cashewkerne', kcalPer100: 553, proteinPer100: 18, carbsPer100: 30, fatPer100: 44, defaultPortion: 30, emoji: '🌰', category: 'nuesse' },
  { id: 'haselnuesse', name: 'Haselnuesse', kcalPer100: 628, proteinPer100: 15, carbsPer100: 17, fatPer100: 61, defaultPortion: 30, emoji: '🌰', category: 'nuesse' },
  { id: 'erdnuesse', name: 'Erdnuesse', kcalPer100: 567, proteinPer100: 26, carbsPer100: 16, fatPer100: 49, defaultPortion: 30, emoji: '🥜', category: 'nuesse' },
  { id: 'erdnussbutter', name: 'Erdnussbutter', kcalPer100: 588, proteinPer100: 25, carbsPer100: 20, fatPer100: 50, defaultPortion: 15, emoji: '🥜', category: 'nuesse' },
  { id: 'chia-samen', name: 'Chia-Samen', kcalPer100: 486, proteinPer100: 17, carbsPer100: 42, fatPer100: 31, defaultPortion: 15, emoji: '🌱', category: 'nuesse' },
  { id: 'leinsamen', name: 'Leinsamen', kcalPer100: 534, proteinPer100: 18, carbsPer100: 29, fatPer100: 42, defaultPortion: 15, emoji: '🌱', category: 'nuesse' },

  // ============ SUESSES ============
  { id: 'schokolade-vollmilch', name: 'Vollmilchschokolade', aliases: ['schokolade'], kcalPer100: 535, proteinPer100: 8, carbsPer100: 59, fatPer100: 30, defaultPortion: 30, emoji: '🍫', category: 'suesses' },
  { id: 'schokolade-dunkel', name: 'Zartbitterschokolade 70%', kcalPer100: 546, proteinPer100: 8, carbsPer100: 46, fatPer100: 38, defaultPortion: 20, emoji: '🍫', category: 'suesses' },
  { id: 'eis-vanille', name: 'Vanilleeis', aliases: ['eis'], kcalPer100: 200, proteinPer100: 3.5, carbsPer100: 24, fatPer100: 10, defaultPortion: 100, emoji: '🍦', category: 'suesses' },
  { id: 'kuchen', name: 'Kuchen (Sandkuchen)', kcalPer100: 400, proteinPer100: 6, carbsPer100: 55, fatPer100: 17, defaultPortion: 80, emoji: '🍰', category: 'suesses' },
  { id: 'kekse', name: 'Kekse', kcalPer100: 480, proteinPer100: 6, carbsPer100: 65, fatPer100: 22, defaultPortion: 30, emoji: '🍪', category: 'suesses' },
  { id: 'honig', name: 'Honig', kcalPer100: 302, proteinPer100: 0.4, carbsPer100: 75, fatPer100: 0, defaultPortion: 10, emoji: '🍯', category: 'suesses' },
  { id: 'marmelade', name: 'Marmelade', kcalPer100: 245, proteinPer100: 0.5, carbsPer100: 60, fatPer100: 0.1, defaultPortion: 15, emoji: '🍯', category: 'suesses' },
  { id: 'zucker', name: 'Zucker', kcalPer100: 405, proteinPer100: 0, carbsPer100: 100, fatPer100: 0, defaultPortion: 5, emoji: '🍯', category: 'suesses' },
  { id: 'gummibaerchen', name: 'Gummibaerchen', kcalPer100: 340, proteinPer100: 6, carbsPer100: 78, fatPer100: 0, defaultPortion: 30, emoji: '🍬', category: 'suesses' },

  // ============ GETRAENKE ============
  { id: 'wasser', name: 'Wasser', kcalPer100: 0, proteinPer100: 0, carbsPer100: 0, fatPer100: 0, defaultPortion: 500, emoji: '💧', category: 'getraenk' },
  { id: 'kaffee-schwarz', name: 'Kaffee schwarz', aliases: ['kaffee'], kcalPer100: 2, proteinPer100: 0.1, carbsPer100: 0, fatPer100: 0, defaultPortion: 200, emoji: '☕', category: 'getraenk' },
  { id: 'tee', name: 'Tee (ungesuesst)', kcalPer100: 1, proteinPer100: 0, carbsPer100: 0.2, fatPer100: 0, defaultPortion: 250, emoji: '🍵', category: 'getraenk' },
  { id: 'cola', name: 'Cola', kcalPer100: 42, proteinPer100: 0, carbsPer100: 10.6, fatPer100: 0, defaultPortion: 330, emoji: '🥤', category: 'getraenk' },
  { id: 'cola-zero', name: 'Cola Zero', kcalPer100: 0.3, proteinPer100: 0, carbsPer100: 0, fatPer100: 0, defaultPortion: 330, emoji: '🥤', category: 'getraenk' },
  { id: 'saft-apfel', name: 'Apfelsaft', kcalPer100: 46, proteinPer100: 0.1, carbsPer100: 11, fatPer100: 0.1, defaultPortion: 200, emoji: '🧃', category: 'getraenk' },
  { id: 'saft-orange', name: 'Orangensaft', kcalPer100: 45, proteinPer100: 0.7, carbsPer100: 10, fatPer100: 0.2, defaultPortion: 200, emoji: '🧃', category: 'getraenk' },
  { id: 'bier', name: 'Bier', kcalPer100: 43, proteinPer100: 0.5, carbsPer100: 3.6, fatPer100: 0, defaultPortion: 500, emoji: '🍺', category: 'getraenk' },
  { id: 'wein-rot', name: 'Rotwein', aliases: ['wein'], kcalPer100: 85, proteinPer100: 0.1, carbsPer100: 2.6, fatPer100: 0, defaultPortion: 150, emoji: '🍷', category: 'getraenk' },
  { id: 'wein-weiss', name: 'Weisswein', kcalPer100: 82, proteinPer100: 0.1, carbsPer100: 2.6, fatPer100: 0, defaultPortion: 150, emoji: '🍷', category: 'getraenk' },
  { id: 'proteinshake', name: 'Proteinshake (Wasser)', kcalPer100: 100, proteinPer100: 22, carbsPer100: 2, fatPer100: 1, defaultPortion: 300, emoji: '🥤', category: 'getraenk' },

  // ============ FETTE / OELE ============
  { id: 'olivenoel', name: 'Olivenoel', aliases: ['oel'], kcalPer100: 884, proteinPer100: 0, carbsPer100: 0, fatPer100: 100, defaultPortion: 10, emoji: '🫒', category: 'fett' },
  { id: 'kokosoel', name: 'Kokosoel', kcalPer100: 862, proteinPer100: 0, carbsPer100: 0, fatPer100: 100, defaultPortion: 10, emoji: '🥥', category: 'fett' },
  { id: 'margarine', name: 'Margarine', kcalPer100: 700, proteinPer100: 0.2, carbsPer100: 0.4, fatPer100: 80, defaultPortion: 10, emoji: '🧈', category: 'fett' },

  // ============ FERTIGGERICHTE / TAKEAWAY ============
  { id: 'pizza-margherita', name: 'Pizza Margherita', aliases: ['pizza'], kcalPer100: 265, proteinPer100: 11, carbsPer100: 33, fatPer100: 10, defaultPortion: 300, emoji: '🍕', category: 'fertiggericht' },
  { id: 'pizza-salami', name: 'Pizza Salami', kcalPer100: 295, proteinPer100: 12, carbsPer100: 32, fatPer100: 13, defaultPortion: 300, emoji: '🍕', category: 'fertiggericht' },
  { id: 'burger', name: 'Hamburger', kcalPer100: 250, proteinPer100: 15, carbsPer100: 20, fatPer100: 13, defaultPortion: 250, emoji: '🍔', category: 'fertiggericht' },
  { id: 'pommes', name: 'Pommes frites', aliases: ['pommes', 'fritten'], kcalPer100: 312, proteinPer100: 3.4, carbsPer100: 41, fatPer100: 15, defaultPortion: 150, emoji: '🍟', category: 'fertiggericht' },
  { id: 'doener', name: 'Doener Kebab', kcalPer100: 225, proteinPer100: 15, carbsPer100: 20, fatPer100: 10, defaultPortion: 400, emoji: '🥙', category: 'fertiggericht' },
  { id: 'sushi', name: 'Sushi (Maki)', kcalPer100: 150, proteinPer100: 6, carbsPer100: 25, fatPer100: 3, defaultPortion: 200, emoji: '🍣', category: 'fertiggericht' },
  { id: 'salat-caesar', name: 'Caesar Salat', kcalPer100: 180, proteinPer100: 10, carbsPer100: 8, fatPer100: 13, defaultPortion: 300, emoji: '🥗', category: 'fertiggericht' },
];

/** Fuzzy-Suche in der Datenbank */
export function searchFoods(query: string): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: Array<{ item: FoodItem; score: number }> = [];

  for (const food of FOODS) {
    const name = food.name.toLowerCase();
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 60;

    for (const alias of food.aliases ?? []) {
      const a = alias.toLowerCase();
      if (a === q) score = Math.max(score, 95);
      else if (a.startsWith(q)) score = Math.max(score, 75);
      else if (a.includes(q)) score = Math.max(score, 55);
    }

    if (score > 0) results.push({ item: food, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 12).map((r) => r.item);
}

/** Naehrwerte fuer eine bestimmte Portion berechnen */
export function scaleFoodTo(food: FoodItem, grams: number): {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const factor = grams / 100;
  return {
    kcal: Math.round(food.kcalPer100 * factor),
    protein: +(food.proteinPer100 * factor).toFixed(1),
    carbs: +(food.carbsPer100 * factor).toFixed(1),
    fat: +(food.fatPer100 * factor).toFixed(1),
  };
}
