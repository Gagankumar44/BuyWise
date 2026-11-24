import type { ChatResponsePayload, HealthStatus, Product } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  async sendMessage(message: string, history: { role: string; content: string }[]): Promise<ChatResponsePayload> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('[API Service] Failed to send message:', error);
      throw error;
    }
  },

  async getProducts(params?: { category?: string; maxPrice?: number; search?: string }): Promise<{ count: number; categories: string[]; products: Product[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
      if (params?.search) query.append('search', params.search);

      const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to load products');
      return await response.json();
    } catch (error) {
      console.error('[API Service] Failed to get products:', error);
      throw error;
    }
  },

  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('[API Service] Backend health check failed:', error);
      throw error;
    }
  }
};
