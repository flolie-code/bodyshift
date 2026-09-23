# BodyShift Companion — Launch-Guide

Alle Schritte, die zwischen "App laeuft am Handy" und "App im Google Play Store" liegen. Reihenfolge einhalten.

---

## 1. Vorbereitung (30 Min)

### 1.1 Rechtliches — MUSS
Google Play blockiert jede App ohne Datenschutzerklaerung und Impressum. Du hast eine GmbH — nutze die.

**Zu tun:**
- [ ] Datenschutzerklaerung erstellen (siehe `docs/PRIVACY.md` als Vorlage)
- [ ] Impressum erstellen (siehe `docs/IMPRINT.md` als Vorlage)
- [ ] Beide auf `bodyshift-abnehmen.at/datenschutz` und `/impressum` (oder Subdomain `app.bodyshift-abnehmen.at`) veroeffentlichen
- [ ] URLs notieren — brauchst du in der Play Console

**Alternative wenn keine eigene Domain:** Notion-Seite oeffentlich stellen, Termly.io (kostenlos), oder eine simple GitHub-Pages-Seite.

### 1.2 Google Play Console Developer-Account
- [ ] Account einrichten auf https://play.google.com/console/ (25 USD einmalig)
- [ ] Verifizieren (Perso + Adresse, dauert 1–3 Tage)
- [ ] Als **Organisation** eintragen: Body Shift FLB GmbH

### 1.3 App-Assets vorbereiten
Deine Icons sind schon fertig (petrol/terracotta BS.). Zusaetzlich brauchst du:

- [ ] **Feature Graphic**: 1024×500 px (das grosse Banner im Store-Listing)
- [ ] **Screenshots**: mindestens 2 pro Handy-Groesse; ideal 4–6
  - Home (Kalorien-Ring, Wochenkonto)
  - Tracker (Mahlzeiten des Tages)
  - Wochenkonto (Detail mit Ringen)
  - KI-Foto (Kamera + Ergebnis)
  - Rezepte (Liste)
- [ ] **App-Beschreibung** (siehe `docs/STORE_LISTING.md`)

---

## 2. Produktions-Build

### 2.1 Version bumpen — ERST vor dem Produktions-Build!
Die aktuelle Version ist 0.1.0 (Preview). Fuer den Store-Release muss sie
auf 1.0.0 hochgezogen werden — aber **NICHT vorher**, sonst brechen die
OTA-Updates fuer die installierte Preview-APK (runtimeVersion policy: appVersion).

Reihenfolge:
1. Erst wenn du bereit bist, den finalen Produktions-Build zu starten:
   - `app.json`: `"version": "1.0.0"`
   - `package.json`: `"version": "1.0.0"`
2. Comitten und pushen
3. **Danach** den Produktions-Build starten (Schritt 2.3)

### 2.2 Anthropic API Key im Supabase Backend hinterlegen
KI-Foto funktioniert nur, wenn im Supabase-Projekt die Edge-Function `analyze-meal` deployed ist UND der API-Key als Secret liegt.

**Test:** In der App eine Mahlzeit per KI-Foto scannen. Kommt eine Fehlermeldung → Anthropic-Key fehlt.

### 2.3 Produktions-Build (AAB, nicht APK!)
Fuer den Play Store brauchst du ein **Android App Bundle (.aab)**, nicht die Preview-APK.

Neuer Workflow-Aufruf oder EAS-Build lokal:
```bash
eas build --profile production --platform android
```

Das dauert ~15–30 min. Ergebnis: `.aab`-Datei zum Download.

---

## 3. Play Console — Erst-Einreichung

### 3.1 Neue App anlegen
1. Play Console -> "App erstellen"
2. Name: **BodyShift Companion**
3. Standard-Sprache: **Deutsch (Oesterreich)**
4. Kategorie: **App**
5. Kostenlos oder kostenpflichtig: **Kostenlos**
6. Erklaerungen bestaetigen

### 3.2 Store-Eintrag ausfuellen
Aus `docs/STORE_LISTING.md` uebernehmen:
- Kurzbeschreibung (max 80 Zeichen)
- Vollstaendige Beschreibung
- Screenshots hochladen
- App-Icon (schon vorhanden)
- Feature Graphic hochladen
- Kategorie: **Gesundheit & Fitness**
- Kontakt-Email, Website-URL, Datenschutz-URL

### 3.3 App-Inhalte (kritisch)
- **Datenschutzerklaerung**: URL angeben (aus 1.1)
- **App-Zugriff**: Alle Funktionen ohne Anmeldung? -> Nein, Anmeldung erforderlich
- **Werbung**: keine (aktuell)
- **Zielgruppe**: 18+
- **Datensicherheit-Formular**: siehe `docs/DATA_SAFETY.md`
- **Content-Rating**: Fragebogen ausfuellen (dauert 5 min)

### 3.4 Release erstellen
1. **Interner Test** zuerst — auf euch beide + 1–2 Testkunden
2. Nach 1 Woche Test: **Offener Test** oder direkt **Produktion**

Beim Upload:
- AAB hochladen
- Release-Notes (aus `docs/STORE_LISTING.md`)
- "Version veroeffentlichen"

### 3.5 Wartezeit
Google Play Review dauert aktuell 1–7 Tage. Erste App tendenziell laenger.

---

## 4. Nach Freigabe

- [ ] Link zum Store-Eintrag im Newsletter der GmbH ankuendigen
- [ ] Auf deiner Website (`bodyshift-abnehmen.at`) einbauen
- [ ] Termin-Kunden bei ABL beim ersten Termin auf App hinweisen

---

## 5. iOS (spaeter)

Same Prinzip:
- Apple Developer Account: 99 USD/Jahr
- App Store Connect
- Build via EAS: `eas build --profile production --platform ios`
- Zusaetzlich: TestFlight fuer Beta-Kunden

iOS-Review ist strenger — plane 2 Wochen Puffer.

---

## Nachtraeglich fehlt noch

Diese Punkte sind hilfreich, aber blockieren den ersten Launch nicht:

- Push-Notifications (Erinnerung "hast du schon getrackt?")
- Barcode-Scanner (Off-Foundation "OpenFoodFacts" API, kostenlos)
- Spracheingabe fuer Mahlzeiten
- Apple Health / Google Fit Integration
- Rezept-Import automatisieren (Cron auf Supabase)
