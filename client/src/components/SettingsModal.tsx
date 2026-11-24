import React from 'react';
import { X, Sparkles, Key, ShieldCheck, Server, RefreshCw } from 'lucide-react';
import type { HealthStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
  onRefreshHealth: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefreshHealth
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-elevation border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">BuyWise System & AI Settings</h3>
              <p className="text-xs text-gray-500">Service diagnostics and API configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-left text-xs">
          {/* Service Status Card */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-gray-600" />
                Backend Service Status
              </span>
              <button
                onClick={onRefreshHealth}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-[11px] font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60">
                <span className="text-gray-500 block text-[11px]">API Health</span>
                <span className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {health ? 'Operational (Port 5000)' : 'Unreachable'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60">
                <span className="text-gray-500 block text-[11px]">Intelligence Engine</span>
                <span className="font-bold text-gray-900 mt-0.5 block truncate">
                  {health?.gemini_configured ? 'Gemini 2.5 Flash' : 'Smart Local Advisor'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60">
                <span className="text-gray-500 block text-[11px]">Curated Dataset</span>
                <span className="font-bold text-gray-900 mt-0.5 block">
                  {health?.products_count ?? 25} Verified Products
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200/60">
                <span className="text-gray-500 block text-[11px]">Grounding Mode</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">
                  Zero Hallucination
                </span>
              </div>
            </div>
          </div>

          {/* Gemini AI API Key Guidance */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-800 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-600" />
              Gemini API Key Configuration
            </label>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              The application uses a server-side environment file for secure credentials. To activate live Gemini 2.5 generative reasoning, paste your key into:
            </p>
            <code className="block p-2.5 bg-gray-900 text-gray-100 rounded-lg font-mono text-[11px]">
              buywise1/server/.env → GEMINI_API_KEY=your_key_here
            </code>
            <p className="text-gray-500 text-[11px]">
              No API key? Don't worry! BuyWise comes pre-configured with a comprehensive local shopping advisor engine that runs completely offline and responds immediately.
            </p>
          </div>

          {/* Core Philosophy Guarantee */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-950">
              <span className="font-bold block">Strict Advisor Ethics</span>
              BuyWise is designed to never fabricate product features, ratings, prices, or links. If a user already owns a good product or if a price increase offers poor returns, BuyWise will candidly advise against spending money.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-medium rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
