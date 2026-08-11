# Prism: AI-Grounded Alternative Asset Aggregator and Suitability Platform

[![Live App on Render](https://img.shields.io/badge/Deployment-Render-blueviolet?style=for-the-badge&logo=render)](https://prism-6psq.onrender.com)
[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.14-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

Prism is a wealth management platform designed for Indian investors navigating alternative financial instruments, including Real Estate Investment Trusts (REITs), Infrastructure Investment Trusts (InvITs), Sovereign Gold Bonds (SGBs), Government Securities (G-Secs), Corporate Bonds, and Target Maturity Debt ETFs. Built on the RBI Account Aggregator (AA) Framework and SEBI regulatory guidelines, Prism provides portfolio aggregation, structural compliance auditing, and grounded AI suitability coaching.

Hosted Application: [https://prism-6psq.onrender.com](https://prism-6psq.onrender.com)

---

## Features

* **RBI Account Aggregator (AA) Sandbox Integration**:
  Integrates via Setu AA Sandbox APIs (`/api/setu/consent` and `/api/setu/fetch-data`) to aggregate verified Financial Information (FI) feeds without requiring manual file uploads.

* **Auto-Derived SEBI Risk Profiling Engine**:
  Evaluates investment time horizon, drawdown loss tolerance, financial mandate, and market experience across a 100-point SEBI matrix. Auto-derives questionnaire responses from persona presets (Rajesh: Conservative / Near Retirement; Ananya: Aggressive Growth).

* **Portfolio Allocation and Holdings Dashboard**:
  Real-time portfolio net worth tracking, 24-hour PnL change metrics, category allocation distribution, and individual instrument ISIN readouts.

* **Dedicated Risk and Exposure Analytics**:
  - **Herfindahl-Hirschman Diversification Index (HHI)**: Quantifies single-asset concentration risk (93/100).
  - **Sovereign and Government Exposure**: Tracks percentage backed by government guarantees (40%).
  - **Private and Market Credit Exposure**: Monitors corporate bond and trust leverage exposure (60%).
  - **Concentration Risk Alerts**: Identifies over-concentration in single sectors or issuers.
  - **Macro Stress Test Simulator**: Simulates portfolio impacts under three economic scenarios (+50 bps RBI Rate Hike, -10% Commercial Rental Yield Compression, -15% Equity Volatility).

* **Alternative Asset Explorer**:
  Catalog spanning REITs, InvITs, SGBs, AAA Corporate Bonds, G-Secs, and Debt ETFs featuring Section 115UA tax treatment and SEBI distribution mandates (at least 90% NDCF distributed semi-annually).

* **AI Suitability Coach (Gemini 2.5 Flash / 1.5 Flash)**:
  - Context-aware AI coach trained on SEBI and RBI regulations alongside user portfolio data.
  - **Precision Guardrails**: Outright two-sentence refusal for explicit transaction verdicts while permitting factual explanations of named instrument structures.
  - **Chat Interface**: Adaptive message layout with user messages right-aligned and coach responses left-aligned with quick-audit shortcuts.

* **SEBI and RBI Compliance Checkpoints**:
  Interactive checklist auditing InvIT leverage caps (70% or lower net debt-to-asset value), REIT commercial asset ratios (80% or higher completed assets), board independence, and SGB maturity tax exemptions.

* **Granular Privacy and Consent Control Center**:
  Live consent toggles (`View Balances`, `Analyse Portfolio`, `Recommend Products`) with zero forced default permissions.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18 / 19, TypeScript 5.8 |
| **Build Tool and Bundler** | Vite 6, ESBuild |
| **Styling and Design** | Tailwind CSS v4, Motion / Framer Motion |
| **Backend and Server** | Node.js, Express, tsx |
| **AI LLM Integration** | Google GenAI SDK (`@google/genai`) |
| **AA Integration** | Setu Account Aggregator Sandbox API |
| **Icons and UI Assets** | Lucide React |
| **Deployment Platform** | Render Cloud |

---

## Prerequisites

Ensure the following dependencies are installed on your system before running locally:

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)
* **Git**: Installed on your system

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/dhruvvvgg/prism.git
cd prism
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Port Configuration
PORT=3000

# Google Gemini API Key (Optional: for live LLM responses; local rule engine fallback is active by default)
GEMINI_API_KEY=your_google_gemini_api_key

# Setu Account Aggregator Sandbox Credentials (Optional: for live AA sandbox linkage)
SETU_CLIENT_ID=your_setu_client_id
SETU_CLIENT_SECRET=your_setu_client_secret
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

---

## Production Build and Deployment

### 1. Build Production Assets
```bash
npm run build
```
Compiles Vite static assets into `dist/` and bundles `server.ts` into `dist/server.cjs` via ESBuild.

### 2. Start Production Server
```bash
npm start
```
The server starts on `http://localhost:3000` or the port specified in `process.env.PORT`.

---

## Repository Structure

```
prism/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── Hero.tsx                # Landing page hero section and product preview
│   │   ├── IntakeView.tsx          # Account Aggregator linkage and consent setup
│   │   ├── RiskAssessmentView.tsx  # SEBI risk profile questionnaire
│   │   ├── WorkspaceView.tsx       # Main dashboard, risk, explorer, coach, and settings
│   │   ├── SignatureOverlay.tsx    # AA linkage signature modal
│   │   └── ui/                     # Shared UI components and parallax containers
│   ├── utils/
│   │   ├── riskProfiler.ts         # SEBI risk scoring matrix and preset persona answers
│   │   └── data.ts                 # Portfolio data and asset explorer definitions
│   ├── App.tsx                     # Main React root and view router
│   ├── index.css                   # Global Tailwind CSS styles
│   └── main.tsx                    # React DOM entrypoint
├── server.ts                       # Express backend, Gemini AI SDK integration, and Setu AA proxy
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

---

## Contributing

1. **Fork the Repository**: Click `Fork` on GitHub.
2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Changes**:
   ```bash
   git commit -m "Add feature description"
   ```
4. **Push Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Submit Pull Request**: Open a pull request against the `main` branch.

---

## License

Distributed under the MIT License. See `LICENSE` for details.

---

## Deployment

Hosted on Render: [https://prism-6psq.onrender.com](https://prism-6psq.onrender.com)
