import React, { useState, useEffect } from 'react';
import type { GenerationResult } from '../types/generator';
import { Bookmark, Trash2, Copy, Check, X } from 'lucide-react';

interface DirectorsVaultProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSavedResult: (result: GenerationResult) => void;
}

export const DirectorsVault: React.FC<DirectorsVaultProps> = ({
  isOpen,
  onClose,
  onSelectSavedResult,
}) => {
  const [vault, setVault] = useState<GenerationResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('ghibli_vault');
        if (saved) {
          setVault(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    const updated = vault.filter(item => item.id !== id);
    setVault(updated);
    localStorage.setItem('ghibli_vault', JSON.stringify(updated));
  };

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#FAF9F6] border border-[#E2E0D8] rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-[#E2E0D8] pb-4">
          <div className="p-3 rounded-2xl bg-[#111827] text-amber-400 shadow-sm">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#111827]">
              Director's Story Vault (金庫)
            </h2>
            <p className="text-xs text-[#6B7280]">
              Bookmarked Ghibli 3-part prompt suites saved in your local studio archive.
            </p>
          </div>
        </div>

        {/* Vault Items */}
        {vault.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-[#111827]">Your Vault is empty.</p>
            <p className="text-xs text-[#6B7280]">
              Click "Bookmark Story" on any generated prompt suite to save it here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vault.map(item => (
              <div
                key={item.id}
                className="bg-white border border-[#E2E0D8] rounded-2xl p-4 md:p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E2E0D8] pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded">
                      Saved Story
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#111827] mt-1">
                      {item.bible.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] italic">
                      "{item.bible.conceptSummary}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectSavedResult(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      Load Story
                    </button>

                    <button
                      onClick={() =>
                        handleCopyPrompt(
                          `${item.scene1.fullPromptText}\n\n${item.scene2.fullPromptText}\n\n${item.scene3.fullPromptText}`,
                          item.id
                        )
                      }
                      className="p-2 rounded-xl bg-[#FAF9F6] border border-[#E2E0D8] text-[#111827] text-xs hover:bg-[#EAE8E0] transition cursor-pointer"
                      title="Copy all prompts"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                      title="Delete from Vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-[#4B5563] bg-[#FAF9F6] p-3 rounded-xl border border-[#E2E0D8] font-mono line-clamp-2">
                  {item.scene1.fullPromptText}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-[#E2E0D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
