# Setup-Checkliste — Reihenfolge & was du selbst tun musst

## ✅ Schritt 1: Datenbank-Schema in Supabase anlegen (10 Min)

1. Öffne [Supabase Dashboard](https://supabase.com/dashboard) → dein Projekt `gjavudejhdqicafcxvlx`
2. Links im Menü **SQL Editor** → **New query**
3. Kopiere den kompletten Inhalt von [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) rein
4. Klick **Run** (rechts unten) — sollte "Success" grün zeigen
5. Wiederhole das Ganze für [`supabase/migrations/0002_recipes_source.sql`](../supabase/migrations/0002_recipes_source.sql)

**Danach kannst du Register/Anmelden testen** — der Rest kommt schrittweise.

## ✅ Schritt 2: Auth-Einstellungen prüfen (2 Min)

Damit sich Kunden **ohne Email-Bestätigung** direkt anmelden können (schnellster Weg für Testing):

1. Dashboard → **Authentication** → **Providers** → **Email**
2. **"Confirm email"** ausschalten (nur für Testing! Später wieder AN für Produktion.)
3. Speichern

## ⏳ Schritt 3: Anthropic API-Key holen (5 Min, wenn du KI-Foto willst)

1. https://console.anthropic.com/ → **API Keys** → **Create Key**
2. Name z.B. `bodyshift-app-prod` → Key kopieren (fängt mit `sk-ant-…` an)
3. Wieder ins Supabase Dashboard → **Edge Functions** → **Secrets** → **Add new secret**
4. Name: `ANTHROPIC_API_KEY`, Value: `sk-ant-…` → Save

## ⏳ Schritt 4: Spoonacular Key ins Supabase Secrets (2 Min, wenn du echte Rezepte willst)

1. Supabase Dashboard → **Edge Functions** → **Secrets** → **Add new secret**
2. Name: `SPOONACULAR_API_KEY`, Value: `178b8a699e124e31a92bc4040a59b431` (den kannst du danach rotieren)

## ⏳ Schritt 5: Edge Functions deployen (später, wenn KI + Rezepte gewünscht)

Über das Supabase Dashboard **oder** die CLI. Ich stelle dir die Anleitung bereit
sobald du die 2 Keys eingetragen hast.

---

## Was funktioniert nach welchem Schritt?

| Nach Schritt | Was geht |
|---|---|
| 1 | Datenbank ist da (leere Tabellen) |
| 2 | Registrierung + Anmeldung in der App funktioniert komplett |
| 3 | KI-Foto-Analyse ist bereit für Deployment (Schritt 5) |
| 4 | Rezept-Import ist bereit für Deployment (Schritt 5) |
| 5 | Rezepte werden geladen, Foto-Scan funktioniert live |

**Wichtig:** Nach Schritt 2 kannst du die App bereits am Handy testen — Login klappt,
Onboarding klappt, du landest auf dem Dashboard (Rezept-des-Tages und Foto-Scan sind
dann noch inaktiv, kommt mit Schritt 5).
