import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  ShieldCheck
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  recommendationReason?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, recommendationReason }) => {
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const specEntries = Object.entries(product.specifications || {});
  const displayedSpecs = showAllSpecs ? specEntries : specEntries.slice(0, 4);

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card card-tactile flex flex-col h-full text-left">
      {/* Product Image & Badges */}
      <div className="relative h-48 bg-zinc-100 overflow-hidden group">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-emil-out"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center font-mono text-xs">
            <Tag className="w-8 h-8 mb-1 opacity-40 stroke-[1.5]" />
            <span>{product.name}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-white/95 backdrop-blur-md text-zinc-900 rounded-lg shadow-subtle border border-zinc-200/80">
            {product.brand}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-mono font-medium bg-zinc-900/90 backdrop-blur-md text-white rounded-lg shadow-subtle">
            {product.category}
          </span>
        </div>

        {/* Price Tag in Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 font-mono text-xs font-bold bg-white/95 backdrop-blur-md text-zinc-950 rounded-lg shadow-subtle border border-zinc-200/90">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Description */}
        <div className="mb-3">
          <h4 className="text-base font-display font-bold text-zinc-950 leading-snug line-clamp-1 hover:line-clamp-none">
            {product.name}
          </h4>
          <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Why BuyWise Recommends Callout */}
        <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-display tracking-tight text-[11px] uppercase">Why BuyWise Recommends This</span>
          </div>
          <p className="text-zinc-700 leading-relaxed text-xs">
            {recommendationReason || product.advantages[0] || 'Matches your budget and intended performance requirements.'}
          </p>
        </div>

        {/* Key Specifications Table */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Specifications</span>
            {specEntries.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSpecs(!showAllSpecs)}
                className="text-[11px] font-mono text-zinc-600 hover:text-zinc-950 font-medium inline-flex items-center gap-0.5 btn-tactile"
              >
                {showAllSpecs ? (
                  <>Less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>All {specEntries.length} specs <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            {displayedSpecs.map(([key, val]) => (
              <div key={key} className="flex justify-between py-1 border-b border-zinc-100 last:border-b-0">
                <span className="text-zinc-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-mono text-zinc-900 font-medium text-right ml-2 max-w-[65%] truncate text-[11px]" title={String(val)}>
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages & Limitations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs">
          {/* Advantages */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Advantages</span>
            </div>
            <ul className="space-y-1 text-emerald-950/90 text-[11px]">
              {product.advantages?.slice(0, 2).map((adv, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-emerald-500 leading-none mt-0.5">•</span>
                  <span className="leading-snug">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Limitations</span>
            </div>
            <ul className="space-y-1 text-amber-950/90 text-[11px]">
              {product.disadvantages?.slice(0, 2).map((dis, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-amber-500 leading-none mt-0.5">•</span>
                  <span className="leading-snug">{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated & Verified</span>
          </div>

          {product.purchase_url ? (
            <a
              href={product.purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-white font-medium rounded-lg text-xs btn-tactile shadow-subtle ring-1 ring-white/10"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] font-mono text-zinc-400">Retail link pending</span>
          )}
        </div>
      </div>
    </div>
  );
};
