# Currency Converter - React Vite Starter

A real-time currency conversion web application built with React and [Open ER API](https://open.er-api.com/).

## Features

- **Live Exchange Rates**: Uses `https://open.er-api.com/v6/latest/USD` for real-time exchange rates (no API key required).
- **Supports World Currencies**: Convert between major international currencies with flag icons and currency symbols.
- **One-Click Swap**: Instantly swap From/To currencies with smooth animation.
- **Unit Rate Breakdown**: Displays exact single-unit exchange values (e.g. 1 USD = 0.9150 EUR).
- **Quick Comparison Grid**: Displays quick rates for top popular currencies.
- **Loading & Error Handling**: Graceful loading indicators and retry capabilities.

## Quick Start (Vite)

1. Create a Vite React project:
   ```bash
   npm create vite@latest currency-converter -- --template react
   cd currency-converter
   npm install
   ```

2. Replace `src/App.jsx` with `currency-converter_App.jsx` and `src/App.css` with `currency-converter_App.css`.

3. Ensure `import './App.css'` is present at top of `App.jsx`.

4. Start dev server:
   ```bash
   npm run dev
   ```
