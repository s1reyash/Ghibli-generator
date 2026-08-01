import React, { useState } from 'react';
import type { GenerationResult, ScenePrompt } from '../types/generator';
import { SceneAnimationDeck } from './SceneAnimationDeck';
import { Copy, Check, Film, ShieldAlert, Sparkles, Clock, Volume2, Anchor, ShieldCheck, Download, Smartphone, Bookmark } from 'lucide-react';

interface PromptOutputProps {
  result: GenerationResult;
  onOpenVerifierForText: (text: string) => void;
  onSaveToVault?: (result: GenerationResult) => void;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({
  result,
  onOpenVerifierForText,
  onSaveToVault,
}) => {
  const [copiedScene, setCopiedScene] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedNegative, setCopiedNegative] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const copyToClipboard = async (text: string, type: 'scene' | 'all' | 'negative', sceneNum?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'scene' && sceneNum) {
        setCopiedScene(sceneNum);
        setTimeout(() => setCopiedScene(null), 2000);
      } else if (type === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else if (type === 'negative') {
        setCopiedNegative(true);
        setTimeout(() => setCopiedNegative(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleBookmark = () => {
    try {
      const existing = localStorage.getItem('ghibli_vault');
      const list: GenerationResult[] = existing ? JSON.parse(existing) : [];
      if (!list.some(item => item.id === result.id)) {
        list.unshift(result);
        localStorage.setItem('ghibli_vault', JSON.stringify(list));
      }
      setIsSaved(true);
      if (onSaveToVault) onSaveToVault(result);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      // ignore
    }
  };

  const allPromptsText = `📖 STORY: ${result.bible.title}
CONCEPT: ${result.bible.conceptSummary}

==================================================
${result.scene1.fullPromptText}

==================================================
${result.scene2.fullPromptText}

==================================================
${result.scene3.fullPromptText}

==================================================
🚫 NEGATIVE PROMPT:
${result.negativePrompt}`;

  const downloadAsJSON = () => {
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghibli-prompt-${result.bible.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-6 animate-fade-in">

      {/* Story Header & Consistency Locks */}
      <div className="bg-white border border-[#E2E0D8] rounded-3xl p-6 md:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E2E0D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAE8E0] text-[11px] font-bold text-[#3E5A47] uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
              9:16 Vertical Ghibli Story Bible
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111827]">
              {result.bible.title}
            </h2>
            <p className="text-xs md:text-sm text-[#4B5563] italic mt-1 max-w-xl">
              "{result.bible.conceptSummary}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Save to Vault button */}
            <button
              onClick={handleBookmark}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#111827] text-amber-400 border border-[#D97706]/30 hover:bg-slate-800'
              }`}
              title="Save story to Director's Vault"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved to Vault!' : 'Bookmark Story'}</span>
            </button>

            <button
              onClick={() => copyToClipboard(allPromptsText, 'all')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                copiedAll
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#3E5A47] text-white hover:bg-[#32493A]'
              }`}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'All Prompts Copied!' : '📋 Copy All Prompts'}</span>
            </button>

            <button
              onClick={downloadAsJSON}
              className="px-3 py-2.5 rounded-xl font-semibold text-xs border border-[#E2E0D8] bg-[#FAF9F6] text-[#111827] hover:bg-[#EAE8E0] transition flex items-center gap-1.5 cursor-pointer"
              title="Download story prompts as JSON file"
            >
              <Download className="w-3.5 h-3.5 text-[#3E5A47]" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Story Bible Locks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E2E0D8]">
            <span className="font-bold text-[#111827] block mb-0.5">👤 Character Lock</span>
            <p className="text-[#4B5563]">
              <strong className="text-[#111827]">{result.bible.characterLock.name}</strong> ({result.bible.characterLock.age}) — {result.bible.characterLock.clothing}
            </p>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E2E0D8]">
            <span className="font-bold text-[#111827] block mb-0.5">🐾 Animal & Prop Lock</span>
            <p className="text-[#4B5563]">
              <strong className="text-[#111827]">{result.bible.animalLock.species}</strong> & <strong className="text-[#111827]">{result.bible.objectLock.names.join(', ')}</strong>
            </p>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E2E0D8]">
            <span className="font-bold text-[#111827] block mb-0.5">🌲 Format & Environment</span>
            <p className="text-[#4B5563]">
              <strong>9:16 Vertical Video</strong> • {result.bible.environmentLock.name} ({result.bible.environmentLock.timeOfDay})
            </p>
          </div>
        </div>
      </div>

      {/* 3 Scene Prompt Cards */}
      <div className="space-y-6">
        {[result.scene1, result.scene2, result.scene3].map((scene: ScenePrompt) => {
          const isCopied = copiedScene === scene.sceneNumber;

          return (
            <div
              key={scene.sceneNumber}
              className="bg-white rounded-3xl border border-[#E2E0D8] p-5 md:p-6 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-[#E2E0D8]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#EAE8E0] text-[#111827] border border-[#D8D5C8]">
                    🎬 Scene 0{scene.sceneNumber} — {scene.sceneNumber === 1 ? 'Beginning' : scene.sceneNumber === 2 ? 'Continuation' : 'Ending'}
                  </span>
                  <span className="text-xs text-[#6B7280] flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> 10 Seconds
                  </span>
                  <span className="text-xs text-[#3E5A47] bg-[#EAE8E0] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> 9:16 Vertical
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Verify Prompt Button */}
                  <button
                    onClick={() => onOpenVerifierForText(scene.fullPromptText)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF9F6] text-[#3E5A47] border border-[#E2E0D8] hover:bg-[#3E5A47] hover:text-white transition flex items-center gap-1 cursor-pointer"
                    title="Audit prompt with AI Verifier Agent"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Prompt</span>
                  </button>

                  {/* Copy Prompt Button */}
                  <button
                    onClick={() => copyToClipboard(scene.fullPromptText, 'scene', scene.sceneNumber)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#3E5A47] text-white hover:bg-[#32493A]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied ✓' : 'Copy Prompt'}</span>
                  </button>
                </div>
              </div>

              {/* Live Animated Canvas Deck */}
              <SceneAnimationDeck
                sceneNumber={scene.sceneNumber}
                weather={result.bible.environmentLock.weather}
                timeOfDay={result.bible.environmentLock.timeOfDay}
              />

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#374151] bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E2E0D8]">
                  <Film className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Action:</strong> {scene.characterAction}</span>
                </div>
                <div className="flex items-center gap-2 text-[#374151] bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E2E0D8]">
                  <Volume2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span><strong>ASMR Sounds:</strong> {scene.asmrSoundscape}</span>
                </div>
              </div>

              {/* Prompt Text Box */}
              <div className="bg-[#111827] text-slate-100 rounded-2xl p-4 md:p-5 text-xs md:text-sm font-mono leading-relaxed whitespace-pre-wrap selection:bg-amber-500 relative">
                <div className="absolute top-2.5 right-3 text-[10px] text-slate-400 uppercase tracking-widest font-sans">
                  Scene #{scene.sceneNumber} Prompt (9:16)
                </div>
                {scene.fullPromptText}
              </div>

              {/* Continuity Anchor */}
              <div className="pt-2 flex items-start gap-2 text-xs text-[#4B5563]">
                <Anchor className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#111827]">Continuity Lock Anchor:</strong> {scene.continuityAnchor}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Universal Negative Prompt */}
      <div className="bg-white border border-[#E2E0D8] rounded-3xl p-5 md:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Universal Negative Prompt
          </h3>

          <button
            onClick={() => copyToClipboard(result.negativePrompt, 'negative')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
              copiedNegative
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[#FAF9F6] text-[#111827] border-[#E2E0D8] hover:bg-[#EAE8E0]'
            }`}
          >
            {copiedNegative ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNegative ? 'Copied ✓' : 'Copy Negative Prompt'}</span>
          </button>
        </div>

        <div className="bg-[#111827] text-slate-300 rounded-xl p-3.5 text-xs font-mono whitespace-pre-wrap">
          {result.negativePrompt}
        </div>
      </div>

    </div>
  );
};
