import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric BuyWise Monogram Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm ring-1 ring-white/10 group`}>
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Geometric "B" + Shopping Lens Aperture */}
          <rect x="5" y="5" width="22" height="22" rx="6" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
          {/* Vertical spine */}
          <path d="M10 9H16C18.2091 9 20 10.7909 20 13C20 14.5 19 15.5 17.5 16C19.5 16.5 21 18.2 21 20C21 22.2091 19.2091 24 17 24H10V9Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Center divider dividing loops */}
          <path d="M10 16H16.5" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" />
          {/* Wise Accent Pip (Emerald spark for honest value) */}
          <circle cx="23" cy="8" r="2.5" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none text-left">
          <div className="flex items-center gap-1">
            <span className={`font-display font-bold tracking-tight text-zinc-900 ${textSizes[size]}`}>
              Buy<span className="text-zinc-500 font-semibold">Wise</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mb-0.5"></span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase mt-0.5">
            Shopping Advisor
          </span>
        </div>
      )}
    </div>
  );
};
