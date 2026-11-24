import React, { useState, useEffect } from 'react';
import { X, Search, Database, ShieldCheck } from 'lucide-react';
import type { Product } from '../types';
import { apiService } from '../services/api';

interface DatasetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutProduct: (productName: string) => void;
}

export const DatasetViewerModal: React.FC<DatasetViewerModalProps> = ({
  isOpen,
  onClose,
  onAskAboutProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiService.getProducts()
        .then((data) => {
          setProducts(data.products || []);
          setCategories(['All', ...(data.categories || [])]);
        })
        .catch((err) => console.error('Failed to load dataset in modal:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-elevation border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Curated Product Knowledge Base</h3>
              <p className="text-xs text-gray-500">25 genuine products across 5 categories powering BuyWise grounding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex flex-wrap gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or specs..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Products Grid / List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">Loading verified dataset...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No products match your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const formattedPrice = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                }).format(p.price);

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-subtle transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                        <span className="text-xs font-bold text-gray-900">{formattedPrice}</span>
                      </div>

                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{p.description}</p>

                      <div className="mt-3 space-y-1 border-t border-gray-100 pt-2 text-[11px]">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Key Specs</span>
                        {Object.entries(p.specifications).slice(0, 3).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-gray-600">
                            <span className="capitalize">{k.replace(/_/g, ' ')}:</span>
                            <span className="font-medium text-gray-800 truncate max-w-[55%]">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          onAskAboutProduct(`Tell me more about ${p.name} and whether it is worth buying.`);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Ask BuyWise
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filteredProducts.length} of {products.length} products in local catalog</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
