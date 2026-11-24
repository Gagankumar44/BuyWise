import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Keyboard, 
  ShieldCheck, 
  ArrowUpRight,
  HelpCircle,
  Scale
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const categories = [
    { name: "Laptops", query: "Suggest laptops for programming under ₹50,000", icon: Laptop, count: "5 models" },
    { name: "Smartphones", query: "Best smartphones with great battery under ₹20,000", icon: Smartphone, count: "5 models" },
    { name: "Headphones", query: "Comfortable wireless earbuds under ₹3,000 with ANC", icon: Headphones, count: "5 models" },
    { name: "Smartwatches", query: "Smartwatch with calling and AMOLED display under ₹2,000", icon: Watch, count: "5 models" },
    { name: "Keyboards & Mice", query: "Best wireless keyboard and mouse combo for desk work", icon: Keyboard, count: "5 models" }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col items-center text-center animate-cascade">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-mono mb-4 shadow-subtle ring-1 ring-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>BuyWise • Honest AI Shopping Advisor</span>
      </div>

      {/* Main Punchy Display Headline */}
      <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-zinc-950 tracking-tight mb-3">
        Your smarter way to shop.
      </h1>
      <p className="text-sm sm:text-base text-zinc-600 max-w-lg mx-auto mb-8 leading-relaxed font-sans">
        Tell me what you're looking for. I'll help you find what actually fits your needs and budget—without marketing hype.
      </p>

      {/* Core Philosophy Banner (Anti-AI-Slop Craft) */}
      <div className="w-full max-w-2xl bg-white border border-zinc-200/90 rounded-2xl p-4 mb-7 shadow-subtle flex items-center justify-between text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-zinc-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-900">Advisor Creed</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">Zero Sponsored Ads</span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5 italic">
              "Don't just help people buy products. Help them buy the RIGHT products."
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right text-[11px] font-mono text-zinc-400">
          <span>25 Curated Products</span>
        </div>
      </div>

      {/* Asymmetrical Bento Grid of Suggested Prompts */}
      <div className="w-full max-w-2xl mb-7 text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Common Inquiries
          </span>
          <span className="text-[11px] font-mono text-zinc-400">Select to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Laptop Recommendation */}
          <button
            type="button"
            onClick={() => onSelectPrompt("Find the best laptop under ₹50,000")}
            className="group p-4 bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 rounded-2xl text-left card-tactile btn-tactile shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-lg">
                  <Laptop className="w-3.5 h-3.5" />
                  Budget ≤ ₹50,000
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-sm font-display font-bold text-zinc-900 mb-1">
                "Find the best laptop under ₹50,000"
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Prioritize 16GB RAM, multi-core compilation power, and reliable battery.
              </p>
            </div>
          </button>

          {/* Card 2: Headphone Advice */}
          <button
            type="button"
            onClick={() => onSelectPrompt("Help me choose wireless headphones")}
            className="group p-4 bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 rounded-2xl text-left card-tactile btn-tactile shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-lg">
                  <Headphones className="w-3.5 h-3.5" />
                  Audio & Microphones
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-sm font-display font-bold text-zinc-900 mb-1">
                "Help me choose wireless headphones"
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Clear dual-mic calls for Zoom, battery stamina, and Active Noise Cancellation.
              </p>
            </div>
          </button>

          {/* Card 3: Smartphone Comparison */}
          <button
            type="button"
            onClick={() => onSelectPrompt("Compare Moto G54 5G and Samsung Galaxy M35 5G")}
            className="group p-4 bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 rounded-2xl text-left card-tactile btn-tactile shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-lg">
                  <Scale className="w-3.5 h-3.5" />
                  Head-to-Head
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-sm font-display font-bold text-zinc-900 mb-1">
                "Compare Moto G54 vs Samsung Galaxy M35"
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Clean Android with in-box charger vs vivid Super AMOLED 120Hz display.
              </p>
            </div>
          </button>

          {/* Card 4: Honest Buying Advice */}
          <button
            type="button"
            onClick={() => onSelectPrompt("Do I really need an upgrade?")}
            className="group p-4 bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-zinc-300 rounded-2xl text-left card-tactile btn-tactile shadow-subtle flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Anti-Hype Advice
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-sm font-display font-bold text-zinc-900 mb-1">
                "Do I really need an upgrade?"
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Honest evaluation on whether spending money provides practical difference.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Curated Category Quick Access Chips */}
      <div className="w-full max-w-2xl text-left">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-2 px-1">
          Explore by Category
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(cat.query)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200/90 rounded-xl text-xs font-medium text-zinc-700 hover:text-zinc-950 btn-tactile shadow-subtle"
              >
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
