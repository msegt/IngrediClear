# 🌿 IngrediClear

**Scan cosmetic product barcodes to instantly identify harmful ingredients and allergens.**

IngrediClear is a mobile-first Progressive Web App (PWA) that lets you scan or enter a cosmetic product barcode and get a clear, colour-coded safety breakdown of its ingredients — using 100% free and open-access data sources.

## ✨ Features

- 📷 Real-time barcode scanning via device camera (ZXing)
- 🔎 Manual barcode entry fallback
- ⚠️ Ingredient safety scoring using the open EWG / CosIng-derived harmful ingredient list
- 🤧 Common allergen detection (EU 26 allergens + extras)
- 🟢🟡🔴 Traffic-light safety rating per ingredient
- 📦 Product info from [Open Beauty Facts](https://world.openbeautyfacts.org/) (open database)
- 📱 PWA — installable on mobile, works offline for cached products
- 🌙 Dark mode support

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Barcode scanning | @zxing/browser |
| API | Open Beauty Facts REST API (free, no key) |
| Ingredient DB | Bundled open JSON (EWG-derived, CosIng) |
| PWA | Vite PWA plugin (Workbox) |
| Deployment | Vercel / Netlify / GitHub Pages (static) |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

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

## 📡 APIs & Data Sources

- **[Open Beauty Facts](https://world.openbeautyfacts.org/)** — Open database of cosmetic products (CC BY-SA)
- **Bundled ingredient safety data** — Compiled from public EWG Skin Deep summaries and EU CosIng database (open access)

No API keys required. All data sources are free and open.

## 📄 License

MIT License — see [LICENSE](./LICENSE)
