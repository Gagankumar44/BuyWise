import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '../types';
import { ProductCard } from './ProductCard';
import { ComparisonTable } from './ComparisonTable';
import { Logo } from './Logo';
import {
  User,
  Copy,
  Check,
  RotateCw,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  ArrowRight,
  FastForward
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLatest: boolean;
  isStreaming?: boolean;
  onStreamingComplete?: () => void;
  onStreamProgress?: () => void;
  onRegenerate?: () => void;
  onSelectFollowUp?: (suggestion: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLatest,
  isStreaming = false,
  onStreamingComplete,
  onStreamProgress,
  onRegenerate,
  onSelectFollowUp
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState(() => isStreaming ? '' : message.content);
  const [isCompleted, setIsCompleted] = useState(() => !isStreaming);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(message.content);
      setIsCompleted(true);
      return;
    }

    // Split text into word tokens preserving whitespace
    const tokens = message.content.match(/\S+\s*/g) || [message.content];
    let currentIndex = 0;
    const chunkSize = 2; // 2 words per tick (~100 words/sec, smooth readable pacing)
    const intervalMs = 20;

    const timer = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= tokens.length) {
        setDisplayedText(message.content);
        setIsCompleted(true);
        clearInterval(timer);
        onStreamingComplete?.();
      } else {
        setDisplayedText(tokens.slice(0, currentIndex).join(''));
        onStreamProgress?.();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isStreaming, message.content]);

  const handleSkipStreaming = () => {
    setDisplayedText(message.content);
    setIsCompleted(true);
    onStreamingComplete?.();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-cascade">
        <div className="max-w-[85%] sm:max-w-[75%] flex items-end gap-2.5">
          <div className="bg-zinc-950 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm ring-1 ring-white/10 font-sans">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 text-xs font-semibold mb-0.5">
            <User className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex justify-start mb-8 text-left animate-cascade">
      <div className="w-full max-w-3xl flex items-start gap-3">
        {/* BuyWise Avatar with Bespoke Monogram Logo */}
        <div className="shrink-0 mt-0.5">
          <Logo size="sm" showText={false} />
        </div>

        {/* AI Content Container */}
        <div className="flex-1 min-w-0">
          {/* Top metadata pill */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-display font-bold text-zinc-950">BuyWise</span>
            {message.source && message.source !== 'domain-guardrail' && (
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                {message.source === 'gemini' ? 'Gemini 3.1 Flash' : 'Shopping Intelligence'}
              </span>
            )}
            {message.source === 'domain-guardrail' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                Shopping Questions Only
              </span>
            )}
            {message.isHonestAdvice && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Honest Buying Advice
              </span>
            )}

            {/* Skip streaming pill */}
            {!isCompleted && (
              <button
                type="button"
                onClick={handleSkipStreaming}
                className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors btn-tactile"
                title="Display full response immediately"
              >
                <span>Skip</span>
                <FastForward className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Main Markdown Content */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-subtle text-zinc-800 text-sm prose-chat font-sans relative">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedText}
            </ReactMarkdown>

            {/* Pulsing cursor while streaming */}
            {!isCompleted && (
              <span className="streaming-cursor" title="Advisor writing..." />
            )}

            {/* Error banner if message failed */}
            {message.status === 'error' && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{message.errorMessage || "Sorry, I'm having trouble responding right now. Please try again."}</span>
                </div>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 font-semibold rounded-lg border border-rose-200 transition-colors shrink-0 btn-tactile"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Embedded Structured Product Cards Grid - Revealed smoothly after text */}
          {isCompleted && message.products && message.products.length > 0 && (
            <div className="mt-4 animate-cards">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Recommended Products ({message.products.length})
                </span>
                <span className="text-[11px] font-mono text-zinc-400">Verified Specifications & Pricing</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {message.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Embedded Structured Comparison Table */}
          {isCompleted && message.comparison && (
            <div className="mt-4 animate-cards">
              <ComparisonTable comparison={message.comparison} />
            </div>
          )}

          {/* Follow-up Question Suggestions */}
          {isCompleted && message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
            <div className="mt-4 pt-2 animate-cards">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2 px-1">
                Suggested Follow-Up Inquiries
              </span>
              <div className="flex flex-wrap gap-2">
                {message.followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectFollowUp?.(suggestion)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/90 rounded-xl text-xs font-medium transition-colors shadow-subtle group text-left btn-tactile"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Actions: Copy & Regenerate */}
          {isCompleted && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-400">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-1 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors btn-tactile font-mono text-[11px]"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {isLatest && onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="inline-flex items-center gap-1 px-2 py-1 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors btn-tactile font-mono text-[11px]"
                  title="Regenerate response"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
