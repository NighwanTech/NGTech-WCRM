'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, Bot, MessageSquare, Send, Mic, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHasDismissed(true);
    sessionStorage.setItem('promo-dismissed-id2026', 'true');
  }, []);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo-dismissed-id2026');
    if (dismissed) {
      setHasDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasDismissed) {
        setIsOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasDismissed, handleClose]);

  if (!isOpen) return null;

  const features = [
    { icon: Bot, name: 'AI Sales & Voice Assistant', desc: 'Hindi & English AI Copilot', color: 'text-amber-500 bg-amber-500/10' },
    { icon: MessageSquare, name: 'WhatsApp CRM & Meta API', desc: 'Shared team inbox & broadcasts', color: 'text-emerald-500 bg-emerald-500/10' },
    { icon: Send, name: 'Autonomous Meta Ads OS', desc: '1-Click WhatsApp lead capture', color: 'text-blue-500 bg-blue-500/10' },
    { icon: ShieldCheck, name: 'BYOK & Zero-Trust Security', desc: '0% token markup & RBAC', color: 'text-purple-500 bg-purple-500/10' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="id-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={handleClose}
      />

      {/* Compact Main Card Container */}
      <div className="relative w-full max-w-md rounded-3xl bg-background/95 dark:bg-slate-950/95 border border-border/80 shadow-2xl shadow-black/40 p-5 sm:p-6 space-y-4 z-10 overflow-hidden backdrop-blur-2xl ring-1 ring-white/20 animate-in zoom-in-95 duration-250">
        
        {/* Background Tricolour Ambient Glow */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-2xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-emerald-500/20 via-teal-500/10 to-transparent blur-2xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close Independence Day Special Offer"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors z-20"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Section */}
        <div className="text-center space-y-2.5 pt-1">
          
          {/* Logo & Indian Flag Badge Header */}
          <div className="flex items-center justify-center gap-2.5">
            <img src="/logo.svg" alt="AIWCRM Logo" className="h-7 w-auto object-contain" />
            
            {/* SVG Indian Flag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white border border-amber-500/40 text-[11px] font-extrabold shadow-sm">
              {/* Indian Flag Graphic SVG */}
              <svg className="w-4 h-3 rounded-xs shadow-xs" viewBox="0 0 300 200">
                <rect width="300" height="66.6" fill="#FF9933" />
                <rect y="66.6" width="300" height="66.6" fill="#FFFFFF" />
                <rect y="133.3" width="300" height="66.6" fill="#138808" />
                <circle cx="150" cy="100" r="20" fill="none" stroke="#000080" strokeWidth="3" />
                {[...Array(24)].map((_, i) => (
                  <line
                    key={i}
                    x1="150"
                    y1="100"
                    x2={150 + 20 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={100 + 20 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#000080"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
              <span>Independence Day 2026</span>
            </div>
          </div>

          <h2 id="id-popup-title" className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-tight">
            Celebrate Independence.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-teal-400 to-emerald-500">
              Accelerate Your Business.
            </span>
          </h2>

          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Digitally transform sales, marketing & customer support with AIWCRM Enterprise AI Platform.
          </p>
        </div>

        {/* 4 Feature Pills Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-card/80 border border-border/60 hover:border-emerald-500/40 transition-all duration-200 group"
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${feat.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-foreground group-hover:text-emerald-500 transition-colors truncate">
                    {feat.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
                    {feat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Factual Trust Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px] font-bold">
          <span className="px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            🇮🇳 Made in India
          </span>
          <span className="px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
            🚀 Startup India
          </span>
          <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            🌱 Bihar Govt Funded
          </span>
        </div>

        {/* Primary CTA Button */}
        <div className="space-y-1.5 text-center pt-2 border-t border-border/60">
          <Link
            href="/book-demo"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white py-3 px-5 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
          >
            <span>🚀 Schedule Live Demo</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-[10px] text-muted-foreground">
            Discover how AIWCRM can transform your business with AI-powered automation.
          </p>
        </div>

        {/* Footer Line */}
        <div className="text-center pt-1 border-t border-border/40">
          <p className="text-[10px] font-bold text-muted-foreground/80 tracking-wide">
            Happy Independence Day from Team AIWCRM 🇮🇳
          </p>
        </div>

      </div>
    </div>
  );
}
