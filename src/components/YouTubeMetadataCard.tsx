import React, { useState } from 'react';
import type { YouTubeMetadata } from '../types/generator';
import { Video, Copy, Check, Hash, Clock } from 'lucide-react';

interface YouTubeMetadataCardProps {
  metadata: YouTubeMetadata;
}

export const YouTubeMetadataCard: React.FC<YouTubeMetadataCardProps> = ({ metadata }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(metadata.fullCopyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

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
              Auto-Generated YouTube Shorts Description & SEO
            </h3>
            <p className="text-xs text-[#6B7280]">
              Ready to copy and paste directly into YouTube Studio or TikTok upload.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
            copied ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'YouTube Description Copied!' : '📋 Copy Description'}</span>
        </button>
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

      {/* Description & Timestamps Box */}
      <div className="bg-[#111827] text-slate-100 rounded-2xl p-4 md:p-5 text-xs font-mono leading-relaxed space-y-3 selection:bg-red-500">
        <div>
          <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider block mb-1">
            📝 YouTube Description
          </span>
          <p className="text-slate-200">{metadata.description}</p>
        </div>

        {/* Timestamps */}
        <div>
          <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider block mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chapter Timestamps
          </span>
          <div className="space-y-0.5 text-slate-300">
            {metadata.timestamps.map((t, idx) => (
              <div key={idx}>
                <span className="text-amber-300 font-bold">{t.time}</span> — {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider block mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3" /> SEO Hashtags
          </span>
          <div className="flex flex-wrap gap-1.5 text-[#38BDF8] font-bold">
            {metadata.hashtags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
