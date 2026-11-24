export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specifications: Record<string, string | number | boolean>;
  key_features: string[];
  advantages: string[];
  disadvantages: string[];
  purchase_url?: string;
  source: string;
  last_updated: string;
}

export interface ComparisonCategory {
  aspect: string;
  details: Record<string, string>;
  winner?: string;
}

export interface ComparisonData {
  title: string;
  productIds: string[];
  categories: ComparisonCategory[];
  verdict: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  products?: Product[];
  comparison?: ComparisonData | null;
  isHonestAdvice?: boolean;
  followUpSuggestions?: string[];
  source?: 'gemini' | 'local-advisor' | 'local-advisor-fallback' | 'domain-guardrail';
  status?: 'sending' | 'sent' | 'error';
  errorMessage?: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface ChatResponsePayload {
  success: boolean;
  reply: string;
  recommendedProductIds: string[];
  products: Product[];
  comparison: ComparisonData | null;
  isHonestAdvice: boolean;
  followUpSuggestions: string[];
  source: 'gemini' | 'local-advisor' | 'local-advisor-fallback';
  error?: string;
}

export interface HealthStatus {
  status: string;
  gemini_configured: boolean;
  products_count: number;
  timestamp: string;
}
