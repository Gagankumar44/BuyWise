# BuyWise — AI Personal Shopping Advisor

> **"Don't just help people buy products. Help them buy the RIGHT products."**

BuyWise is an intelligent, honest conversational shopping advisor built to help students, budget-conscious consumers, and tech shoppers make informed purchasing decisions without sales bias or marketing hype.

---

## 🌟 Key Features

1. **Intelligent Shopping Dialogue**: Natural back-and-forth conversation that understands context, extracts budget constraints, and asks smart follow-up questions only when necessary.
2. **Grounded Product Recommendations**: Recommends 2–3 tailored options grounded in a verified local dataset of 25 genuine tech products across 5 categories. Zero fake prices, zero hallucinated specs.
3. **Product Comparison Engine**: Side-by-side comparison tables analyzing Price, Battery, Performance, Sound, and Value for Money with a definitive, unbiased verdict.
4. **Smart Budget Advisor**: Strictly respects price ceilings, identifies budget-friendly alternatives, and candidly assesses if increasing your budget is actually worth it.
5. **Anti-Consumerist Honest Advice**: Tells you when your current gadget is already adequate and advises against unnecessary upgrades.
6. **Local Advisor Fallback Engine**: Works 100% out-of-the-box offline even without an API key, and seamlessly upgrades to live generative reasoning when `GEMINI_API_KEY` is configured!
7. **Local Persistence**: Chat history persists across browser sessions in `localStorage` with a collapsible sidebar and New Chat management.

---

## 🏗️ Technical Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, React-Markdown, Remark-GFM.
- **Backend**: Node.js, Express.js, CORS, Dotenv.
- **AI Engine**: Google Gemini API (`@google/genai` SDK with `gemini-2.5-flash`) + Intelligent Local Shopping Advisor Engine.
- **Knowledge Base**: Curated 25 genuine products (`server/src/data/products.json`) across:
  - 💻 Laptops (Acer, ASUS, HP, Lenovo, Apple M1)
  - 📱 Smartphones (Redmi, Moto G54, Samsung Galaxy M35, OnePlus Nord CE 4 Lite, OnePlus Nord 4)
  - 🎧 Headphones & TWS (boAt, OnePlus Nord Buds 2r, OnePlus Nord Buds 3, Samsung Galaxy Buds FE, Sony WH-CH720N)
  - ⌚ Smartwatches (Fastrack, Noise, Amazfit Bip 5 with GPS, Samsung Galaxy Watch4 with Wear OS, Fire-Boltt)
  - ⌨️ Keyboards & Mice (Logitech MK215, Dell KM3322W, Portronics Bubble, Logitech K380, Cosmic Byte Mechanical)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm

### 2. Run Both Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```

This will concurrently launch:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

Open `http://localhost:5173` in your browser to start shopping!

---

## 🔑 Activating Live Gemini 2.5 Flash (Optional)

BuyWise is pre-configured to work immediately using its built-in rule-based Advisor Engine. To enable live Google Gemini generative intelligence:

1. Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Open `server/.env` and paste your key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Restart the backend server. The indicator in the sidebar and settings will turn **green ("Gemini 2.5 Active")**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send conversational shopping query `{ message, history }` |
| `GET` | `/api/products` | Retrieve curated products with optional `?category=&maxPrice=&search=` |
| `GET` | `/api/health` | Health diagnostic check and Gemini status |

---

## ✅ Acceptance Criteria Status

| Requirement | PRD Spec | Status |
|---|---|---|
| **Send Message** | AI responds successfully with conversational context | ✅ Verified |
| **Conversation Context** | AI remembers previous messages across turns | ✅ Verified |
| **Follow-up Questions** | Asks relevant questions when requirements are incomplete | ✅ Verified |
| **Product Discovery** | Finds matching products in curated dataset | ✅ Verified |
| **Budget Filtering** | Respects specified spending limits | ✅ Verified |
| **Recommendations** | Renders rich product cards with specs, pros, cons, and reasoning | ✅ Verified |
| **Product Comparison** | Generates side-by-side comparison table with verdict | ✅ Verified |
| **Honest Advice** | Recommends when an upgrade is unnecessary | ✅ Verified |
| **New Chat** | Starts a fresh conversation | ✅ Verified |
| **Chat History** | Persists conversations in browser `localStorage` | ✅ Verified |
| **Copy Response** | Copies markdown response to clipboard with feedback | ✅ Verified |
| **Regenerate** | Requests another response for the latest turn | ✅ Verified |
| **Error Handling** | Displays friendly error messages without crashing | ✅ Verified |
| **Responsive UI** | Seamlessly adapts to desktop and mobile layouts | ✅ Verified |
