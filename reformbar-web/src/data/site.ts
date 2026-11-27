// Zentrale Inhalte der Website – hier lassen sich Texte, Kontakt und Bewertungen schnell ändern.

export const site = {
  name: 'Reformbar',
  url: 'https://reformbar.at',
  tagline: 'Boutique Studio für Reformer Pilates, Bodyforming & Yoga in Feldbach',
  city: 'Feldbach',
  region: 'Steiermark',
  street: 'Ungarstraße 2–4',
  zip: '8330',
  // Hauptnummer = Studio direkt; Zentrale (Body Shift) als Zusatz
  phone: '0676 30 73 860',
  phoneHref: '+436763073860',
  centralPhone: '0676 380 62 22',
  centralPhoneHref: '+436763806222',
  eversportsWidgetId: '203d1836-1d13-41e2-9a66-fad7f5098ab5',
  whatsapp: '436763073860',
  email: 'studio@reformbar.at',
  hours: 'Termine nach Vereinbarung',
  opening: 'Eröffnung: Freitag, 15. Jänner 2027, 18 Uhr',
  company: {
    name: 'Body Shift FLB GmbH',
    street: 'Breitenweg 9',
    zip: '8042',
    city: 'Graz',
    country: 'Österreich',
    uid: 'ATU83995458',
    fn: '671575k',
    ceo: 'Florian Lienhart',
    purpose: 'Betrieb eines Fitnessstudios (Zurverfügungstellen von Fitnessgeräten)',
    chamber: 'WKO für Steiermark',
    authority: 'Magistrat der Stadt Graz',
  },
  // Wochentage, an denen Wunschtermine angefragt werden können (1 = Montag … 6 = Samstag)
  bookableWeekdays: [1, 2, 3, 4, 5],
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  claim: string;
  intro: string;
  benefits: { title: string; text: string }[];
  forWhom: string[];
  faq: { q: string; a: string }[];
  calendar: boolean;
  image: string;
  gallery?: { src: string; alt: string; w: number; h: number }[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: 'reformer-pilates',
    name: 'Reformer Pilates',
    short: 'Kraft, Länge und Haltung am Reformer – präzise angeleitet in der Kleingruppe.',
    claim: 'Stark aus der Mitte.',
    intro:
      'Am Reformer trainierst du mit Federwiderstand statt mit schweren Gewichten. Das fordert die tiefe Muskulatur, schont die Gelenke und sorgt für eine aufrechte Haltung. In unserer Kleingruppe korrigieren wir jede Bewegung – so spürst du den Unterschied schon nach wenigen Einheiten.',
    benefits: [
      { title: 'Ganzkörpertraining', text: 'Jede Einheit fordert Bauch, Rücken, Beine und Arme – fließend und kontrolliert.' },
      { title: 'Gelenkschonend', text: 'Der Federwiderstand führt die Bewegung und lässt sich fein an dein Level anpassen.' },
      { title: 'Kleine Gruppen', text: 'Wenige Reformer, viel Aufmerksamkeit: Wir sehen, was du brauchst.' },
      { title: 'Für jedes Level', text: 'Ob Einsteiger:in oder Fortgeschrittene – jede Übung hat mehrere Varianten.' },
    ],
    forWhom: ['Du willst Kraft aufbauen, ohne zu pumpen', 'Du sitzt viel und möchtest deine Haltung verbessern', 'Du suchst ein Training, das fordert und trotzdem guttut'],
    faq: [
      { q: 'Brauche ich Vorerfahrung für Reformer Pilates?', a: 'Nein. Wir erklären dir den Reformer in Ruhe und passen Widerstand und Übungen an dein Level an.' },
      { q: 'Was soll ich zur Einheit mitbringen?', a: 'Bequeme Sportkleidung, rutschfeste Socken und etwas zu trinken. Alles andere findest du im Studio.' },
      { q: 'Wie buche ich eine Reformer-Einheit?', a: 'Wähle im Kalender deinen Wunschtag und schick uns deine Anfrage – wir bestätigen deinen Platz persönlich.' },
    ],
    calendar: true,
    image: '/img/reformer-klasse.webp',
    seoTitle: 'Reformer Pilates Feldbach – Kleingruppen',
    seoDescription:
      'Reformer Pilates in Feldbach: Ganzkörpertraining in kleinen Gruppen, persönlich angeleitet. Jetzt Wunschtermin im Kalender der Reformbar anfragen.',
  },
  {
    slug: 'bodyforming',
    name: 'Bodyforming',
    short: 'Unser neues Konzept für gezielte Körperformung – individuell auf dich abgestimmt.',
    claim: 'Form, die bleibt.',
    intro:
      'Bodyforming in der Reformbar ist ein neu gedachtes Konzept für alle, die ihren Körper gezielt formen und straffen möchten. Wir starten mit einem persönlichen Gespräch und einer Messung, legen gemeinsam dein Ziel fest und begleiten dich Schritt für Schritt. Während der Anwendung liegst du entspannt zugedeckt auf der Liege – wir legen dir Gurte mit Pads an deinen Zielzonen an, du darfst einfach durchatmen.',
    benefits: [
      { title: 'Persönlicher Plan', text: 'Dein Programm richtet sich nach deinem Ziel und deinem Ausgangspunkt – nicht umgekehrt.' },
      { title: 'Gezielt statt pauschal', text: 'Wir arbeiten an den Zonen, die dir wichtig sind.' },
      { title: 'Laufende Begleitung', text: 'Wir halten deine Fortschritte fest und passen das Programm regelmäßig an.' },
      { title: 'Kombinierbar', text: 'Lässt sich ideal mit Reformer Pilates oder Yoga verbinden.' },
    ],
    forWhom: ['Du möchtest deinen Körper gezielt formen', 'Du wünschst dir persönliche Betreuung statt Massenabfertigung', 'Du willst ein Programm, das sich in deinen Alltag einfügt'],
    faq: [
      { q: 'Wie läuft der erste Termin ab?', a: 'Wir nehmen uns Zeit für ein persönliches Gespräch, besprechen dein Ziel und zeigen dir, wie dein Programm aussehen kann.' },
      { q: 'Für wen ist Bodyforming geeignet?', a: 'Für alle, die gezielt an ihrer Figur arbeiten möchten. Ob es zu dir passt, klären wir gemeinsam beim ersten Termin.' },
      { q: 'Wie buche ich Bodyforming?', a: 'Wähle im Kalender deinen Wunschtag aus und sende uns deine Anfrage – wir melden uns mit einer Bestätigung.' },
    ],
    calendar: true,
    image: '/img/bodyforming/entspannt.webp',
    gallery: [
      { src: '/img/bodyforming/beratung.webp', alt: 'Persönliches Erstgespräch mit Fragebogen in der Reformbar', w: 896, h: 1120 },
      { src: '/img/bodyforming/messen.webp', alt: 'Messung des Bauchumfangs mit dem Maßband', w: 880, h: 1168 },
      { src: '/img/bodyforming/anlegen.webp', alt: 'Die Gurte mit Pads werden an der Zielzone angelegt', w: 880, h: 1168 },
      { src: '/img/bodyforming/gurte.webp', alt: 'Detail: Gurte mit Pads am Bauch', w: 1168, h: 880 },
      { src: '/img/bodyforming/entspannt.webp', alt: 'Kundin liegt entspannt zugedeckt während der Bodyforming-Anwendung', w: 896, h: 1120 },
    ],
    seoTitle: 'Bodyforming Feldbach – Körperformung mit Plan',
    seoDescription:
      'Bodyforming in Feldbach: das neue Konzept der Reformbar für gezielte Körperformung – persönlich betreut und individuell abgestimmt. Jetzt Termin anfragen.',
  },
  {
    slug: 'yoga',
    name: 'Yoga',
    short: 'Ruhige Flows für Beweglichkeit, Atem und einen klaren Kopf.',
    claim: 'Ankommen. Durchatmen.',
    intro:
      'Unsere Yoga-Einheiten verbinden fließende Bewegung mit bewusster Atmung. Du wirst beweglicher, baust Spannung ab und nimmst dir Zeit, die nur dir gehört – in einem Raum, der Ruhe ausstrahlt.',
    benefits: [
      { title: 'Mehr Beweglichkeit', text: 'Sanfte Dehnung und Mobilisation für den ganzen Körper.' },
      { title: 'Weniger Stress', text: 'Atem und Bewegung bringen dein Nervensystem zur Ruhe.' },
      { title: 'Achtsame Anleitung', text: 'Wir bieten Varianten an – du entscheidest, wie weit du gehst.' },
    ],
    forWhom: ['Du suchst einen Ausgleich zum Alltag', 'Du möchtest beweglicher werden', 'Du willst Yoga in kleiner Runde statt im vollen Kursraum'],
    faq: [
      { q: 'Ist Yoga auch für Anfänger:innen geeignet?', a: 'Ja. Wir zeigen jede Haltung in mehreren Varianten, sodass du in deinem Tempo üben kannst.' },
      { q: 'Muss ich eine eigene Matte mitbringen?', a: 'Nein, Matten und Hilfsmittel stehen im Studio bereit.' },
    ],
    calendar: false,
    image: '/img/yoga-flow.webp',
    seoTitle: 'Yoga Feldbach – ruhige Flows im Boutique Studio',
    seoDescription:
      'Yoga in Feldbach: fließende Einheiten für Beweglichkeit, Atem und Ruhe – in kleinen Gruppen in der Reformbar. Jetzt Platz anfragen.',
  },
  {
    slug: 'matten-pilates',
    name: 'Matten-Pilates',
    short: 'Die Basis: tiefe Mitte, starke Haltung, bewusste Bewegung.',
    claim: 'Die Basis für alles.',
    intro:
      'Matten-Pilates ist die Grundlage der Pilates-Methode: Du trainierst mit dem eigenen Körpergewicht, stärkst deine tiefe Rumpfmuskulatur und lernst, dich präzise und bewusst zu bewegen. Ideal als Einstieg – und als Ergänzung zum Reformer.',
    benefits: [
      { title: 'Starke Mitte', text: 'Gezieltes Training für Bauch, Rücken und Beckenboden.' },
      { title: 'Bessere Haltung', text: 'Du richtest dich auf – im Training und im Alltag.' },
      { title: 'Überall anwendbar', text: 'Was du auf der Matte lernst, nimmst du mit nach Hause.' },
    ],
    forWhom: ['Du möchtest Pilates von Grund auf lernen', 'Du willst deinen Rücken stärken', 'Du suchst die perfekte Ergänzung zum Reformer'],
    faq: [
      { q: 'Was ist der Unterschied zu Reformer Pilates?', a: 'Auf der Matte arbeitest du mit dem eigenen Körpergewicht, am Reformer zusätzlich mit Federwiderstand. Beide Formen ergänzen sich ideal.' },
      { q: 'Ist Matten-Pilates anstrengend?', a: 'Es ist fordernd, aber kontrolliert. Du bestimmst die Intensität über die Übungsvariante.' },
    ],
    calendar: false,
    image: '/img/matten-pilates.webp',
    seoTitle: 'Matten-Pilates Feldbach – starke Mitte',
    seoDescription:
      'Matten-Pilates in Feldbach: Training für tiefe Rumpfmuskulatur und aufrechte Haltung in der Reformbar. Jetzt Platz anfragen.',
  },
  {
    slug: 'beckenbodentraining',
    name: 'Beckenbodentraining',
    short: 'Sanft und wirksam – Stabilität von innen heraus.',
    claim: 'Stabil von innen.',
    intro:
      'Ein kräftiger Beckenboden gibt Halt, entlastet den Rücken und sorgt für ein sicheres Körpergefühl. Auf unserem Beckenbodenstuhl sitzt du ganz entspannt und bekleidet, während moderne Magnetfeld-Impulse deine Beckenbodenmuskulatur gezielt aktivieren – 28 Minuten pro Sitzung, diskret und ohne Leistungsdruck.',
    benefits: [
      { title: '28 Minuten', text: 'Eine Sitzung dauert 28 Minuten – du sitzt einfach bequem auf dem Stuhl.' },
      { title: 'Bekleidet & diskret', text: 'Du bleibst in deiner Alltagskleidung, nichts muss ausgezogen werden.' },
      { title: 'Nicht-invasiv', text: 'Magnetfeld-Impulse aktivieren die Muskulatur – ganz ohne Sonden oder Elektroden.' },
      { title: 'Für Frauen & Männer', text: 'Ob nach der Schwangerschaft, zur Vorbeugung oder für mehr Kontrolle im Alltag.' },
    ],
    forWhom: ['Du möchtest deine Körpermitte stärken', 'Du willst nach einer Schwangerschaft wieder Stabilität aufbauen', 'Du möchtest vorbeugen und dich sicher fühlen'],
    faq: [
      { q: 'Für wen ist Beckenbodentraining sinnvoll?', a: 'Für Frauen und Männer jeden Alters – zur Vorbeugung genauso wie zum gezielten Aufbau.' },
      { q: 'Wie läuft eine Sitzung ab?', a: 'Du setzt dich bekleidet auf den Beckenbodenstuhl und entspannst. Die Impulse aktivieren deine Beckenbodenmuskulatur – nach 28 Minuten ist die Sitzung vorbei.' },
      { q: 'Kann ich eine Probesitzung machen?', a: 'Ja. Nach einem kurzen Gespräch kannst du den Stuhl bei uns ganz unverbindlich ausprobieren.' },
      { q: 'Ersetzt das Training eine ärztliche Behandlung?', a: 'Nein. Bei Beschwerden sprich bitte zuerst mit deiner Ärztin oder deinem Arzt. Unser Training ist eine sinnvolle Ergänzung.' },
    ],
    calendar: false,
    image: '/img/beckenboden/stuhl-sitzen.webp',
    gallery: [
      { src: '/img/beckenboden/stuhl.webp', alt: 'Der Beckenbodenstuhl in der Reformbar', w: 880, h: 1168 },
      { src: '/img/beckenboden/beratung.webp', alt: 'Beratung am Beckenmodell: wo der Beckenboden sitzt', w: 1024, h: 688 },
      { src: '/img/beckenboden/lachen.webp', alt: 'Kundin sitzt entspannt auf dem Beckenbodenstuhl', w: 752, h: 1344 },
      { src: '/img/beckenboden/stuhl-sitzen.webp', alt: 'Training auf dem Beckenbodenstuhl in Alltagskleidung', w: 1024, h: 688 },
    ],
    seoTitle: 'Beckenbodentraining Feldbach – Kraft von innen',
    seoDescription:
      'Beckenbodentraining in Feldbach: sanfter, gezielter Aufbau der Körpermitte in der Reformbar – diskret und persönlich. Jetzt Termin anfragen.',
  },
  {
    slug: 'personal-coaching',
    name: '1:1 Coaching',
    short: 'Deine Einheit, dein Tempo, deine Ziele – ungeteilte Aufmerksamkeit.',
    claim: 'Nur du. Nur dein Ziel.',
    intro:
      'Im 1:1 Coaching gehört die ganze Einheit dir. Wir arbeiten an deinem persönlichen Ziel – ob Technik am Reformer, Haltung, Beweglichkeit oder der Wiedereinstieg nach einer Pause. Jede Übung wird auf dich abgestimmt.',
    benefits: [
      { title: 'Volle Aufmerksamkeit', text: 'Eine Trainerin, ein Mensch, ein Ziel.' },
      { title: 'Flexible Termine', text: 'Wir finden eine Zeit, die in deinen Kalender passt.' },
      { title: 'Schneller Fortschritt', text: 'Direkte Korrektur bringt dich rascher voran.' },
    ],
    forWhom: ['Du hast ein konkretes Ziel', 'Du möchtest sicher einsteigen, bevor du in die Gruppe gehst', 'Du schätzt Ruhe und Privatsphäre beim Training'],
    faq: [
      { q: 'Was kann ich im 1:1 Coaching trainieren?', a: 'Alles aus unserem Angebot – Reformer, Matte, Yoga oder Beckenboden – genau auf dein Ziel abgestimmt.' },
      { q: 'Wie vereinbare ich einen Termin?', a: 'Schick uns eine kurze Anfrage mit deinem Wunschzeitraum – wir melden uns persönlich bei dir.' },
    ],
    calendar: false,
    image: '/img/coaching.webp',
    seoTitle: 'Personal Training & 1:1 Coaching Feldbach',
    seoDescription:
      '1:1 Coaching in Feldbach: persönliches Training am Reformer, auf der Matte oder im Yoga – ganz auf dein Ziel abgestimmt. Jetzt anfragen.',
  },
];

