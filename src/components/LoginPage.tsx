import React, { useState } from 'react';
import { KeyRound, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('Studio Director');
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.trim() === '') {
      setErrorMsg('Please enter a passcode or click Guest Access below.');
      return;
    }

    // Accept passcode 'ghibli2026' or 'aditya' or any non-empty key
    const finalName = username.trim() || 'Studio Director';
    localStorage.setItem('ghibli_auth_session', JSON.stringify({ username: finalName, timestamp: Date.now() }));
    onLoginSuccess(finalName);
  };

  const handleGuestLogin = () => {
    const finalName = 'Guest Director';
    localStorage.setItem('ghibli_auth_session', JSON.stringify({ username: finalName, timestamp: Date.now() }));
    onLoginSuccess(finalName);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient Decorative Glowing Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Security Gateway Card */}
      <div className="bg-white border border-[#E2E0D8] rounded-3xl p-7 md:p-10 max-w-md w-full shadow-xl relative z-10 space-y-6">

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111827] text-white text-xs font-bold tracking-wider shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>AUTHENTICATED STUDIO WORKBENCH</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111827] tracking-tight pt-1">
            Ghibli Workbench Gate
          </h1>
          <p className="text-xs text-[#6B7280]">
            Sign in to access your Studio Ghibli 9:16 Video Storyboard Workbench.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handlePasscodeSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
              Director Name / Handle
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. Aditya"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
              Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter passcode (e.g. ghibli2026)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs font-semibold text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#111827] text-white font-bold text-xs shadow-md hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Unlock Studio Workbench</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E2E0D8] w-full" />
          <span className="bg-white px-3 text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-wider absolute">
            or
          </span>
        </div>

        {/* Guest Access Button */}
        <button
          onClick={handleGuestLogin}
          type="button"
          className="w-full py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2E0D8] text-[#111827] font-semibold text-xs hover:bg-[#EAE8E0] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-[#15803D]" />
          <span>Enter as Guest Director</span>
        </button>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-[#9CA3AF]">
          🔒 Secured Studio Session • 9:16 Vertical Video Engine
        </div>

      </div>
    </div>
  );
};
