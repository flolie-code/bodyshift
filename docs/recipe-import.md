# Rezept-Import (Spoonacular → Supabase)

Rezepte werden **einmalig** von Spoonacular geholt, via Claude auf Deutsch übersetzt,
in Supabase gespeichert. Danach zieht die App die Rezepte ausschließlich aus Supabase.

## Warum nicht direkt Spoonacular abfragen?

- Spoonacular hat ein Request-Limit (Free: 150/Tag, $29/Mon: 500/Tag)
- Jede App-Öffnung wäre 1+ Request → schnell teuer
- Rezepte ändern sich selten → Cachen macht Sinn
- Kunden-Erfahrung: Rezepte laden aus Supabase in unter 200 ms

## Setup

Einmalig:

```bash
# 1. Spoonacular-Account anlegen: https://spoonacular.com/food-api → API-Key kopieren
# 2. Anthropic-Account anlegen: https://console.anthropic.com → API-Key kopieren
# 3. Beide Keys als Supabase Secrets setzen:
supabase secrets set SPOONACULAR_API_KEY=xxx
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxx

# 4. Edge Function deployen:
supabase functions deploy import-recipes
```

## Import ausführen

Import einer Batch (via curl oder Postman):

```bash
curl -X POST 'https://<projekt>.supabase.co/functions/v1/import-recipes' \
  -H 'Authorization: Bearer <service_role_key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "high protein",
    "count": 20,
    "minProtein": 25
  }'
```

Beispiel-Batches für verschiedene Kategorien:

```json
{ "query": "breakfast", "count": 20, "minProtein": 15 }
{ "query": "chicken", "count": 20, "minProtein": 25 }
{ "query": "vegetarian dinner", "count": 20, "diet": "vegetarian" }
{ "query": "low carb", "count": 20, "maxCarbs": 30 }
{ "query": "healthy snack", "count": 15 }
```

## Kosten pro Import

- Spoonacular: 1 Request pro Batch (bis 100 Rezepte) — 1 von 150 gratis pro Tag
- Claude Sonnet 5 Übersetzung: ~0,01 € pro Rezept
- Für 100 Rezepte: **~1 € Übersetzung + 1 Spoonacular-Call**

## Bilder

- Standard: Spoonacular-Bild-URL wird direkt in `recipes.image_url` gespeichert
- Später: Bilder mit Higgsfield/KI generieren, in Supabase Storage laden, `image_url` aktualisieren

## Rezepte aktualisieren

Beim erneuten Import wird via `slug` upserted — bestehende Rezepte werden aktualisiert,
neue hinzugefügt. Kein Duplicate-Risiko.
