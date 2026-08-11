# Prism — AI-Grounded Alternative Asset Aggregator & Suitability Platform

[![Live App on Render](https://img.shields.io/badge/Deployment-Render-blueviolet?style=for-the-badge&logo=render)](https://prism-6psq.onrender.com)
[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Prism** is a state-of-the-art wealth platform engineered for Indian investors navigating alternative financial instruments—including **REITs, InvITs, Sovereign Gold Bonds (SGBs), Government Securities (G-Secs), Corporate Bonds, and Target Maturity Debt ETFs**. Built on the **RBI Account Aggregator (AA) Framework** and **SEBI regulatory guidelines**, Prism bridges portfolio aggregation, structural compliance auditing, and grounded AI suitability coaching.

🌐 **Live Hosted Demo**: [https://prism-6psq.onrender.com](https://prism-6psq.onrender.com)

---

## ⚡ Key Features

* **🔗 RBI Account Aggregator (AA) Sandbox Linkage**:
  Integrates via Setu AA Sandbox APIs (`/api/setu/consent` & `/api/setu/fetch-data`) to aggregate verified Financial Information (FI) feeds seamlessly without requiring manual PDF or Excel uploads.

* **🎯 Auto-Derived SEBI Risk Profiling Engine**:
  Evaluates investment time horizon, drawdown loss tolerance, primary financial mandate, and market experience across a 100-point SEBI matrix. Auto-derives questionnaire responses from selected persona presets (**Rajesh** — Conservative / Near Retirement vs. **Ananya** — Aggressive Growth).

* **📊 Comprehensive Portfolio Dashboard**:
  Real-time aggregated net worth tracking, 24h PnL change metrics, category allocation distribution bars, and individual instrument ISIN readouts.

* **🛡️ Dedicated Risk & Exposure Analytics**:
  - **Herfindahl-Hirschman Diversification Index (HHI)**: Quantifies single-asset concentration risk (`93/100`).
  - **Sovereign & Govt Guarantee Exposure**: Tracks percentage backed by absolute government guarantees (`40%`).
  - **Private & Market Credit Exposure**: Monitors corporate bond and trust leverage exposure (`60%`).
  - **Concentration Risk Alerts**: Identifies over-concentration in single sectors or issuers.
  - **Interactive Macro Stress Test Simulator**: Simulates portfolio impacts under 3 real-world economic scenarios (*+50 bps RBI Rate Hike*, *-10% Commercial Rental Yield Compression*, *-15% Equity Volatility*).

* **🧭 Alternative Asset Explorer (Discover)**:
  Curated directory spanning REITs, InvITs, SGBs, AAA Corporate Bonds, G-Secs, and Debt ETFs featuring **Section 115UA tax treatment** and **SEBI ≥90% NDCF semi-annual distribution mandates**.

* **🤖 AI Suitability Coach (Gemini 2.5 Flash / 1.5 Flash)**:
  - Context-aware AI coach trained on SEBI/RBI regulations and user portfolio numbers.
  - **Precision Guardrail Engine**: Outright 2-sentence refusal for explicit buy/sell/hold transaction verdicts while allowing rich, factual explanations of named instrument structures.
  - **Natural Chat Interface**: Adaptive message bubbles (user messages right-aligned in blue pills; coach messages left-aligned in structured cards) with quick-audit shortcut pills.

* **📋 SEBI / RBI Compliance Checkpoints**:
  Interactive checklist auditing InvIT leverage caps (≤ 70% net debt-to-asset value), REIT commercial asset ratios (≥ 80% completed assets), board independence, and SGB maturity tax exemptions.

* **⚙️ Granular Privacy & Consent Control Center**:
  Live consent toggles (`View Balances`, `Analyse Portfolio`, `Recommend Products`) with zero forced default permissions.

---

## 🛠️ Tech Stack Overview

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18 / 19](https://react.dev), [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/), [ESBuild](https://esbuild.github.io/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Motion / Framer Motion](https://motion.dev/) |
| **Backend & Server** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx) |
| **AI LLM Integration** | [Google GenAI SDK (`@google/genai`)](https://www.npmjs.com/package/@google/genai) |
| **AA Integration** | Setu Account Aggregator Sandbox API |
| **Icons & UI Assets** | [Lucide React](https://lucide.dev/) |
| **Deployment Platform** | [Render Cloud](https://render.com/) |

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)
* **Git**: Installed on your system

---

## 🚀 Installation & Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/dhruvvvgg/prism.git
cd prism
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project:

```env
# Server Port Configuration
PORT=3000

# Google Gemini API Key (Optional: for live LLM responses; local rule engine fallback is active by default)
GEMINI_API_KEY=your_google_gemini_api_key

# Setu Account Aggregator Sandbox Credentials (Optional: for live AA sandbox linkage)
SETU_CLIENT_ID=your_setu_client_id
SETU_CLIENT_SECRET=your_setu_client_secret
```

### 4. Start the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 📦 Production Build & Deployment

To build and run the application in a production environment:

### 1. Create Production Bundle
```bash
npm run build
```
This compiles the Vite static assets into `dist/` and bundles `server.ts` into `dist/server.cjs` via ESBuild.

### 2. Start Production Server
```bash
npm start
```
The server will run on `http://localhost:3000` (or `process.env.PORT`).

---

## 📂 Repository Structure

```
prism/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Floating top navigation bar
│   │   ├── Hero.tsx                # Landing page hero copy & parallax product preview
│   │   ├── IntakeView.tsx          # Step 1: AA linkage & consent setup
│   │   ├── RiskAssessmentView.tsx # Step 2: 100-point SEBI risk profile questionnaire
│   │   ├── WorkspaceView.tsx       # Step 3: Main dashboard, risk, explorer, coach & settings
│   │   ├── SignatureOverlay.tsx    # AA linkage signature modal
│   │   └── ui/                     # Shared UI components & parallax containers
│   ├── utils/
│   │   ├── riskProfiler.ts         # SEBI risk scoring matrix & persona answers
│   │   └── data.ts                 # Initial portfolio data & asset Explorer definitions
│   ├── App.tsx                     # Main React root & screen routing controller
│   ├── index.css                   # Global Tailwind CSS styles & typography
│   └── main.tsx                    # React DOM entrypoint
├── server.ts                       # Express backend, Gemini AI SDK integration & Setu AA proxy
├── package.json                    # Dependencies & build scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite bundler configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**: Click the `Fork` button at the top right of this page.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**: Submit a PR describing your changes.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🌐 Hosted App

Access the live production deployment hosted on Render:  
🔗 **[https://prism-6psq.onrender.com](https://prism-6psq.onrender.com)**
