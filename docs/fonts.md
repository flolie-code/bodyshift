# Fonts

Die App nutzt zwei Google-Fonts, die als Dateien vorliegen müssen (React Native lädt keine Web-Fonts).

## Benötigte Files

Ablegen in `assets/fonts/`:

- `Inter-Regular.ttf`
- `Inter-Bold.ttf`
- `Fraunces-Regular.ttf`
- `Fraunces-Medium.ttf`

## Download

1. **Inter** — https://fonts.google.com/specimen/Inter
   → "Download all", entpacken, aus `static/` diese zwei Dateien nehmen:
   - `Inter-Regular.ttf`
   - `Inter-Bold.ttf`

2. **Fraunces** — https://fonts.google.com/specimen/Fraunces
   → "Download all", entpacken, aus `static/` diese zwei Dateien nehmen:
   - `Fraunces-Regular.ttf`
   - `Fraunces-Medium.ttf`

3. Alle vier Dateien nach `assets/fonts/` kopieren.

Danach `npx expo start --clear` — die Fonts werden beim ersten Start eingelesen.
