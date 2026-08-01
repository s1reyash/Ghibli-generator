import React from 'react';
import { Sparkles, RefreshCw, Dices } from 'lucide-react';

interface GenerateControlsProps {
  onGenerate: () => void;
  onRegenerate: () => void;
  onSurpriseMe: () => void;
  hasResult: boolean;
  isGenerating: boolean;
}

export const GenerateControls: React.FC<GenerateControlsProps> = ({
  onGenerate,
  onRegenerate,
  onSurpriseMe,
  hasResult,
  isGenerating,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3.5 my-6">

      {/* Primary CTA: Generate 3-Part Story */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4A6B5D] via-[#3E5C4F] to-[#2D453B] text-white font-serif font-bold text-lg md:text-xl shadow-xl shadow-[#4A6B5D]/30 border border-[#6B8E7E] hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group"
      >
        <Sparkles className={`w-6 h-6 text-amber-300 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
        <span>{isGenerating ? 'Weaving Ghibli Magic...' : '✨ Generate 3-Part Story'}</span>
      </button>

      {/* Secondary Action: Regenerate Story */}
      {hasResult && (
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/90 border border-[#DCD1BA] text-[#4A5D4E] font-semibold text-sm shadow-sm hover:bg-[#F4EFE6] hover:text-[#1E293B] active:scale-95 transition flex items-center justify-center gap-2"
          title="Keep current selections and create a fresh new storyline"
        >
          <RefreshCw className={`w-4 h-4 text-[#D97706] ${isGenerating ? 'animate-spin' : ''}`} />
          <span>🔄 Regenerate Story</span>
        </button>
      )}

      {/* Secondary Action: Surprise Me */}
      <button
        onClick={onSurpriseMe}
        disabled={isGenerating}
        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/90 border border-[#DCD1BA] text-[#4A5D4E] font-semibold text-sm shadow-sm hover:bg-[#F4EFE6] hover:text-[#1E293B] active:scale-95 transition flex items-center justify-center gap-2"
        title="Pick random whimsical ingredients and generate a story"
      >
        <Dices className="w-4 h-4 text-[#38BDF8]" />
        <span>🎲 Surprise Me</span>
      </button>

    </div>
  );
};
