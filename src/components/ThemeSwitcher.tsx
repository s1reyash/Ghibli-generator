import React from 'react';
import { Palette } from 'lucide-react';

export type ThemeMode = 'paper' | 'twilight' | 'cherry';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-white/80 border border-[#E2E0D8] rounded-xl text-xs shadow-xs">
      <div className="px-2 font-bold text-[#5A5A5A] flex items-center gap-1">
        <Palette className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">Theme:</span>
      </div>

      <button
        onClick={() => onSelectTheme('paper')}
        className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
          currentTheme === 'paper'
            ? 'bg-[#3E5A47] text-white shadow-xs'
            : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'
        }`}
        title="Minimalist Japanese Paper Theme"
      >
        📄 Paper
      </button>

      <button
        onClick={() => onSelectTheme('twilight')}
        className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
          currentTheme === 'twilight'
            ? 'bg-[#D97706] text-white shadow-xs'
            : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'
        }`}
        title="Ghibli Night Twilight Dark Mode"
      >
        🌙 Twilight
      </button>

      <button
        onClick={() => onSelectTheme('cherry')}
        className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
          currentTheme === 'cherry'
            ? 'bg-[#DB2777] text-white shadow-xs'
            : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#FAF9F6]'
        }`}
        title="Sakura Cherry Blossom Spring Theme"
      >
        🌸 Sakura
      </button>
    </div>
  );
};
