# Bodyshift — Website (statisch)

Verkaufsoptimierte Landingpage für **Body Shift FLB GmbH** — statisches HTML/CSS/JS,
kein Build-Schritt nötig, überall hostbar (Vercel, Netlify, Cloudflare Pages,
klassisches Webhosting per FTP).

## Struktur

```
web/
├── index.html          Landingpage (alle Sales-Sections)
├── impressum.html
├── datenschutz.html
├── agb.html
└── assets/
    ├── css/style.css   Design-System + alle Sektionen
    ├── js/main.js      Nav, FAQ, Vorher/Nachher-Slider, Formular
    ├── img/            SVG-Platzhalter (Logo + Hero + Vorher/Nachher)
    └── fonts/          (leer — Google Fonts wird live geladen)
```

## Lokale Vorschau

Einfach doppelklicken oder mit einem beliebigen Statik-Server öffnen:

```bash
# Python
python3 -m http.server -d web 8080

# Node (npx)
npx serve web
```

Dann [http://localhost:8080](http://localhost:8080) im Browser öffnen.

## Was du vor dem Live-Gang austauschen musst

1. **Logo** — `assets/img/logo.svg` und `assets/img/logo-light.svg` durch deine offiziellen Bodyshift-Logos ersetzen (PNG oder SVG, gleiche Dateinamen behalten oder in HTML anpassen).
2. **Hero-Bild** — `assets/img/placeholder-hero.svg` durch ein Studio-/Behandlungsbild ersetzen (Empfehlung: 800 × 1000 px).
3. **Vorher/Nachher-Fotos** — `assets/img/ba-before-1.svg` … `ba-after-3.svg` durch echte, freigegebene Kundenfotos ersetzen (jeweils gleiches Format, 400 × 500 px empfohlen).
4. **Methode-Bild** — `assets/img/placeholder-method.svg` durch ein Studio-Bild ersetzen (800 × 960 px empfohlen).
5. **Kontaktdaten** — in `index.html`, `impressum.html`, `datenschutz.html`, `agb.html` diese Platzhalter tauschen:
   - Telefonnummer `+43 000 0000000`
   - E-Mail `hallo@bodyshift.at`
   - Adresse `Musterstraße 1, 8010 Graz`
   - Firmenbuch-Nr., UID
6. **Preise** — In `index.html` in der Sektion `#preise` die Beträge und Paket-Inhalte auf deine tatsächlichen Angebote anpassen.
7. **Testimonials** — Echte Bewertungen (mit Zustimmung) statt der Platzhalter-Zitate.
8. **Buchungs-Kalender** — In `index.html` bei `Kalender öffnen` den Link zu deinem Calendly/TidyCal/Timify eintragen (Suchbegriff `calendly.com/DEIN-LINK`).
9. **Formular-Backend** — In `assets/js/main.js` beim Kommentar `Backend-Integration einbauen` einen Webhook (z. B. Zapier, Make, FormSubmit oder eigenes Backend) ergänzen. Aktuell wird das Formular clientseitig „gesendet".

## Deployment-Optionen

### Vercel / Netlify (empfohlen — kostenlos, blitzschnell, HTTPS inklusive)
1. Ordner `web/` in ein eigenes Repo verschieben oder als Root deployen.
2. Bei Vercel: „Import Project" → Framework: „Other" → Output-Verzeichnis: `.`.
3. Domain (z. B. `bodyshift.at`) im Dashboard verbinden.

### Klassisches Webhosting (FTP)
Kompletten Inhalt des `web/`-Ordners auf den Server hochladen — fertig.

## In separates Repo verschieben

Wenn du wie besprochen ein eigenes Repo `bodyshift-web` haben willst:

```bash
# Variante A — Git-History mitnehmen
cd bodyshift
git subtree split -P web -b bodyshift-web
git worktree add ../bodyshift-web bodyshift-web
cd ../bodyshift-web
git init --bare ../bodyshift-web.git   # oder: neues GitHub-Repo anlegen und pushen

# Variante B — einfacher, ohne History
cp -r web /pfad/zu/neuem/bodyshift-web
cd /pfad/zu/neuem/bodyshift-web
git init && git add . && git commit -m "Initial Bodyshift website"
```

## Design-System

- **Farben:** Ink `#101010`, Cream `#f5f0ea`, Nude `#e8ddd1`, Warm `#c9a98a`
- **Serif:** Cormorant Garamond (500 / 500 italic) — Headlines
- **Sans:** Manrope (400 – 700) — Body & UI
- **Radius:** 4 px (Buttons), 12 px (Karten)
- **Animations:** dezent, `prefers-reduced-motion` respektiert

## SEO-Basics

- Semantische HTML5-Struktur (`header`, `main`, `section`, `article`, `footer`)
- Meta-Description + Open Graph Tags gesetzt
- `HealthAndBeautyBusiness`-Schema.org (JSON-LD) für Google-Rich-Results — Adresse anpassen!
- `impressum.html` und `datenschutz.html` sind auf `noindex` gesetzt (österreichische Best Practice)

## Barrierefreiheit

- Kontraste passen (WCAG AA)
- ARIA-Labels an interaktiven Elementen
- Fokus-Zustände sichtbar
- Reduced-Motion respektiert
