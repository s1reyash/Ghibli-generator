import React, { useState } from 'react';
import type { YouTubeMetadata } from '../types/generator';
import { Video, Copy, Check, Hash, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface YouTubeMetadataCardProps {
  metadata: YouTubeMetadata;
}

export const YouTubeMetadataCard: React.FC<YouTubeMetadataCardProps> = ({ metadata }) => {
  const [copiedDesc, setCopiedDesc] = useState<boolean>(false);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  const handleCopyDesc = async () => {
    try {
      await navigator.clipboard.writeText(metadata.fullCopyText);
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopy100Tags = async () => {
    try {
      await navigator.clipboard.writeText(metadata.allSeoTagsText || metadata.hashtags.join(' '));
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2500);
    } catch {
      // ignore
    }
  };

  const allTags = metadata.allSeoTags && metadata.allSeoTags.length > 0 ? metadata.allSeoTags : metadata.hashtags;

  return (
    <div className="bg-white border border-[#E2E0D8] rounded-3xl p-5 md:p-6 shadow-sm space-y-4 my-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E0D8]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#111827] font-serif">
              Auto-Generated YouTube Shorts Description & 100 Viral SEO Tags
            </h3>
            <p className="text-xs text-[#6B7280]">
              Ready to copy and paste directly into YouTube Studio, Shorts, or TikTok uploads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy100Tags}
            className={`px-3 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer ${
              copiedTags ? 'bg-emerald-600 text-white' : 'bg-[#111827] text-amber-400 border border-[#D97706]/30 hover:bg-slate-800'
            }`}
            title="Copy 100 viral SEO tags"
          >
            {copiedTags ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedTags ? '100 Tags Copied!' : '📋 Copy All 100 Tags'}</span>
          </button>

          <button
            onClick={handleCopyDesc}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
              copiedDesc ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {copiedDesc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDesc ? 'Copied Full Output!' : '📋 Copy Description + Tags'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Title */}
      <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E2E0D8] space-y-1">
        <span className="text-[10px] uppercase font-bold text-[#DC2626] tracking-wider block">
          📌 Suggested YouTube Video Title
        </span>
        <div className="text-xs md:text-sm font-bold text-[#111827] selection:bg-red-100">
          {metadata.title}
        </div>
      </div>

      {/* Description Box */}
      <div className="bg-[#111827] text-slate-100 rounded-2xl p-4 md:p-5 text-xs font-mono leading-relaxed space-y-4 selection:bg-red-500">
        <div>
          <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider block mb-1">
            📝 YouTube Description & Moral Takeaway
          </span>
          <p className="text-slate-200 whitespace-pre-wrap">{metadata.description}</p>
        </div>

        {/* Top 15 Highlighted Hashtags */}
        <div>
          <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-sky-400" /> Top SEO Hashtags (15 Highlighted):
          </span>
          <div className="flex flex-wrap gap-1 text-[#38BDF8] font-bold">
            {metadata.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable 100 Tags Library Panel */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="w-full flex items-center justify-between text-xs font-sans font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Library of 100 High-Ranking Viral SEO Tags ({allTags.length} Tags)</span>
            </span>
            {showAllTags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAllTags && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-sans">
                  Optimized for YouTube Shorts & TikTok Recommendation Algorithm
                </span>
                <button
                  onClick={handleCopy100Tags}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-bold hover:bg-amber-400 transition cursor-pointer"
                >
                  {copiedTags ? 'Copied All ✓' : 'Copy All 100 Tags'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1 font-mono text-[10px] text-slate-300 max-h-60 overflow-y-auto pr-1">
                {allTags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200/90 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
