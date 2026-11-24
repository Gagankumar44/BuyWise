import { productService } from './productService.js';

export const localAdvisorService = {
  process({ message, history = [] }) {
    const text = message.trim().toLowerCase();
    const lastBotMessage = history.filter(h => h.role === 'model').slice(-1)[0]?.content?.toLowerCase() || '';
    const lastUserMessage = history.filter(h => h.role === 'user').slice(-2, -1)[0]?.content?.toLowerCase() || '';

    // Determine currently discussed category from history or message
    let activeCategory = null;
    const fullContext = `${lastUserMessage} ${lastBotMessage} ${text}`;
    if (/laptop|notebook|macbook|ryzen|intel|ideapad|vivobook/i.test(fullContext)) activeCategory = 'Laptops';
    else if (/phone|smartphone|mobile|redmi|moto|samsung|galaxy\s*m|oneplus/i.test(fullContext)) activeCategory = 'Smartphones';
    else if (/headphone|earbud|earphone|audio|tws|anc|buds|sound/i.test(fullContext)) activeCategory = 'Headphones';
    else if (/watch|smartwatch|fitness|tracker/i.test(fullContext)) activeCategory = 'Smartwatches';
    else if (/keyboard|mouse|mice/i.test(fullContext)) activeCategory = 'Keyboards and Mice';

    // 1. Casual Greetings & Conversational Questions
    if (/^(hi|hello|hey|greetings|good\s*(morning|evening|afternoon)|sup|yo)\b/i.test(text)) {
      return {
        reply: `Hey there! 👋 I'm **BuyWise**, your personal shopping advisor.\n\nI'm here to help you find the right tech products for your actual budget and needs—without sales bias or pushing expensive upgrades.\n\nWhat are you shopping for today? Tell me what you need, your approximate budget, or what you'll be using it for!`,
        recommendedProductIds: [],
        comparison: null,
        isHonestAdvice: false,
        followUpSuggestions: [
          "Suggest a laptop for coding under ₹50,000",
          "Help me choose wireless earbuds under ₹2,000",
          "Compare Moto G54 and Samsung Galaxy M35",
          "Do I really need an upgrade?"
        ]
      };
    }

    // 2. Strict Off-Topic Guardrail: Only shopping questions allowed
    if (this.isOffTopic(text)) {
      return {
        reply: `I am **BuyWise**, your personal shopping advisor. I specialize exclusively in helping you find, compare, and evaluate tech products within your budget.\n\nI am configured strictly for shopping and gadget purchasing advice—I cannot assist with general knowledge, coding assignments, homework, recipes, or other non-shopping topics.\n\nCould I help you find a laptop, smartphone, wireless earbuds, smartwatch, or desk setup instead?`,
        recommendedProductIds: [],
        comparison: null,
        isHonestAdvice: false,
        followUpSuggestions: [
          "Suggest a laptop for coding under ₹50,000",
          "Best phone with clean Android under ₹20,000",
          "Earbuds with active noise cancellation under ₹3,000",
          "Do I really need to upgrade my current device?"
        ]
      };
    }

    // 3. Follow-Up: Question about Battery Life
    if (/battery|backup|charging|how long.*last/i.test(text)) {
      return this.handleBatteryQuery(activeCategory, text);
    }

    // 4. Follow-Up: Question about Microphone / Calls / Zoom
    if (/mic|microphone|call|calling|zoom|teams|meeting|voice/i.test(text)) {
      return this.handleMicQuery(activeCategory, text);
    }

    // 5. Follow-Up: Question about Display / Screen
    if (/display|screen|amoled|lcd|brightness|nits|hz|refresh rate/i.test(text)) {
      return this.handleDisplayQuery(activeCategory, text);
    }

    // 6. Follow-Up: Question about Processor / RAM / Performance / Coding
    if (/processor|cpu|ram|performance|speed|gaming|code|coding|programming|docker/i.test(text)) {
      return this.handlePerformanceQuery(activeCategory, text);
    }

    // 7. Follow-Up: Question about Price / Cheaper Option
    if (/cheaper|cheapest|lowest price|save money|tight budget|less expensive/i.test(text)) {
      return this.handleCheaperQuery(activeCategory, text);
    }

    // 8. Honest Buying Advice / Upgrade Dilemma
    if (/upgrade|worth (it|the money|upgrading)|should i buy|already have/i.test(text)) {
      return this.handleUpgradeQuery(activeCategory, text);
    }

    // 9. Comparison Query
    if (/compare|versus|vs|difference/i.test(text)) {
      return this.handleComparison(text, fullContext);
    }

    // 10. General Category Recommendations
    return this.handleGeneralRecommendations(activeCategory, text);
  },

  isOffTopic(text) {
    // Greetings handled separately
    if (/^(hi|hello|hey|greetings|good\s*(morning|evening|afternoon)|sup|yo)\b/i.test(text)) return false;

    // Explicit non-shopping topics: coding assignments, homework, cooking, politics, etc.
    if (/python|javascript|java\b|c\+\+|html|css|sql|function\b|write.*code|debug|algorithm|script|compile|syntax|regex|loop|class\s+[A-Z]/i.test(text) && !/laptop|ram|processor|storage|spec|machine|computer/i.test(text)) {
      return true;
    }
    if (/weather|capital\s+of|recipe|cook|food|bake|joke|poem|story|president|prime\s+minister|movie|actor|song\s+lyrics|homework|math|physics|chemistry|biology|photosynthesis|history|geography|politics|election/i.test(text)) {
      return true;
    }
    if (/who\s+is|who\s+was|tell\s+me\s+about\s+(the\s+)?(war|universe|world|earth|sun|moon|stars|animals|birds|dog|cat)/i.test(text)) {
      return true;
    }

    // Check if it contains any shopping/tech relevance
    const shoppingWords = [
      'laptop', 'phone', 'smartphone', 'mobile', 'headphone', 'earbud', 'earphone', 'watch', 'smartwatch', 
      'keyboard', 'mouse', 'mice', 'audio', 'tws', 'anc', 'gadget', 'device', 'electronics',
      'buy', 'shop', 'shopping', 'purchase', 'price', 'pricing', 'cost', 'budget', 'worth', 'upgrade', 
      'under', 'below', 'cheap', 'cheaper', 'expensive', 'deal', 'specs', 'specification', 'review',
      'compare', 'comparison', 'vs', 'versus', 'difference', 'recommend', 'suggestion', 'suggest',
      'sound', 'battery', 'screen', 'display', 'ram', 'storage', 'ssd', 'processor', 'cpu', 'camera',
      'dell', 'hp', 'lenovo', 'apple', 'samsung', 'moto', 'motorola', 'oneplus', 'boat', 'realme', 'redmi',
      'asus', 'acer', 'noise', 'amazfit', 'fastrack', 'sony', 'zebronics', 'logitech'
    ];

    const hasShoppingIntent = shoppingWords.some(w => text.includes(w));
    if (text.length > 15 && !hasShoppingIntent) {
      return true;
    }

    return false;
  },

  handleBatteryQuery(category, text) {
    if (category === 'Laptops') {
      return {
        reply: `### Battery Life Breakdown for Laptops\n\nBattery endurance differs significantly depending on processor architecture:\n\n- **MacBook Air M1**: 👑 **14–16 real-world hours**. The custom Apple Silicon ARM architecture is unmatched—you can easily work through full college lectures without a charger.\n- **HP 15s (Ryzen 5)**: **7–8 hours**. AMD's 15W U-series chip is very power-efficient for typing, reading, and light coding.\n- **Lenovo IdeaPad Slim 3 (i5 12450H)**: **4.5–5.5 hours**. Because it uses a 45W high-performance H-series processor, it compiles code faster but drains battery quicker.\n\n*Recommendation*: If all-day unplugged battery is your highest priority, the **HP 15s** is the best balanced Windows option, while the **MacBook Air M1** is the king of battery.`,
        recommendedProductIds: ['lp-003', 'lp-005'],
        comparison: null,
        isHonestAdvice: false,
        followUpSuggestions: [
          "How is the keyboard on the HP 15s?",
          "Can the Lenovo IdeaPad Slim 3 handle heavy programming?",
          "Which laptop has the best screen?"
        ]
      };
    }

    if (category === 'Headphones') {
      return {
        reply: `### Battery Life Comparison for Earbuds & Headphones\n\n- **OnePlus Nord Buds 3**: **43 hours total** (up to 12 hours per single earbud charge with ANC off). Fast charge gives 11 hours in just 10 minutes.\n- **OnePlus Nord Buds 2r**: **38 hours total** (8 hours continuous on earbuds). Outstanding stamina for ₹1,799.\n- **Samsung Galaxy Buds FE**: **21 hours total** (6 hours per earbud with ANC on). Shorter battery, but offers more compact wing-tip ergonomics.\n- **Sony WH-CH720N (Over-Ear)**: 👑 **35 hours with ANC ON** / 50 hours with ANC OFF. You'll only need to charge it once or twice a month!\n\n*Verdict*: If maximum battery per rupee is what you want, the **OnePlus Nord Buds 3** is unbeatable.`,
        recommendedProductIds: ['hp-003', 'hp-005'],
        comparison: null,
        isHonestAdvice: false,
        followUpSuggestions: [
          "Which one has better active noise cancellation?",
          "Are they comfortable for 4+ hours of study?",
          "Show me phones under ₹15,000"
        ]
      };
    }

    if (category === 'Smartphones') {
      return {
        reply: `### Smartphone Battery & Charging Reality\n\n- **Moto G54 5G**: **6,000 mAh** battery + **33W in-box charger**. Easily delivers 1.5 to 2 days of screen time, and the charger is free in the retail box!\n- **Samsung Galaxy M35 5G**: **6,000 mAh** battery + 25W fast charging. Battery lasts 2 days easily, but *Samsung does NOT include a charger in the box* (budget ₹1,200 extra for a charger).\n- **OnePlus Nord CE 4 Lite**: **5,500 mAh** + **80W SuperVOOC**. Fully charges in about 50 minutes flat!\n\n*BuyWise Honest Take*: Moto G54 gives you the best total value since the charger is included.`,
        recommendedProductIds: ['sp-002', 'sp-003'],
        comparison: null,
        isHonestAdvice: true,
        followUpSuggestions: [
          "Compare Moto G54 and Samsung Galaxy M35",
          "Which has the better camera?",
          "Is the AMOLED display on Samsung worth it?"
        ]
      };
    }

    return {
      reply: `Battery life depends on your exact form factor and usage. Could you tell me which specific category or product you'd like battery details for?`,
      recommendedProductIds: [],
      comparison: null,
      isHonestAdvice: false,
      followUpSuggestions: ["Laptop battery life", "Headphone battery life", "Smartphone battery life"]
    };
  },

  handleMicQuery(category, text) {
    return {
      reply: `### Microphone & Call Quality Advice\n\nFor online classes, Zoom meetings, and clear voice calls, background noise reduction matters more than raw drivers:\n\n- **Top Budget Earbuds for Calls**: **OnePlus Nord Buds 2r (₹1,799)** features a dual-mic array with AI noise reduction algorithms that filter out fan noise and ambient room chatter remarkably well.\n- **Premium Call Clarity**: **Samsung Galaxy Buds FE (₹4,999)** uses a 3-microphone beamforming array (2 external + 1 internal) with deep neural network filtering. It isolates your voice even on windy streets.\n- **Over-Ear Comfort**: **Sony WH-CH720N (₹7,990)** uses precision voice pickup beamforming mics with dual noise sensor chips.\n\n*Honest Advice*: For college lectures and Zoom meetings, you **do not need to spend ₹5,000+**. The ₹1,799 OnePlus Nord Buds 2r already does a stellar job!`,
      recommendedProductIds: ['hp-002', 'hp-004'],
      comparison: null,
      isHonestAdvice: true,
      followUpSuggestions: [
        "What about noise cancellation for studying?",
        "Compare OnePlus Nord Buds 2r vs Nord Buds 3",
        "Suggest a laptop for online classes"
      ]
    };
  },

  handleDisplayQuery(category, text) {
    return {
      reply: `### Display & Screen Quality Guide\n\n- **Smartphones**: **Samsung Galaxy M35 5G** features a **120Hz Super AMOLED** display (1000 nits) with true pitch blacks. In contrast, **Moto G54** uses an IPS LCD. If you watch Netflix or YouTube frequently, AMOLED is noticeably richer.\n- **Laptops**: **Lenovo IdeaPad Slim 3** sports an **IPS 300-nits** panel with wide viewing angles, whereas budget models under ₹35k often use 250-nits TN panels that wash out when viewed from the side.\n- **Smartwatches**: **Fastrack Limitless FS1 Pro (₹1,499)** includes a curved **Super AMOLED** Always-On screen, which is dramatically crisper than standard TFT LCD screens at this price.\n\n*Recommendation*: If media consumption is your daily joy, spending slightly more for an AMOLED panel is one of the few upgrades that is genuinely worth the money.`,
      recommendedProductIds: ['sp-003', 'lp-004', 'sw-001'],
      comparison: null,
      isHonestAdvice: false,
      followUpSuggestions: [
        "Compare Moto G54 and Samsung Galaxy M35",
        "Which laptop has the best display under ₹50,000?",
        "Show me AMOLED smartwatches"
      ]
    };
  },

  handlePerformanceQuery(category, text) {
    return {
      reply: `### Performance & Multi-Tasking Breakdown\n\n- **For Programming & Engineering**: **16GB RAM is the true sweet spot**. With 8GB, running VS Code, a local database, Docker, and 15 Chrome tabs will cause paging to disk and noticeable lag. **HP 15s (₹43,990)** and **Lenovo IdeaPad Slim 3 (₹49,990)** both come with 16GB RAM factory-installed.\n- **CPU Power**: The **Lenovo IdeaPad Slim 3** features an Intel 12th Gen **H-series (45W)** chip. H-series processors have 8 physical cores and compile large codebases roughly 30% faster than standard low-power U-series chips.\n- **Light Gaming**: Integrated AMD Radeon and Intel Iris Xe graphics comfortably handle casual titles like Valorant, CS:GO, and FIFA at 1080p medium settings.\n\n*Verdict*: If coding performance is your goal, grab the **Lenovo IdeaPad Slim 3** for raw CPU muscle, or the **HP 15s** for the best balanced daily driver.`,
      recommendedProductIds: ['lp-004', 'lp-003'],
      comparison: null,
      isHonestAdvice: false,
      followUpSuggestions: [
        "What about the Acer Aspire Lite for ₹35,990?",
        "Is 8GB RAM enough for college work?",
        "Which laptop has better battery life?"
      ]
    };
  },

  handleCheaperQuery(category, text) {
    if (category === 'Laptops') {
      const p = productService.getById('lp-001');
      return {
        reply: `### The Most Affordable Quality Laptop: ${p.name} (₹${p.price.toLocaleString('en-IN')})\n\nIf you want to save maximum money without compromising on essential speed, the **Acer Aspire Lite** is your best bet:\n\n- ✅ **16 GB RAM** under ₹36,000 (unheard of at this price point!)\n- ✅ **AMD Ryzen 5 5500U** (6 cores, 12 threads) handles programming, office tasks, and browser multitasking effortlessly.\n- ⚠️ **The Compromise**: The outer shell is plastic rather than aluminum, the screen brightness is standard 250 nits, and the keyboard lacks backlighting.\n\n*BuyWise Advice*: If you don't mind typing in a lit room, this laptop saves you **₹14,000** compared to a ₹50,000 budget!`,
        recommendedProductIds: [p.id],
        comparison: null,
        isHonestAdvice: true,
        followUpSuggestions: [
          "Compare Acer Aspire Lite vs HP 15s",
          "Can it run Python and web development tools?",
          "Show me affordable wireless mice"
        ]
      };
    }

    if (category === 'Headphones') {
      const p = productService.getById('hp-001');
      return {
        reply: `### Ultra-Budget Pick: ${p.name} (₹${p.price.toLocaleString('en-IN')})\n\nAt just ₹1,299, the **boAt Rockerz 450** gives you cushioned on-ear earcups, 15 hours of battery, punchy bass, and an AUX cable backup so you can listen even when the battery is completely drained.\n\n*Limitation*: No Active Noise Cancellation and uses micro-USB, but for basic music and lectures, it's very reliable.`,
        recommendedProductIds: [p.id],
        comparison: null,
        isHonestAdvice: true,
        followUpSuggestions: [
          "What about OnePlus Nord Buds 2r at ₹1,799?",
          "Are wireless earbuds better than over-ear headphones?",
          "Show me affordable laptops"
        ]
      };
    }

    return {
      reply: `In our verified collection, the most affordable entry points are:\n- **Laptops**: Acer Aspire Lite at ₹35,990 (with 16GB RAM!)\n- **Smartphones**: Redmi 13C 5G at ₹9,999\n- **Headphones**: boAt Rockerz 450 at ₹1,299\n- **Smartwatches**: Fire-Boltt Ninja Call Pro Plus at ₹1,199\n- **Keyboards**: Portronics Bubble Wireless at ₹999\n\nWhich of these would you like to explore?`,
      recommendedProductIds: ['lp-001', 'sp-001', 'hp-001'],
      comparison: null,
      isHonestAdvice: true,
      followUpSuggestions: ["Show me the Acer laptop", "Show me the Redmi phone", "Show me the boAt headphones"]
    };
  },

  handleUpgradeQuery(category, text) {
    return {
      reply: `### BuyWise Honest Advice: Do you really need to upgrade?\n\nBefore you spend hard-earned money, here is our honest 3-point litmus test:\n\n1. **Is there a tangible bottleneck?** If your current device does what you need on a daily basis (browsing, writing, video calls, media), a newer device will feel identical after 48 hours.\n2. **Can you upgrade instead of replacing?** On laptops, upgrading from 8GB to 16GB RAM costs ~₹1,800, which solves 95% of slowdowns without buying a ₹50,000 new machine.\n3. **When buying IS justified**: When software won't install, hardware is broken, or battery life is under 1 hour and cannot be replaced.\n\n*Tell me what gadget you're thinking of replacing, and I'll give you an honest verdict on whether it's worth the money!*`,
      recommendedProductIds: [],
      comparison: null,
      isHonestAdvice: true,
      followUpSuggestions: [
        "I have 8GB RAM laptop, should I buy a new one?",
        "Should I upgrade from ₹2,000 earbuds to ₹5,000?",
        "Is Moto G54 worth upgrading to?"
      ]
    };
  },

  handleComparison(text, fullContext) {
    if (text.includes('buds') || text.includes('headphone') || fullContext.includes('headphone')) {
      const p1 = productService.getById('hp-003');
      const p2 = productService.getById('hp-004');
      return {
        reply: `### Head-to-Head: OnePlus Nord Buds 3 vs Samsung Galaxy Buds FE\n\n- **Noise Cancellation**: Galaxy Buds FE seals tighter and has stronger ANC; Nord Buds 3 cancels low rumbles effectively at 32dB.\n- **Call Microphones**: Galaxy Buds FE has superior 3-mic beamforming audio for loud environments.\n- **Battery**: Nord Buds 3 wins easily with **43 hours total** vs Galaxy Buds FE's **21 hours**.\n- **Price Difference**: OnePlus is **₹2,299**, while Samsung is **₹4,999**.\n\n**BuyWise Recommendation**: Unless you need the sports wingtips or work heavily on client calls, **OnePlus Nord Buds 3 delivers 85% of the experience for half the cost**!`,
        recommendedProductIds: [p1.id, p2.id],
        comparison: {
          title: "OnePlus Nord Buds 3 vs Samsung Galaxy Buds FE",
          productIds: [p1.id, p2.id],
          categories: [
            { aspect: "Price", details: { [p1.id]: "₹2,299", [p2.id]: "₹4,999" }, winner: p1.name },
            { aspect: "Active Noise Cancellation", details: { [p1.id]: "32dB ANC", [p2.id]: "30dB+ Deep ANC" }, winner: p2.name },
            { aspect: "Battery Life", details: { [p1.id]: "43 hours with case", [p2.id]: "21 hours with case" }, winner: p1.name },
            { aspect: "Value for Money", details: { [p1.id]: "Outstanding under ₹2.5k", [p2.id]: "Good for Galaxy users" }, winner: p1.name }
          ],
          verdict: "OnePlus Nord Buds 3 offers unbeatable value per rupee. Buy Galaxy Buds FE only if microphone fidelity in loud areas and workout wing-tips are essential."
        },
        isHonestAdvice: true,
        followUpSuggestions: [
          "What about OnePlus Nord Buds 2r for ₹1,799?",
          "Are there over-ear alternatives with ANC?",
          "Show me laptop recommendations"
        ]
      };
    }

    const p1 = productService.getById('sp-002');
    const p2 = productService.getById('sp-003');
    return {
      reply: `### Head-to-Head: Moto G54 5G vs Samsung Galaxy M35 5G\n\n- **Display**: Samsung wins with its **Super AMOLED 120Hz** screen vs Moto's IPS LCD.\n- **Software Updates**: Samsung promises **4 OS updates + 5 years security patches** vs Moto's single OS update.\n- **Clean Software & Extras**: Moto has near-stock clean Android with no ads, plus a **33W charger in the box**.\n- **Camera**: Moto includes **OIS at ₹13,999**, great for low-light photos.\n\n**Verdict**: Pick **Moto G54** to save ₹3,000 and get clean software. Pick **Samsung M35** if rich AMOLED screen and 4-year longevity are top priorities.`,
      recommendedProductIds: [p1.id, p2.id],
      comparison: {
        title: "Moto G54 5G vs Samsung Galaxy M35 5G",
        productIds: [p1.id, p2.id],
        categories: [
          { aspect: "Price", details: { [p1.id]: "₹13,999", [p2.id]: "₹16,999" }, winner: p1.name },
          { aspect: "Display", details: { [p1.id]: "6.5\" IPS LCD 120Hz", [p2.id]: "6.6\" Super AMOLED 120Hz" }, winner: p2.name },
          { aspect: "In the Box", details: { [p1.id]: "33W Turbo Charger included", [p2.id]: "No charger in box" }, winner: p1.name },
          { aspect: "Software Support", details: { [p1.id]: "1 OS update, clean UI", [p2.id]: "4 OS updates, One UI" }, winner: p2.name }
        ],
        verdict: "Moto G54 gives higher hardware value per rupee, while Samsung M35 offers superior display and long-term OS updates."
      },
      isHonestAdvice: true,
      followUpSuggestions: [
        "Which has better battery life?",
        "Is Moto camera good at night?",
        "Show me phones under ₹10,000"
      ]
    };
  },

  handleGeneralRecommendations(category, text) {
    const { matchedCategories, extractedBudget } = productService.findRelevantContext(text, []);
    const cat = category || matchedCategories[0] || 'Laptops';
    const products = productService.getAll({ category: cat, maxPrice: extractedBudget }).slice(0, 3);

    return {
      reply: `### BuyWise Curated Recommendations for ${cat}\n\nHere are the top matches that give you maximum reliability for your money:\n\n${products.map(p => `- **${p.name}** (₹${p.price.toLocaleString('en-IN')}): ${p.advantages[0] || p.description}`).join('\n\n')}\n\n*Would you like to compare any two of these, or should we look at specific aspects like battery, display, or performance?*`,
      recommendedProductIds: products.map(p => p.id),
      comparison: null,
      isHonestAdvice: false,
      followUpSuggestions: [
        `What about battery life of these ${cat.toLowerCase()}?`,
        `Which one offers the best value?`,
        `Is there a cheaper alternative?`
      ]
    };
  }
};
