import express from 'express';
import { productService } from '../services/productService.js';
import { geminiService } from '../services/geminiService.js';
import { localAdvisorService } from '../services/localAdvisorService.js';
import { guardrailService } from '../services/guardrailService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Primary conversational shopping advisor endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty.'
      });
    }

    const cleanMessage = message.trim();

    // STRICT DOMAIN GUARDRAIL: Only shopping and tech purchasing questions allowed
    const domainCheck = guardrailService.checkShoppingDomain(cleanMessage, history);
    if (!domainCheck.isShopping) {
      console.log(`[API Guardrail] Blocked non-shopping question: "${cleanMessage.slice(0, 60)}" (Topic: ${domainCheck.topic})`);
      const refusal = guardrailService.getRefusalResponse(domainCheck.topic);
      return res.json({
        success: true,
        reply: refusal.reply,
        recommendedProductIds: [],
        products: [],
        comparison: null,
        isHonestAdvice: false,
        followUpSuggestions: refusal.followUpSuggestions,
        source: 'domain-guardrail'
      });
    }

    const contextData = productService.findRelevantContext(cleanMessage, history);

    let adviceResult = null;
    let source = 'gemini';

    // Check if Gemini is configured
    if (geminiService.isConfigured()) {
      try {
        console.log('[API] Attempting Gemini AI recommendation...');
        adviceResult = await geminiService.generateShoppingAdvice({
          message: cleanMessage,
          history,
          contextData
        });
      } catch (geminiError) {
        console.warn('[API] Gemini AI call failed or rate-limited. Falling back to Local Advisor Engine:', geminiError.message);
        source = 'local-advisor-fallback';
        adviceResult = localAdvisorService.process({ message: cleanMessage, history });
      }
    } else {
      console.log('[API] Using smart Local Advisor Engine (Gemini key not configured)...');
      source = 'local-advisor';
      adviceResult = localAdvisorService.process({ message: cleanMessage, history });
    }

    // Hydrate recommended product objects from IDs
    const recommendedProducts = productService.getByIds(adviceResult.recommendedProductIds || []);

    return res.json({
      success: true,
      reply: adviceResult.reply,
      recommendedProductIds: adviceResult.recommendedProductIds || [],
      products: recommendedProducts,
      comparison: adviceResult.comparison || null,
      isHonestAdvice: Boolean(adviceResult.isHonestAdvice),
      followUpSuggestions: adviceResult.followUpSuggestions || [],
      source
    });
  } catch (error) {
    console.error('[API /chat] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Sorry, I encountered an unexpected error processing your shopping request. Please try again.',
      reply: "Sorry, I'm having trouble responding right now. Please try again."
    });
  }
});

/**
 * GET /api/products
 * Retrieve products with optional filtering
 */
router.get('/products', (req, res) => {
  try {
    const { category, maxPrice, search } = req.query;
    const products = productService.getAll({ category, maxPrice, search });
    const categories = productService.getCategories();

    return res.json({
      success: true,
      count: products.length,
      categories,
      products
    });
  } catch (error) {
    console.error('[API /products] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve products dataset.'
    });
  }
});

/**
 * GET /api/health
 * Backend status check
 */
router.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    gemini_configured: geminiService.isConfigured(),
    products_count: productService.getAll().length,
    timestamp: new Date().toISOString()
  });
});

export default router;
