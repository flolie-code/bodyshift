# BODYSHIFT Landingpage

Neue One-Page-Website für Abnehmen im Liegen und Beckenboden (BetterPelvi). Ersetzt die HEROLD-Seite `abnehmenimliegen-stmk.at`.

Reines HTML/CSS/JS, kein Build-Schritt. Gewicht am Handy ca. 0,5 MB (alte Startseite: 6,3 MB).

## Dateien

```
website/
├── index.html          Die Landingpage
├── impressum.html
├── datenschutz.html    ENTWURF, juristisch prüfen lassen
├── vercel.json         Weiterleitungen der alten HEROLD-Adressen + Caching
└── assets/
    ├── css/styles.css  Farben und Schriften oben als Variablen
    ├── js/main.js      CONFIG: Formular-Ziel, Kalender, Tracking
    ├── fonts/          Cormorant Garamond + Jost, lokal gehostet (kein Google-Fonts-Abruf)
    └── img/            Optimierte Bilder (WebP)
```

## Lokal ansehen

```bash
cd website && python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen.

Design: Richtung "Nude & Bogen" (Cormorant Garamond + Jost, Nude-Creme, Espresso, Rosé). Farben und Schriften stehen oben in `assets/css/styles.css` als Variablen.

## Entwurfsmodus

`<body class="draft">` zeigt gelbe Markierungen an allen Stellen, die noch Inhalte oder Entscheidungen brauchen. Vor dem Livegang `class="draft"` in allen drei HTML-Dateien entfernen. Alle offenen Stellen finden:

```bash
grep -n 'class="todo"\|\[' website/*.html
```

## Einstellungen (assets/js/main.js → CONFIG)

| Feld | Bedeutung |
|---|---|
| `formEndpoint` | Ziel für **beide** Anfrageformulare (oben im Hero und unten bei Kontakt). Empfehlung: LeadConnector-Workflow mit Trigger "Inbound Webhook" → Kontakt anlegen, Tag `website-lead`, interne Benachrichtigungs-Mail an euch, optional SMS/Mail an die Kundin. Leer = Formular sendet nicht. |
| `calendars` | Online-Kalender für die Kennenlernbehandlung Abnehmen im Liegen, je Studio (Feldbach, Leibnitz). Beckenboden hat bewusst keinen Kalender: Anfrage läuft über das Formular, ihr ruft zurück. |
| `locations` | Name und Telefon je Studio. |
| `tracking.ga4` / `tracking.metaPixel` | Mess-IDs. Werden nur nach Zustimmung geladen. Bei erfolgreicher Anfrage feuern `Lead` (Meta) und `generate_lead` (GA4). Leer = kein Tracking und kein Cookie-Hinweis. |

Gesendete Felder: `name`, `phone`, `email`, `location`, `interest` (Abnehmen im Liegen / Beckenboden / Beides), `message`, `source` (website-hero / website-kontakt), `page`, `consent`, `submittedAt`.

## Livegang-Checkliste

1. Offene Punkte (gelbe Markierungen) klären, `class="draft"` entfernen.
2. Domain in `index.html` eintragen (canonical, og:url, og:image, JSON-LD).
3. `formEndpoint` setzen, aus beiden Formularen je eine Testanfrage schicken, Eingang im CRM und Benachrichtigungs-Mail prüfen.
4. Je Studio (Feldbach, Leibnitz) eine Testbuchung über den eingebetteten Kalender.
5. Impressum und Datenschutz final, juristisch gegenlesen lassen.
6. Bei Vercel (oder Netlify) deployen, Ordner `website/` als Projekt-Root.
7. Domain umstellen. Wenn die alte Domain bleibt: `vercel.json` leitet alle alten Unterseiten weiter. Wenn eine neue Domain kommt: alte Domain zusätzlich im selben Projekt hinterlegen und per 301 auf die neue leiten.
8. Google-Unternehmensprofile, Instagram-Bio und Anzeigen-Links auf die neue Seite umstellen.
9. In der Google Search Console die neue Sitemap/Domain einreichen.
10. HEROLD-Vertrag kündigen (Frist prüfen) und erst danach die alte Seite abschalten.
