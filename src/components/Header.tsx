import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './ThemeSwitcher';
import { Sparkles, ShieldCheck, Bookmark, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenVerifier: () => void;
  onOpenVault: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVerifier,
  onOpenVault,
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <header className="relative z-10 pt-8 pb-4 px-4 text-center max-w-4xl mx-auto">
      {/* Kanji Director's Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111827] text-white border border-[#D97706]/40 text-xs font-bold tracking-wider mb-3 shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>ジブリ・絵コンテ DECK — Studio Ghibli Storyboard Studio</span>
        <Compass className="w-3.5 h-3.5 text-amber-400" />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#111827] tracking-tight mb-2 font-title">
        Ghibli Prompt Generator
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-[#4B5563] font-medium max-w-lg mx-auto leading-relaxed">
        Create magical 30-second 9:16 vertical video stories, one scene at a time.
      </p>

      {/* Utility Action Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {/* Theme Switcher Bar */}
        <ThemeSwitcher
          currentTheme={currentTheme}
          onSelectTheme={onSelectTheme}
        />

        {/* AI Agent Verifier Button */}
        <button
          onClick={onOpenVerifier}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#3E5A47] text-white shadow-xs hover:bg-[#32493A] transition cursor-pointer"
          title="Open AI Prompt Verification Agent"
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>AI Verifier Agent</span>
        </button>

        {/* Director's Vault Button */}
        <button
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#111827] text-amber-400 border border-[#D97706]/30 shadow-xs hover:bg-slate-800 transition cursor-pointer"
          title="Open Saved Prompt Vault"
        >
          <Bookmark className="w-4 h-4" />
          <span>Director's Vault</span>
        </button>
      </div>

      {/* Step Indicator Bar */}
      <div className="mt-5 inline-flex items-center justify-center gap-2 md:gap-6 text-xs text-[#6B7280] bg-white border border-[#E2E0D8] rounded-2xl px-5 py-2 shadow-xs">
        <span className="flex items-center gap-1.5 font-bold text-[#111827]">
          <span className="w-4 h-4 rounded-full bg-[#EAE8E0] text-[#111827] flex items-center justify-center text-[10px]">1</span>
          Select Ingredients
        </span>
        <span className="text-[#CCC]">→</span>
        <span className="flex items-center gap-1.5 font-bold text-[#111827]">
          <span className="w-4 h-4 rounded-full bg-[#EAE8E0] text-[#111827] flex items-center justify-center text-[10px]">2</span>
          Matrix Tuning
        </span>
        <span className="text-[#CCC]">→</span>
        <span className="flex items-center gap-1.5 font-bold text-[#111827]">
          <span className="w-4 h-4 rounded-full bg-[#EAE8E0] text-[#111827] flex items-center justify-center text-[10px]">3</span>
          Generate 3-Scene Story
        </span>
      </div>
    </header>
  );
};
