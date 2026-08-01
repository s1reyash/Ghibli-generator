import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { UserSelections, GenerationResult } from './types/generator';
import type { QuickTemplate } from './data/quickTemplates';
import type { ThemeMode } from './components/ThemeSwitcher';
import { generateStory, generateSurpriseSelections } from './engine/storyEngine';
import { DualAtmosphereBackground } from './components/DualAtmosphereBackground';
import { Header } from './components/Header';
import { CategorySelector } from './components/CategorySelector';
import { GenerateControls } from './components/GenerateControls';
import { PromptOutput } from './components/PromptOutput';
import { PromptVerifierModal } from './components/PromptVerifierModal';
import { DirectorsVault } from './components/DirectorsVault';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Theme State with localStorage memory
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ghibli_theme');
    return (saved as ThemeMode) || 'paper';
  });

  const [selections, setSelections] = useState<UserSelections>({
    character: 'Girl',
    customCharacter: '',
    animals: ['Cat'],
    customAnimal: '',
    objects: ['Lantern'],
    customObject: '',
    place: 'Enchanted Forest',
    customPlace: '',
    mood: 'Peaceful',
    time: '',
    weather: '',
    cameraStyle: '',
    lightingStyle: '',
  });

  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Verifier & Vault Modals State
  const [verifierOpen, setVerifierOpen] = useState<boolean>(false);
  const [verifierPromptText, setVerifierPromptText] = useState<string>('');
  const [vaultOpen, setVaultOpen] = useState<boolean>(false);

  const outputRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('ghibli_theme', newTheme);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#3E5A47', '#D97706', '#38BDF8'],
      });
    } catch {
      // ignore
    }
  };

  const handleUpdateSelections = (updated: Partial<UserSelections>) => {
    setSelections(prev => ({ ...prev, ...updated }));
  };

  const handleSelectTemplate = (template: QuickTemplate) => {
    setSelections(template.selections);
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateStory(template.selections);
      setResult(generated);
      setIsGenerating(false);
      triggerConfetti();

      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 300);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateStory(selections);
      setResult(generated);
      setIsGenerating(false);
      triggerConfetti();

      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 300);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  // 15-Billion+ Combination "Surprise Me" Trigger
  const handleSurpriseMe = () => {
    const surpriseSelections = generateSurpriseSelections();
    setSelections(surpriseSelections);
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateStory(surpriseSelections);
      setResult(generated);
      setIsGenerating(false);
      triggerConfetti();

      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 300);
  };

  const handleOpenVerifierForText = (text: string) => {
    setVerifierPromptText(text);
    setVerifierOpen(true);
  };

  const handleOpenGeneralVerifier = () => {
    const textToVerify = result ? result.scene1.fullPromptText : '';
    setVerifierPromptText(textToVerify);
    setVerifierOpen(true);
  };

  const handleSelectSavedResult = (savedResult: GenerationResult) => {
    setResult(savedResult);
    setSelections(savedResult.selections);
    setVaultOpen(false);
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className={`theme-${theme} min-h-screen relative flex flex-col justify-between selection:bg-[#111827] selection:text-white transition-colors duration-300`}>
      {/* Dual Atmosphere Particle & Cursor Trail Background */}
      <DualAtmosphereBackground />

      <main className="relative z-10 container mx-auto px-4 pb-16">
        {/* Header */}
        <Header
          onOpenVerifier={handleOpenGeneralVerifier}
          onOpenVault={() => setVaultOpen(true)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />

        {/* Input Selectors & Quick 1-Click Templates */}
        <CategorySelector
          selections={selections}
          onChange={handleUpdateSelections}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Generate Controls */}
        <GenerateControls
          onGenerate={handleGenerate}
          onRegenerate={handleRegenerate}
          onSurpriseMe={handleSurpriseMe}
          hasResult={!!result}
          isGenerating={isGenerating}
        />

        {/* Generated Output Display */}
        <div ref={outputRef}>
          {result && (
            <PromptOutput
              result={result}
              onOpenVerifierForText={handleOpenVerifierForText}
            />
          )}
        </div>
      </main>

      {/* AI Prompt Verifier Agent Modal */}
      <PromptVerifierModal
        isOpen={verifierOpen}
        onClose={() => setVerifierOpen(false)}
        initialPromptText={verifierPromptText}
      />

      {/* Director's Vault Modal */}
      <DirectorsVault
        isOpen={vaultOpen}
        onClose={() => setVaultOpen(false)}
        onSelectSavedResult={handleSelectSavedResult}
      />

      {/* Signature Made by Aditya Footer */}
      <Footer />
    </div>
  );
};

export default App;
