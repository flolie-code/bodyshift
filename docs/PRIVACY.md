# Datenschutzerklaerung — BodyShift Companion

**HINWEIS:** Diese Vorlage bildet die tatsaechliche Datenverarbeitung deiner App ab.
Vor Veroeffentlichung von einem Anwalt/DSB pruefen lassen (Body Shift FLB GmbH hat DSGVO-Pflicht).

_Stand: {DATUM_EINFUEGEN}_

## 1. Verantwortlicher

Body Shift FLB GmbH
{VOLLSTAENDIGE_ADRESSE}
E-Mail: {DEINE_EMAIL}
Telefon: {DEINE_TELEFONNUMMER}
FN: {FIRMENBUCH_NUMMER}

## 2. Welche Daten wir verarbeiten

### 2.1 Registrierung
Bei der Anmeldung erheben wir:
- Vor- und Nachname
- E-Mail-Adresse
- Passwort (verschluesselt gespeichert, wir sehen es nie)

**Zweck:** Zugriff auf dein persoenliches Konto und deine Daten.
**Rechtsgrundlage:** Vertragserfuellung (Art. 6 Abs. 1 lit. b DSGVO).

### 2.2 Gesundheitsdaten (freiwillig)
Wenn du die App nutzt, kannst du folgende Daten eingeben:
- Alter, Geschlecht, Groesse, Gewicht, Wunschgewicht, Aktivitaetslevel
- Kalorien- und Naehrwert-Eintraege (Mahlzeiten)
- Gewichtsverlauf
- Wasser-Konsum
- Behandlungs-Termine

**Zweck:** Berechnung deines Kalorien-Ziels und Bereitstellung der Tracking-Funktionen.
**Rechtsgrundlage:** Ausdrueckliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO). Du kannst diese jederzeit widerrufen.

### 2.3 Fotos (bei KI-Foto-Nutzung)
Wenn du Mahlzeiten per Foto trackst:
- Das Foto wird an unseren Server (Supabase) gesendet
- Von dort an die KI (Anthropic Claude) zur Analyse weitergegeben
- **Wir speichern das Foto nicht dauerhaft** — es wird nach Analyse geloescht
- Nur das Ergebnis (kcal, Naehrwerte) bleibt in deinem Tracker

## 3. Auftragsverarbeiter

Wir setzen folgende Dienstleister ein:

| Dienst | Zweck | Land | DSGVO-Grundlage |
|--------|-------|------|-----------------|
| Supabase Inc. | Datenbank, Auth, Storage | EU (Frankfurt) | AVV geschlossen |
| Anthropic PBC | KI-Foto-Analyse | USA | EU-Standardvertragsklauseln |
| Spoonacular | Rezept-Datenbank | USA | Nur Rezept-Metadaten, keine Nutzerdaten |
| Expo (EAS) | App-Updates | USA | Nur App-Version, keine Nutzerdaten |

## 4. Speicherdauer

- Kontodaten: solange dein Konto besteht
- Gesundheitsdaten: solange dein Konto besteht — auf Anfrage jederzeit loeschbar
- KI-Foto-Analysen: das Foto selbst wird nicht gespeichert; nur die abgeleiteten Naehrwerte

Nach Kontoloeschung werden **alle** Daten binnen 30 Tagen unwiderruflich geloescht.

## 5. Deine Rechte

Du hast das Recht auf:
- Auskunft (Art. 15 DSGVO)
- Berichtigung (Art. 16)
- Loeschung / "Recht auf Vergessenwerden" (Art. 17)
- Einschraenkung (Art. 18)
- Datenuebertragbarkeit (Art. 20)
- Widerspruch (Art. 21)
- Beschwerde bei der Datenschutzbehoerde (Art. 77)

Anfragen an: {DEINE_EMAIL}

Zustaendige Aufsichtsbehoerde in Oesterreich:
Datenschutzbehoerde, Barichgasse 40-42, 1030 Wien
dsb@dsb.gv.at

## 6. Keine automatisierten Einzelentscheidungen

Die KI-Foto-Analyse ist ein **Vorschlag** — du entscheidest immer selbst, was du in deinen Tracker uebernimmst. Es findet keine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO statt.

## 7. Aenderungen

Bei wesentlichen Aenderungen dieser Erklaerung informieren wir dich in der App.

---

**{DATUM_EINFUEGEN}, Body Shift FLB GmbH**
