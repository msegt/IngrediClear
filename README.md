# 🌿 IngrediClear

**Scan cosmetic or food product barcodes to instantly understand ingredient safety.**

IngrediClear is a mobile-first Progressive Web App (PWA). Scan or enter a barcode in **Cosmetics** or **Food** mode and get a clear, evidence-backed safety breakdown — using 100% free and open-access data sources.

---

## ✨ Features

### Cosmetics mode
- 📷 Real-time barcode scanning via device camera (ZXing)
- 🖊️ Manual barcode entry and product name search
- 🟢🟡🔴 Traffic-light safety rating per ingredient (Safe / Caution / Harmful)
- ⚠️ Harmful ingredient detection — 15 categories including carcinogens, endocrine disruptors, heavy metals, and restricted preservatives
- 🤧 EU fragrance allergen detection (Annex III, 26+ listed allergens)
- 🔗 Every warning links directly to its primary evidence source (IARC, EU SCCS, ECHA, FDA, WHO)
- 📊 Honest overall safety label with a plain-English explanation of *why* it was assigned
- ❓ Unclassified ingredients (not in database) are flagged separately — not silently treated as safe
- 🌱 Safer alternatives suggested for every flagged ingredient

### Food mode
- 🍎 Barcode scanning and product name search for food products
- 🧪 Nutrient flags for salt, sugar, and saturated fat using **UK FSA traffic-light thresholds**
- 🌾 Fibre and protein positive flags per **EU Regulation 1924/2006**
- 🧠 Nutri-Score display (science-based rating by Santé publique France)
- 🔬 NOVA group (food processing level)
- ⚠️ 14 EU-regulated allergens (Regulation 1169/2011)
- 🚩 Notable additive flags (aspartame, nitrites, E171, Southampton Six dyes, MSG, HFCS, etc.) — each with EFSA/WHO/IARC evidence links
- 🇺🇸 **USDA FoodData Central enrichment** — when Open Food Facts has sparse nutrition data, missing values are automatically supplemented from USDA FDC (requires `VITE_USDA_API_KEY`; see [Setup](#setup))

### General
- 📱 PWA — installable on mobile home screen
- 🌙 Dark mode
- 📅 Scan history
- ↗️ Share results

---

## 🛡️ Evidence & Safety Standards

Every warning and caution in IngrediClear is backed by at least one primary source. Sources used include:

| Source | Used for |
|---|---|
| [IARC Monographs](https://monographs.iarc.who.int/) | Carcinogen classifications (Group 1, 2A, 2B) |
| [EU SCCS Opinions](https://health.ec.europa.eu/scientific-committees/scientific-committee-consumer-safety-sccs_en) | Cosmetic ingredient safety assessments |
| [EU Cosmetics Regulation 1223/2009](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02009R1223-20230401) | Banned (Annex II), restricted (Annex III/V/VI) substances |
| [ECHA REACH](https://echa.europa.eu/) | Persistent pollutants, SVHCs |
| [EFSA Opinions](https://www.efsa.europa.eu/) | Food additive safety |
| [UK FSA Traffic-light](https://www.food.gov.uk/business-guidance/traffic-light-labelling) | Salt, sugar, saturated fat thresholds |
| [EU Regulation 1924/2006](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1924) | Nutrition claim thresholds (fibre, protein) |
| [WHO / FDA](https://www.who.int/) | Heavy metals, triclosan, mercury, lead |
| [USDA FoodData Central](https://fdc.nal.usda.gov/) | Supplementary nutrition data for food products |
| Peer-reviewed literature | MSG (Geha et al. 2000), Southampton dyes (McCann et al. 2007), essential oil allergens (Bauer et al.) |

**Claims are conservative and do not overstate risk.** Where scientific consensus is still developing (e.g. oxybenzone and coral reefs, talc and ovarian cancer), the app states the current evidence clearly rather than asserting causation.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Barcode scanning | @zxing/browser |
| Cosmetics API | Open Beauty Facts REST API (free, no key) |
| Food API | Open Food Facts REST API (free, no key) |
| Nutrition enrichment | USDA FoodData Central API (free, optional key) |
| Ingredient DB | Bundled JS (compiled from IARC, SCCS, CosIng, EWG) |
| PWA | Vite PWA plugin (Workbox) |
| Deployment | Vercel / Netlify / GitHub Pages (static) |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## ⚙️ Setup

### USDA FoodData Central (optional)

USDA enrichment fills in missing nutrition values (sugar, salt, saturated fat, fibre, etc.) when Open Food Facts data is sparse. It is **optional** — the app works fully without it.

1. Get a free API key at [fdc.nal.usda.gov/api-key-signup](https://fdc.nal.usda.gov/api-key-signup/)
2. Add it to your environment:

```bash
# .env.local (never commit this file)
VITE_USDA_API_KEY=your_key_here
```

For Vercel deployments, add `VITE_USDA_API_KEY` under **Project Settings → Environment Variables**.

When enrichment is active, a small **ⓘ** icon appears next to the "Nutrition per 100g" heading in food results, with a tooltip explaining the supplemental source.

---

## 🌍 Deployment

```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, or GitHub Pages
```

### Vercel (recommended)
```bash
npx vercel --prod
```

### GitHub Pages
```bash
npm run deploy
```

---

## 📡 Data Sources

- **[Open Beauty Facts](https://world.openbeautyfacts.org/)** — Cosmetic product database (CC BY-SA)
- **[Open Food Facts](https://world.openfoodfacts.org/)** — Food product database (ODbL)
- **[USDA FoodData Central](https://fdc.nal.usda.gov/)** — Supplementary nutrition data (public domain, optional)
- **Bundled ingredient safety data** — Compiled from IARC, EU SCCS, EU CosIng, ECHA, EFSA, WHO, FDA, and peer-reviewed literature

---

## ⚠️ Disclaimer

IngrediClear is an informational tool, not a medical device. It is not a substitute for professional dermatological or dietary advice. Safety assessments are based on publicly available data and may not reflect the latest regulatory changes or individual health circumstances.

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)
