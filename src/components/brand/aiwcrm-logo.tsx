import React from 'react';

interface AiWcrmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AiWcrmLogo({ className = '', size = 'md' }: AiWcrmLogoProps) {
  // Height sizing
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${heights[size]} ${className}`}>
      {/* ─── Ai Icon Mark ─── */}
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0 drop-shadow-md"
      >
        <defs>
          {/* Tech Ocean Blue to Cyan Gradient */}
          <linearGradient id="ai-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Emerald Green Accent Gradient */}
          <linearGradient id="ai-green-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Letter "A" Loop */}
        <path
          d="M20 120 L65 20 C70 10, 85 10, 90 20 L135 120 C140 130, 125 135, 115 120 L98 80 L42 80 L35 120 C30 135, 15 130, 20 120 Z"
          fill="url(#ai-green-grad)"
        />

        {/* Embedded Chat Bubble in "A" */}
        <path
          d="M48 95 C40 95, 35 100, 35 108 C35 114, 40 118, 48 118 L52 124 L55 118 L68 118 C75 118, 80 114, 80 108 C80 100, 75 95, 68 95 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        <circle cx="48" cy="106.5" r="2.5" fill="#10B981" />
        <circle cx="58" cy="106.5" r="2.5" fill="#06B6D4" />
        <circle cx="68" cy="106.5" r="2.5" fill="#2563EB" />

        {/* Letter "i" Stem */}
        <path
          d="M125 45 C120 45, 115 50, 115 58 L115 118 C115 125, 125 130, 135 125 L135 58 C135 50, 130 45, 125 45 Z"
          fill="url(#ai-blue-grad)"
        />
        {/* "i" Dot */}
        <circle cx="125" cy="24" r="10" fill="#2563EB" />
      </svg>

      {/* ─── Thin Vertical Divider Line ─── */}
      <span className="h-6 sm:h-7 w-px bg-slate-400/40 dark:bg-slate-700 shrink-0" aria-hidden="true" />

      {/* ─── Brand Wordmark: WCRM ─── */}
      <div className="flex flex-col justify-center shrink-0">
        <span className="font-black text-2xl sm:text-3xl tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 font-sans">
          WCRM
        </span>
        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground mt-0.5 font-mono">
          AI PLATFORM
        </span>
      </div>
    </div>
  );
}
