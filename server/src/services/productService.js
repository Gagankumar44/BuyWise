import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../data/products.json');

let productsCache = [];

function loadProducts() {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    productsCache = JSON.parse(rawData);
    console.log(`[ProductService] Loaded ${productsCache.length} curated products.`);
  } catch (err) {
    console.error('[ProductService] Error loading products dataset:', err);
    productsCache = [];
  }
}

// Initial load
loadProducts();

export const productService = {
  getAll(filters = {}) {
    let result = [...productsCache];

    if (filters.category) {
      const catLower = filters.category.toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === catLower);
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!isNaN(max) && max > 0) {
        result = result.filter(p => p.price <= max);
      }
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return result;
  },

  getById(id) {
    return productsCache.find(p => p.id === id) || null;
  },

  getByIds(ids = []) {
    if (!Array.isArray(ids)) return [];
    return productsCache.filter(p => ids.includes(p.id));
  },

  getCategories() {
    return [...new Set(productsCache.map(p => p.category))];
  },

  /**
   * Intelligently retrieve relevant products given user message & budget constraints
   */
  findRelevantContext(message = '', conversationHistory = []) {
    const text = (message + ' ' + conversationHistory.map(h => h.content || '').join(' ')).toLowerCase();
    
    // Detect categories
    const categories = [];
    if (/laptop|notebook|computer|pc|macbook|ryzen|intel|ideapad|vivobook/i.test(text)) categories.push('Laptops');
    if (/phone|smartphone|mobile|redmi|moto|oneplus|samsung|galaxy\s*m|android/i.test(text)) categories.push('Smartphones');
    if (/headphone|earbud|earphone|audio|tws|anc|boat|nord\s*buds|galaxy\s*buds|sound|wh-ch/i.test(text)) categories.push('Headphones');
    if (/watch|smartwatch|fitness|band|tracker|amazfit|fastrack|noise|galaxy\s*watch/i.test(text)) categories.push('Smartwatches');
    if (/keyboard|mouse|mice|typewriter|keycap|tkl|combos|mechanical|logitech|k380|dell/i.test(text)) categories.push('Keyboards and Mice');

    // Extract potential budget numbers
    const budgetMatches = text.match(/(?:under|below|budget|within|approx|around)?\s*(?:₹|rs\.?|inr)?\s*(\d{1,2}(?:,\d{3})+|\d+)\s*(k|thousand|lakh)?/gi) || [];
    let extractedBudget = null;

    for (const match of budgetMatches) {
      const clean = match.replace(/,/g, '').toLowerCase();
      const numMatch = clean.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        let val = parseFloat(numMatch[1]);
        if (clean.includes('k') || clean.includes('thousand')) val *= 1000;
        if (clean.includes('lakh')) val *= 100000;
        if (val >= 500 && val <= 200000) {
          extractedBudget = val;
        }
      }
    }

    let candidates = productsCache;
    if (categories.length > 0) {
      candidates = candidates.filter(p => categories.includes(p.category));
    }

    // Prioritize products directly mentioned by brand or name in text
    const directlyMentioned = productsCache.filter(p => {
      const nameMatch = text.includes(p.name.toLowerCase());
      const brandMatch = text.includes(p.brand.toLowerCase());
      return nameMatch || (brandMatch && (p.tags?.some(t => text.includes(t.toLowerCase())) || text.includes(p.category.toLowerCase())));
    });

    if (directlyMentioned.length > 0) {
      // Put directly mentioned products at the front
      const mentionedIds = new Set(directlyMentioned.map(p => p.id));
      candidates = [...directlyMentioned, ...candidates.filter(p => !mentionedIds.has(p.id))];
    }

    if (extractedBudget) {
      // Find matches within budget or close to it
      const withinBudget = candidates.filter(p => p.price <= extractedBudget);
      if (withinBudget.length > 0) {
        candidates = withinBudget;
      }
    }

    return {
      matchedCategories: categories,
      extractedBudget,
      candidates: candidates.slice(0, 8),
      allAvailableProducts: productsCache.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        specs: p.specifications,
        advantages: p.advantages,
        disadvantages: p.disadvantages
      }))
    };
  }
};
