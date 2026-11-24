/**
 * BuyWise Shopping Domain Guardrail Service
 * Ensures the assistant ONLY answers shopping, consumer electronics, product, and purchasing questions.
 * Deterministically blocks all non-shopping queries (coding, homework, trivia, recipes, creative writing, etc.).
 */

export const guardrailService = {
  checkShoppingDomain(message = '', conversationHistory = []) {
    const text = message.trim().toLowerCase();

    // 1. Casual Greetings & Intro - Allowed so assistant can introduce itself
    const greetingMatch = /^(hi|hello|hey|greetings|good\s*(morning|evening|afternoon)|sup|yo|who\s*are\s*you|what\s*can\s*you\s*do|help)\b/i.test(text);
    if (greetingMatch && text.length < 50) {
      return { isShopping: true, isGreeting: true };
    }

    // 2. Explicit Non-Shopping Domains (Always Block)
    const nonShoppingRules = [
      // Software coding assignments, code generation, debugging
      { 
        regex: /\b(write|create|implement|generate|debug|fix|explain)\s+(a\s+)?(python|javascript|typescript|java|c\+\+|c#|html|css|sql|bash|powershell|script|function|algorithm|class|regex|loop|method|program|code)\b/i, 
        topic: "software coding and code generation" 
      },
      { 
        regex: /\b(def\s+[a-z_]|function\s*\(|console\.log|import\s+react|public\s+static\s+void|SELECT\s+.*\s+FROM|print\(|palindrome|fibonacci|binary\s+search)\b/i, 
        topic: "programming algorithms or syntax" 
      },

      // Academic Homework, Math, Science, Biology
      { 
        regex: /\b(photosynthesis|mitochondria|solve|equation|derivative|integral|quantum|gravity|newton's|chemical\s+formula|periodic\s+table|biology|physics\s+problem|math\s+problem|calculus|algebra|homework)\b/i, 
        topic: "academic homework and science concepts" 
      },

      // General Knowledge, History, Politics, World Leaders
      { 
        regex: /\b(who\s+(was|is)\s+(the\s+)?(president|prime\s+minister|king|queen|emperor|pope|founder\s+of|first\s+man|inventor))|(when\s+did\s+.*(war|revolution|die|born|founded))\b/i, 
        topic: "history and historical figures" 
      },
      { 
        regex: /\b(capital\s+of|tallest\s+mountain|deepest\s+ocean|longest\s+river|population\s+of|currency\s+of|where\s+is\s+(paris|london|tokyo|germany|france|canada|australia|russia|egypt|brazil|india))\b/i, 
        topic: "general geography and world trivia" 
      },
      { 
        regex: /\b(election|political\s+party|democrat|republican|biden|trump|modi|parliament|congress|senate)\b/i, 
        topic: "politics and government" 
      },

      // Creative Writing, Stories, Poems, Jokes
      { 
        regex: /\b(tell\s+me\s+a\s+(joke|story|riddle|poem|fairy\s+tale)|write\s+a\s+(poem|essay|story|song|script|letter|speech|novel|haiku))\b/i, 
        topic: "creative writing, jokes, or stories" 
      },

      // Cooking, Food, Recipes
      { 
        regex: /\b(recipe\s+for|how\s+to\s+(cook|bake|make|prepare|fry|boil)\s+(cake|pasta|pizza|rice|chicken|curry|soup|bread|coffee|tea|dish|food))\b/i, 
        topic: "cooking recipes and food preparation" 
      },

      // Medical & Legal Advice
      { 
        regex: /\b(symptoms\s+of|cure\s+for|medicine\s+for|treatment\s+for|doctor|diagnose|headache|fever|disease|infection|legal\s+advice|court\s+case|lawsuit|divorce)\b/i, 
        topic: "medical or legal guidance" 
      }
    ];

    for (const rule of nonShoppingRules) {
      if (rule.regex.test(text)) {
        return { isShopping: false, topic: rule.topic };
      }
    }

    // 3. Positive Shopping Intent Detection
    const shoppingTerms = [
      // Product Categories
      'laptop', 'notebook', 'pc', 'computer', 'macbook', 'desktop', 'chromebook',
      'phone', 'smartphone', 'mobile', 'android', 'iphone', 'galaxy', 'redmi', 'oneplus', 'moto', 'motorola',
      'headphone', 'headphones', 'earphone', 'earphones', 'earbud', 'earbuds', 'audio', 'tws', 'anc', 
      'noise cancelling', 'noise cancellation', 'sound', 'bass', 'mic', 'microphone',
      'watch', 'smartwatch', 'fitness tracker', 'band', 'wearable',
      'keyboard', 'mouse', 'mice', 'keycap', 'mechanical', 'trackpad', 'monitor', 'display', 'screen',
      'gadget', 'gadgets', 'device', 'devices', 'electronics', 'tech',
      
      // Shopping Actions & Financials
      'buy', 'shop', 'shopping', 'purchase', 'price', 'pricing', 'cost', 'budget', 'worth', 'upgrade',
      'under', 'below', 'cheap', 'cheapest', 'affordable', 'expensive', 'deal', 'discount', 'offer', 'sale',
      'recommend', 'recommendation', 'suggest', 'suggestion', 'compare', 'comparison', 'vs', 'versus', 
      'difference', 'better', 'best',
      
      // Hardware Specifications
      'specs', 'specification', 'specifications', 'ram', 'storage', 'ssd', 'processor', 'cpu', 'gpu', 
      'graphics', 'battery', 'battery life', 'charging', 'charger', 'durability', 'warranty', 'brand', 'model',
      'amoled', 'oled', 'hz', 'refresh rate', 'nits', 'weight', 'comfort', 'ports'
    ];

    const hasShoppingKeyword = shoppingTerms.some(term => {
      // Word boundary check
      const pattern = new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, 'i');
      return pattern.test(text);
    });

    if (hasShoppingKeyword) {
      return { isShopping: true };
    }

    // 4. Multi-Turn Follow-Up Questions (Check if ongoing conversation is shopping related)
    if (conversationHistory.length > 0) {
      const isContextualQuestion = /^(how\s*(long|much|many)|what\s*about|which\s*one|is\s*it|does\s*it|can\s*it|why|any\s*other|show\s*more|cheaper|better|warranty|color|size|weight|comfort|fit|gaming|battery|screen|camera|build|fast|slow|agree|disagree|confirm|tell\s*me\s*more)\b/i.test(text);
      if (isContextualQuestion) {
        return { isShopping: true };
      }
    }

    // 5. Default Fallback: If not clearly shopping, it is blocked
    return { 
      isShopping: false, 
      topic: "non-shopping inquiries" 
    };
  },

  getRefusalResponse(topic = "non-shopping inquiries") {
    return {
      reply: `I am **BuyWise**, your personal AI shopping advisor. I am built exclusively to help you find, compare, and evaluate tech products and stick to your budget.\n\n**I only answer questions about shopping, gadgets, and consumer electronics.** I cannot assist with ${topic} (such as general knowledge, coding assignments, homework, or recipes).\n\nCould I help you find a **laptop**, **smartphone**, **wireless earbuds**, **smartwatch**, or **computer accessories** instead?`,
      recommendedProductIds: [],
      comparison: null,
      isHonestAdvice: false,
      followUpSuggestions: [
        "Suggest laptops for programming under ₹50,000",
        "Best smartphone with great battery under ₹20,000",
        "Comfortable wireless earbuds under ₹3,000 with ANC",
        "Do I really need to upgrade my current device?"
      ]
    };
  }
};
