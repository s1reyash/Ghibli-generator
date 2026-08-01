import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-[#E2E0D8] bg-white/80 backdrop-blur-md py-6 text-center text-xs text-[#7A7A7A]">
      <div className="container mx-auto px-4 max-w-4xl flex items-center justify-center">
        {/* Clean Signature Badge: Made by Aditya */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF9F6] border border-[#E2E0D8] shadow-xs text-xs font-bold text-[#111827] transition-transform hover:scale-105">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Made by <strong className="text-[#15803D] font-serif text-sm">Aditya</strong></span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>
    </footer>
  );
};
