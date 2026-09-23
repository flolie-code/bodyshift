# Data Safety Formular — Google Play Console

Vorformulierte Antworten fuer das Datensicherheits-Formular. Punkt fuer Punkt in die Play Console eintragen.

---

## 1. Erhebt oder teilt die App Nutzerdaten?
**Ja**

## 2. Werden Daten verschluesselt?
- **Uebertragung: Ja** (HTTPS/TLS, Supabase erzwingt das)
- **Speicherung: Ja** (Passwoerter gehasht, Datenbank auf verschluesseltem Speicher)

## 3. Koennen Nutzer die Loeschung ihrer Daten anfordern?
**Ja** — per E-Mail an {DEINE_EMAIL}

## 4. Datenkategorien — was wird erhoben?

### Persoenliche Informationen
- **Name:** ja, erhoben, verpflichtend, nicht geteilt
- **E-Mail-Adresse:** ja, erhoben, verpflichtend, nicht geteilt
- **User IDs (Supabase-internes User-UUID):** ja, erhoben, nicht geteilt

### Gesundheit & Fitness
- **Fitness-Info (Gewicht, Ziel, Groesse, Aktivitaet):** ja, erhoben, freiwillig, nicht geteilt
- **Gesundheits-Info (Ernaehrungsdaten):** ja, erhoben, freiwillig, nicht geteilt

### Fotos & Videos
- **Fotos:** ja, verarbeitet, nicht dauerhaft gespeichert
  - Zweck: KI-Analyse der Mahlzeit
  - Geteilt mit: Anthropic (KI-Anbieter) — nur zur Verarbeitung, nicht zur Speicherung
  - Nutzer kann waehlen: ja (KI-Foto-Funktion ist optional)

### App-Aktivitaet
- **App-Interaktionen (angetragene Mahlzeiten, Workouts):** ja, erhoben, nicht geteilt

## 5. Datenkategorien — was wird geteilt?

**Nur mit Auftragsverarbeitern zur Erfuellung der App-Funktionen:**
- Supabase Inc. (Datenbank-Provider, EU-Region Frankfurt)
- Anthropic PBC (KI-Bildanalyse, nur bei KI-Foto-Funktion)

**Wir verkaufen KEINE Daten an Dritte.**
**Wir zeigen KEINE Werbung Dritter.**
**Wir tracken NICHT ausserhalb der App.**

## 6. Zwecke fuer jede Datenkategorie

| Kategorie | Zweck |
|-----------|-------|
| Name, E-Mail | Konto-Verwaltung, App-Funktionen |
| Fitness-Info | App-Funktionalitaet (Kalorien-Ziel berechnen) |
| Gesundheits-Info | App-Funktionalitaet (Tracking) |
| Fotos | App-Funktionalitaet (KI-Analyse), nicht dauerhaft gespeichert |
| App-Interaktionen | App-Funktionalitaet (Verlauf zeigen) |

**Nie fuer:** Werbung, Analyse ausserhalb der App, Fraud Prevention, Compliance, Personalisierung durch Dritte.

## 7. Ephemere Datenverarbeitung
Fotos fuer KI-Analyse: **ja, ephemer** — das Foto verlaesst dein Handy, wird analysiert, das Ergebnis kommt zurueck, das Foto wird nicht persistiert.

## 8. Nutzer-Kontrollen
- Konto loeschen: ja (per E-Mail)
- Daten loeschen: ja (per E-Mail oder in der App unter Profil)
- Optionale Datenkategorien: Ja — Gewichts-Eintraege, Fotos, Wasser-Tracker sind optional
