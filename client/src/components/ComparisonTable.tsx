import React from 'react';
import type { ComparisonData } from '../types';
import { Scale, Trophy, Check } from 'lucide-react';

interface ComparisonTableProps {
  comparison: ComparisonData;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparison }) => {
  if (!comparison || !comparison.categories || comparison.categories.length === 0) {
    return null;
  }

  const productKeys = Object.keys(comparison.categories[0]?.details || {});

  return (
    <div className="my-5 border border-zinc-200/90 rounded-2xl overflow-hidden bg-white shadow-subtle">
      {/* Header Banner */}
      <div className="bg-zinc-50 p-4 border-b border-zinc-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-sm">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-zinc-950">{comparison.title || 'Product Comparison'}</h4>
            <p className="text-xs text-zinc-500 font-mono">Side-by-side spec and value analysis</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 bg-zinc-200/80 text-zinc-800 rounded-md">
          Unbiased Analysis
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200/80">
              <th className="py-2.5 px-4 font-mono font-semibold text-zinc-500 uppercase tracking-wider w-1/4 text-[10px]">
                Aspect
              </th>
              {productKeys.map((key, index) => (
                <th key={key} className="py-2.5 px-4 font-display font-bold text-zinc-900 w-1/3">
                  Option {index + 1}
                </th>
              ))}
              <th className="py-2.5 px-4 font-mono font-semibold text-zinc-500 uppercase tracking-wider text-right text-[10px]">
                Advantage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {comparison.categories.map((cat, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-700 bg-zinc-50/20 text-xs">
                  {cat.aspect}
                </td>
                {productKeys.map((key) => (
                  <td key={key} className="py-3 px-4 text-zinc-800 font-mono text-[11px]">
                    {cat.details[key] || '—'}
                  </td>
                ))}
                <td className="py-3 px-4 text-right">
                  {cat.winner ? (
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200/80">
                      <Trophy className="w-3 h-3 text-emerald-600" />
                      <span>{cat.winner}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-mono text-[10px]">Tie</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BuyWise Final Verdict Box */}
      {comparison.verdict && (
        <div className="p-4 bg-zinc-50/80 border-t border-zinc-200/80 flex items-start gap-3">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg mt-0.5 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-[11px] font-mono font-bold text-zinc-900 uppercase tracking-wider">
              BuyWise Final Verdict
            </h5>
            <p className="text-xs text-zinc-700 mt-0.5 leading-relaxed font-sans">
              {comparison.verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
