# BodyShift Companion

Native App (iOS + Android) für BodyShift-Kunden — Kalorien-Tracking, KI-Foto-Analyse von
Mahlzeiten, Rezepte, Home-Workouts, Wochenkonto-System, Behandlungs-Termine.

## Tech Stack

- **App:** React Native + Expo (SDK 52) + Expo Router (file-based routing)
- **Sprache:** TypeScript (strict)
- **Backend:** Supabase (Auth, Postgres, Storage, Edge Functions) — EU-Region
- **KI:** Claude Haiku 4.5 via Supabase Edge Function für Foto-Analyse
- **Design:** Custom Design System, siehe `src/constants/theme.ts`
- **Klickbarer Prototyp:** siehe Chat-Historie (HTML-Artifact)

## Setup (einmalig)

```bash
# 1. Dependencies installieren
npm install

# 2. .env.local aus Vorlage kopieren
cp .env.example .env.local
# Dann Supabase-URL und Anon-Key eintragen (aus supabase.com Dashboard).

# 3. Font-Dateien in assets/fonts/ ablegen (Inter + Fraunces von Google Fonts)
# Anleitung: siehe docs/fonts.md

# 4. App starten
npm start
# Dann auf iPhone/Android die "Expo Go" App öffnen und QR-Code scannen.
```

## Ordnerstruktur

```
app/                   Expo Router — jeder File = ein Screen
├── _layout.tsx        Root-Layout (Fonts, StatusBar)
├── index.tsx          Auth-Check → weiter zu Login oder Tabs
├── (auth)/            Login + Onboarding
└── (tabs)/            Tab-basierte Haupt-App (Home/Tracker/Rezepte/Workouts/Profil)

src/
├── components/        Wiederverwendbare UI-Komponenten
├── constants/         Design-Tokens (theme.ts)
├── hooks/             React-Hooks (useTheme etc.)
├── lib/               Supabase-Client, Claude-API, Nährwert-Berechnung, Wochenkonto-Logik
└── types/             TypeScript-Typen

supabase/
├── migrations/        SQL-Schema
└── functions/         Edge Functions (Claude Vision)

content/               Rezepte-Vorlagen (JSON, später in DB migriert)
assets/                Bilder, Fonts, Icons
```

## Deployment

- **OTA-Updates** (UI/Logic ohne Store-Freigabe): `eas update --branch production`
- **Neue Store-Version** (native Änderungen): `eas build --profile production` → `eas submit`

## Datenschutz / DSGVO

- Alle Kunden-Daten in Supabase EU-Region (Frankfurt)
- Row-Level-Security: jeder User sieht nur seine eigenen Daten
- Fotos: verschlüsselt, nur der User hat Zugriff
- Foto-Analyse: kein Foto wird bei Anthropic gespeichert (Zero-Retention API)

## Roadmap

- [x] Design-Prototyp (14 Screens)
- [x] Projekt-Fundament (Expo + Supabase + Claude)
- [x] Login-Screen
- [x] Dashboard-Grundgerüst (Tages-Ring + Makros)
- [ ] Wochenkonto (Home-Card + Detail + Slider)
- [ ] Onboarding-Flow (Ziele + Makro-Berechnung)
- [ ] Kalorien-Tracker
- [ ] KI-Foto-Analyse (Kamera → Edge Function → Ergebnis)
- [ ] Rezepte + Detail-View
- [ ] Home-Workouts + Alltags-Hacks
- [ ] Fortschritt (Gewicht + Fotos)
- [ ] Profil + Behandlungs-Termine
- [ ] TestFlight/Play-Beta mit 10-20 Testkundinnen
- [ ] Store-Launch

## Geplante Kosten

- Anthropic Developer Account: 99 €/Jahr
- Google Play Developer: 25 $ einmalig
- Supabase: kostenlos bis ~500 Kunden, danach ~25 €/Monat
- Claude Vision (Haiku 4.5): ca. 72 €/Monat bei 200 Kunden × 3 Mahlzeiten/Tag
