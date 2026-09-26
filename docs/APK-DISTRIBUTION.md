# APK an Kunden verteilen — ohne Play Store

Kurze Anleitung wie du die BodyShift-App direkt an deine ABL-Kunden bringst.

## Einmalig einrichten (1x)

### 1. Landing-Page auf deiner Website hochladen

Die fertige Download-Seite liegt in `docs/apk-download-page.html`.

- Sie ist eigenstaendig — keine externen Abhaengigkeiten ausser Google Fonts
- Platzhalter `{APK_DOWNLOAD_URL}` musst du beim ersten Upload durch die APK-URL ersetzen
- Empfehlung: als `https://bodyshift-abnehmen.at/app` veroeffentlichen

Wenn du keinen eigenen Web-Hoster hast: **GitHub Pages** ist gratis:
1. In diesem Repo → Settings → Pages → Source: `main` branch, folder `/docs`
2. URL wird dann `https://flolie-code.github.io/bodyshift/apk-download-page.html`

### 2. Domain-Mail-Adresse fuer Support

Auf der Landing-Page ist `app@bodyshift-abnehmen.at` als Support-Kontakt. Richte diese Adresse in deinem Mailserver ein (oder passe sie in der HTML an).

## Jedes Mal, wenn du eine neue Version verteilst

### 1. APK bauen

GitHub → Actions → **"Preview Build (EAS)"** → Run workflow → Platform: android → Run.

Wartezeit: ~15-30 Min (Expo Free Tier kann laenger dauern).

### 2. APK herunterladen

Nach dem Build:
1. Gehe auf https://expo.dev
2. Waehle dein Projekt (bodyshift-companion)
3. Builds → oberster Eintrag → **Download**
4. Du bekommst eine `.apk`-Datei (ca. 45 MB)

### 3. APK auf Website hochladen

Pack die APK auf deinen Webspace, z.B.:
- `https://bodyshift-abnehmen.at/downloads/bodyshift-v1.0.0.apk`

Oder als **GitHub Release**:
1. In diesem Repo → Releases → New release
2. Tag: `v1.0.0` (oder aktuelle Version)
3. Titel: `BodyShift Companion 1.0.0`
4. APK-Datei per Drag-and-Drop anhaengen
5. Publish

Die Download-URL findest du dann unter „Assets" der Release.

### 4. Landing-Page aktualisieren

In `docs/apk-download-page.html` den Platzhalter ersetzen:

```html
<a class="download-btn" href="{APK_DOWNLOAD_URL}" download>
```

Wird zu:

```html
<a class="download-btn" href="https://bodyshift-abnehmen.at/downloads/bodyshift-v1.0.0.apk" download>
```

Oder wenn du GitHub Releases nutzt:
```html
<a class="download-btn" href="https://github.com/flolie-code/bodyshift/releases/download/v1.0.0/bodyshift.apk" download>
```

Die Version-Nummer im `.meta`-Div am Anfang der Seite ebenfalls updaten.

## Was du deinen Kunden schickst

**Simple Text-Nachricht per WhatsApp/Email nach der ABL-Behandlung:**

> Hallo [Name],
>
> hier deine BodyShift-App zum Wunschgewicht:
> **https://bodyshift-abnehmen.at/app**
>
> Anleitung ist dabei. Bei Fragen einfach zurueckschreiben.
>
> Alles Gute,
> Florian

Oder als QR-Code auf einer Karte, die du beim Termin mitgibst. QR-Code-Generator z.B. https://www.qr-code-generator.com — Link ist die Landing-Page-URL.

## Wichtig fuer Google Play spaeter

Wenn du die App irgendwann doch im Play Store veroeffentlichen willst:
- Der Signatur-Key (der die APK signiert) muss identisch bleiben, sonst sehen deine Bestandskunden die Play-Store-Version als „andere App" und muessen neu installieren.
- EAS speichert deinen Signatur-Key automatisch. Beim Playstore-Release den gleichen Key verwenden.

## Updates verteilen

Zwei Wege:

**Kleine UI-Aenderungen** (kein neuer Build noetig):
- OTA-Update triggern (Actions → OTA Update)
- Kunden bekommen es beim naechsten App-Start automatisch

**Neue Features/Native-Aenderungen** (neuer APK-Build):
- Version bumpen in `app.json` und `package.json`
- Neue APK bauen und verteilen wie oben
- Kunden muessen die neue APK ueber die alte drueberinstallieren (die App bleibt erhalten inkl. Daten)
