# Requirements & Acceptance Criteria: BuyWise

## 1. Functional Requirements

### FR-1: Natural Shopping Conversation
- Contextual multi-turn dialogue with memory of user preferences, constraints, and past mentions.
- Adaptive follow-up questions only when essential parameters (usage, budget, form-factor) are missing.
- Polite topic redirection when user queries stray outside shopping and tech advice.

### FR-2: Personalized Product Recommendations
- Curated dataset grounding across 5 core categories: Laptops, Smartphones, Headphones, Smartwatches, Keyboards & Mice (25 total products).
- Zero hallucination policy: Only recommend verified products in the dataset with real specs and ₹ (INR) prices.
- Rich product recommendation cards rendering:
  - Product Image & Title
  - Brand & Category
  - Verified Price in ₹
  - Key Specifications badge list
  - Pros & Cons (Advantages vs Disadvantages)
  - "Why BuyWise recommends this" tailored reasoning
  - Purchase source link when available

### FR-3: Product Comparison
- Side-by-side comparison tables comparing 2 or more products across Price, Performance, Battery Life, Build Quality, Features, and Value for Money.
- Nuanced breakdown explaining which user persona each option suits best.

### FR-4: Smart Budget Advisor
- Strict adherence to maximum budget thresholds with warnings if an alternative exceeds it.
- Honest assessment of whether increasing a budget offers practical utility or diminished returns.

### FR-5: Honest Buying Advice
- Advises users when their current product is sufficient or if an upgrade provides negligible day-to-day difference.
- Deconstructs marketing buzzwords into plain English.

## 2. Technical Requirements
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express, `@google/genai` SDK for Gemini API integration (`gemini-2.5-flash`), CORS, Dotenv.
- **Storage**: Curated JSON product dataset (`products.json`), browser `localStorage` for conversation sessions.
- **Fallback Engine**: Local rule-based recommendation & advice engine guaranteeing 100% functionality even when offline or before API key setup.

## 3. Acceptance Criteria Checklist
| ID | Requirement | Verification Method |
|---|---|---|
| AC-1 | Send Message | AI responds naturally with shopping context |
| AC-2 | Context Retention | Remembers budget, usage, and past items in subsequent turns |
| AC-3 | Recommendations | Renders interactive product cards with verified specs |
| AC-4 | Comparisons | Generates structured comparison table on request |
| AC-5 | Honest Advice | Recommends against upgrade when existing product suffices |
| AC-6 | Local Storage | Conversations persist across page refreshes with "New Chat" option |
| AC-7 | Error Resilience | Graceful handling of network, missing key, or rate limits |
| AC-8 | Responsive Design | Flawless experience on both mobile (drawer menu) and desktop (sidebar) |
