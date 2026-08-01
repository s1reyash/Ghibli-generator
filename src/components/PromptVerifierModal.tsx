import React, { useState } from 'react';
import { verifyPrompt } from '../engine/verifierEngine';
import type { VerificationReport } from '../engine/verifierEngine';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, X, Copy, Check, Wand2 } from 'lucide-react';

interface PromptVerifierModalProps {
  initialPromptText?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyFixedPrompt?: (fixedText: string) => void;
}

export const PromptVerifierModal: React.FC<PromptVerifierModalProps> = ({
  initialPromptText = '',
  isOpen,
  onClose,
  onApplyFixedPrompt,
}) => {
  const [inputText, setInputText] = useState<string>(initialPromptText);
  const [report, setReport] = useState<VerificationReport>(verifyPrompt(initialPromptText));
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setInputText(text);
    setReport(verifyPrompt(text));
  };

  const handleApplyFixed = () => {
    const fixed = report.autoFixedPromptText;
    setInputText(fixed);
    setReport(verifyPrompt(fixed));
    if (onApplyFixedPrompt) {
      onApplyFixedPrompt(fixed);
    }
  };

  const handleCopyReportPrompt = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const scoreColor =
    report.overallScore >= 85
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : report.overallScore >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#FAF9F6] border border-[#E2E0D8] rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#3E5A47] text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A]">
              AI Prompt Verification & Quality Auditor
            </h2>
            <p className="text-xs md:text-sm text-[#5A5A5A]">
              Audits prompts for Ghibli style, 10s duration, ASMR soundscape, camera direction, and continuity.
            </p>
          </div>
        </div>

        {/* Score & Verdict Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${scoreColor}`}>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider opacity-80">AI Verification Score</div>
            <div className="text-3xl font-extrabold">{report.overallScore} / 100</div>
            <div className="text-xs font-semibold mt-0.5">
              Status: {report.status === 'PERFECT' ? '✨ Perfect Ghibli Continuity' : report.status === 'GOOD' ? '👍 Valid Prompt' : '⚠️ Rule Violations Found'}
            </div>
          </div>

          {report.overallScore < 100 && (
            <button
              onClick={handleApplyFixed}
              className="px-4 py-2.5 rounded-xl bg-[#3E5A47] text-white font-bold text-xs shadow hover:bg-[#32493A] transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>Auto-Fix & Enhance Prompt</span>
            </button>
          )}
        </div>

        {/* Text Input / Inspector Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Inspect & Edit Prompt Text:
            </label>
            <button
              onClick={handleCopyReportPrompt}
              className="text-xs text-[#3E5A47] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={e => handleTextChange(e.target.value)}
            rows={6}
            placeholder="Paste any Ghibli video prompt here to audit its compliance..."
            className="w-full p-4 rounded-2xl border border-[#E2E0D8] bg-white text-xs md:text-sm font-mono text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#3E5A47] leading-relaxed resize-y"
          />
        </div>

        {/* Verification Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            Detailed Rule Compliance Breakdown:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {report.checks.map(check => (
              <div
                key={check.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  check.passed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-[#1A1A1A]">{check.name}</div>
                  <div className="text-[11px] text-[#5A5A5A] mt-0.5">{check.feedback}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Suggestions */}
        {report.suggestions.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              AI Agent Recommended Improvements:
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              {report.suggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 border-t border-[#E2E0D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition cursor-pointer"
          >
            Close Auditor
          </button>
        </div>

      </div>
    </div>
  );
};
