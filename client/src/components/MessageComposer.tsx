import React, { useRef, useEffect } from 'react';
import { ArrowUp, Loader2, ShieldCheck } from 'lucide-react';

interface MessageComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (messageText?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  placeholder = "Ask about products, budgets, comparisons, or honest advice..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      onSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1">
      <form
        onSubmit={handleFormSubmit}
        className="relative bg-white border border-zinc-200/90 rounded-2xl shadow-card focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/5 transition-all duration-150 overflow-hidden"
      >
        <div className="flex items-end px-3 py-2.5 gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={placeholder}
            className="w-full resize-none border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none max-h-44 py-1 px-1.5 leading-relaxed font-sans"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center btn-tactile transition-all ${
              !input.trim() || isLoading
                ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-900 text-white shadow-sm ring-1 ring-white/10'
            }`}
            title="Send message (Enter)"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Footer Subtext with Domain Guardrail Notice */}
        <div className="px-4 py-1.5 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Shopping Advisor • Electronics & Tech Products Only</span>
          </span>
          <span className="hidden sm:inline">
            <kbd className="px-1 py-0.5 bg-white border border-zinc-200 rounded text-[10px]">Enter</kbd> to send
          </span>
        </div>
      </form>
    </div>
  );
};
