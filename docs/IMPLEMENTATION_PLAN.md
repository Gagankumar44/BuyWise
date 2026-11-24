# Implementation Plan: BuyWise

## Milestones & Execution Order

### Phase 1: Project Setup & Scaffolding
- [x] Discovery & Architecture definition
- [ ] Root monorepo setup (`package.json`, root scripts, concurrently)
- [ ] Backend setup (`/server` with Express, CORS, Dotenv, nodemon)
- [ ] Frontend setup (`/client` with Vite, React 18, Tailwind CSS, Lucide Icons)

### Phase 2: Curated Product Dataset & Backend Endpoints
- [ ] Curate 25 realistic, genuine tech products with accurate specs, INR prices, pros, cons, and images across:
  1. Laptops (Budget, Programming, College)
  2. Smartphones (Budget, Mid-range, Flagship-killer)
  3. Headphones (Budget TWS, Over-ear ANC, Neckband)
  4. Smartwatches (Fitness band, AMOLED smartwatch, Calling smartwatch)
  5. Keyboards & Mice (Mechanical keyboard, Wireless mouse combo, Ergonomic)
- [ ] Implement product filtering, keyword extraction, and query matching service
- [ ] Implement Gemini AI integration (`gemini-2.5-flash` with `@google/genai`)
- [ ] Implement high-intelligence local shopping advisor fallback engine
- [ ] Build `/api/chat`, `/api/products`, `/api/health` endpoints with validation and error resilience

### Phase 3: Frontend Interface & Components
- [ ] Layout with collapsible sidebar (New chat, conversation history, clear chats, settings modal)
- [ ] Chat conversation window with smooth auto-scroll
- [ ] Welcome state with hero banner & 4 interactive starter prompts
- [ ] Message composer with auto-expanding textarea, Enter-to-send, Shift+Enter newline, and send button
- [ ] Structured Product Cards (Image, price, brand, specs, pros/cons badges, recommendation rationale)
- [ ] Comparison Table Component (Side-by-side spec comparison, category ratings, final verdict)
- [ ] Message action buttons (Copy text with feedback, Regenerate response)
- [ ] Typing & Loading indicators

### Phase 4: State Management & Persistence
- [ ] Client-side conversation state with localStorage persistence
- [ ] Session switcher (switch between active and historical chat threads)
- [ ] Error boundary, toast notifications, and retry mechanisms

### Phase 5: Verification & Quality Assurance
- [ ] End-to-end testing of typical user flows (recommendations, comparisons, budget checks, honest advice)
- [ ] Verification on desktop and mobile viewports
- [ ] Build validation for both client (`npm run build`) and server