// Echte Google-Bewertungen (Originalwortlaut, Vorname + Initial soweit bekannt)
export const reviews = [
  { name: 'Bern S.', text: 'Nach dem ersten Mal hatte ich schon unglaubliche Ergebnisse erzielt. Die beste Entscheidung die ich treffen konnte um endlich an Umfang und Gewicht zu verlieren. Wenig Aufwand - großartige Ergebnisse. Vielen Dank!' },
  { name: 'Beate', text: 'Tolles Programm, Modernste Geräte, sehr nettes Personal, rundum perfekte Betreuung! Danke! Sehr zu empfehlen - und das Konzept funktioniert toll und einfach!' },
  { name: 'Iris P.', text: 'Ich hab ein besseres Körpergefühl, kann viel besser schlafen und hab schon viele Zentimeter und einige Kilos verloren nach nur 8 Behandlungen. Ich bin sehr zufrieden.' },
  { name: 'S. F.', text: 'Ich möchte mich recht herzlich bedanken, auf Anraten einer Bekannten hab ich euch gefunden, so ein liebes Team, fühle mich sehr gut aufgehoben und sehe schon die ersten Resultate. Top!' },
  { name: 'B. W.', text: 'Ich habe erst drei Einheiten hinter mir, aber die Kleidung sitzt bereits um einiges lockerer 🤩 Hosen, die nicht mehr zugingen, gehen wieder zu. Man wird super unterstützt und motiviert. So findet man wieder leichter zurück in alte Routinen.' },
  { name: 'Claudia', text: 'Ein kleines aber feines Studio, mit sehr kompetenten und freundlichen Menschen die dort arbeiten. Die Behandlungen sind der Hammer, ich habe bei der 1.Sitzung mehr als 3 cm verloren, nach der 5. passte ich wieder in ein Kleid das schon ewig zu eng war 🤩 es funktioniert wirklich also einfach ausprobieren 👍🏻' },
  { name: 'Maria W.', text: 'Ich bin total begeistert! Kann endlich wieder mein Lieblingskleid tragen, dass mir in letzter Zeit viel zu eng geworden ist. Danke auch für die kompetente Betreuung während der ganzen Zeit. Ich kann es auf jeden Fall weiterempfehlen!' },
  { name: 'Cornelia', text: 'Hallo, nach der 4. Behandlung waren meine Rückenschmerzen wie weg geblasen! Danke dem Team :)' },
  { name: 'Renate', text: 'Ich hätte es nie gedacht das ich mit 18 Behandlungen 22cm Bauch und 21cm Oberschenkel abgenommen habe. Danke liebes Team' },
  { name: 'Gabi', text: 'Bin total happy. Insgesamt 21 cm am Bauch und 11 cm an den Beinen. Passe endlich wieder in meine „älteren Klamotten". Danke an das tolle Team' },
  { name: 'Daniel', text: 'Ich kann diese Methode nur empfehlen. Habe bereits mit 6 Einheiten 8 kg verloren. Am Bauchumfang bereits 8 cm. Der Service ist extrem freundlich und hilfsbereit.' },
  { name: 'Isabella', text: 'Ich bin total Überrascht wie Erfolgreich diese Behandlungen wirken (natürlich in Kombination von Essensumstellung). Nach 6 Behandlung über 10 cm Bauchumfang verloren.' },
  { name: 'Marion', text: 'Ich bin super zufrieden mit diesem Studio. Man fühlt sich in einem angenehmen Ambiente sehr wohl und man wird von den Mitarbeitern nett umsorgt. Bereits nach dem 5. Mal schon ersichtliche Abnahme. Kann ich nur empfehlen.👍' },
];

// Shop – Produkte im Studio (Platzhalter: Preise und Details folgen)
// status: 'bald' = in Vorbereitung, 'verfuegbar' = im Studio erhältlich
export type Product = { slug: string; name: string; category: string; text: string; image: string; price: string; status: 'bald' | 'verfuegbar' };
export const products: Product[] = [
  { slug: 'yogamatte', name: 'Yogamatte', category: 'Yoga & Matte', text: 'Unsere Reformbar-Matte in Milk Tea – 5 mm stark, mit weicher Wildleder-Optik, schwarzer, rutschfester Unterseite und eingelasertem Logo. Für Yoga, Matten-Pilates und zuhause.', image: '/img/shop/yogamatte.webp', price: '39,90 €', status: 'bald' },
  { slug: 'yoga-bloecke', name: 'Yoga-Block', category: 'Yoga & Matte', text: 'Natürlicher Kork-Block mit eingraviertem Reformbar-Logo – stabil, griffig und nachhaltig.', image: '/img/shop/yoga-bloecke.webp', price: '9,90 €', status: 'bald' },
  { slug: 'eiweisspulver', name: 'Protein Vanille', category: 'Ernährung', text: 'Reformbar Proteinpulver im 500-g-Beutel – für Regeneration und Muskelaufbau. Weitere Sorten folgen.', image: '/img/shop/eiweisspulver.webp', price: '39,90 €', status: 'bald' },
  { slug: 'grip-socken', name: 'Grip-Socken', category: 'Reformbar Essentials', text: 'Rutschfeste Socken für sicheren Stand am Reformer – im Reformbar-Look.', image: '/img/shop/grip-socken.webp', price: 'Preis folgt', status: 'bald' },
  { slug: 'trinkflasche', name: 'Trinkflasche', category: 'Reformbar Essentials', text: 'Isolierte Trinkflasche in Weiß mit königsblauem Reformbar-Logo – hält kalt und warm.', image: '/img/shop/trinkflasche.webp', price: '29,90 €', status: 'bald' },
  { slug: 'handtuch', name: 'Handtuch', category: 'Reformbar Essentials', text: 'Weiches Sporthandtuch in Königsblau – perfekt für jede Einheit.', image: '/img/shop/handtuch.webp', price: 'Preis folgt', status: 'bald' },
  { slug: 'tasche', name: 'Leinentasche', category: 'Reformbar Essentials', text: 'Naturfarbene Baumwolltasche mit „Alles ist reformbar“-Print – für Matte, Flasche und alles, was du mitnimmst.', image: '/img/shop/tasche.webp', price: '4,90 €', status: 'bald' },
  { slug: 'trainingszubehoer', name: 'Ball & Band', category: 'Training zuhause', text: 'Pilates-Ball und Widerstandsband – kleine Helfer für dein Training zuhause.', image: '/img/shop/ball-band.webp', price: 'Preis folgt', status: 'bald' },
  { slug: 'gutschein', name: 'Gutschein', category: 'Geschenke', text: 'Einheiten oder Wertgutschein zum Verschenken – liebevoll verpackt.', image: '/img/shop/gutschein.webp', price: 'Wert frei wählbar', status: 'verfuegbar' },
];
