import React, { useState } from 'react';
import type { UserSelections } from '../types/generator';
import { CHARACTERS, ANIMALS, OBJECTS, PLACES, EVENTS, MOODS, TIMES, WEATHER } from '../data/presets';
import { QUICK_TEMPLATES } from '../data/quickTemplates';
import type { QuickTemplate } from '../data/quickTemplates';
import { CameraLightingMatrix } from './CameraLightingMatrix';
import { User, Feather, Package, MapPin, Sparkles, Sun, Check, Wand2, Sliders, Calendar, Film } from 'lucide-react';

interface CategorySelectorProps {
  selections: UserSelections;
  onChange: (updated: Partial<UserSelections>) => void;
  onSelectTemplate: (template: QuickTemplate) => void;
}

type TabType = 'character' | 'animal' | 'object' | 'place' | 'event' | 'matrix' | 'mood' | 'environment';

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selections,
  onChange,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('character');

  const toggleArrayItem = (field: 'animals' | 'objects', value: string) => {
    const current = selections[field];
    if (current.includes(value)) {
      onChange({ [field]: current.filter(item => item !== value) });
    } else {
      onChange({ [field]: [...current, value] });
    }
  };

  const currentCount = selections.sceneCount || 3;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 my-4">

      {/* Dynamic Prompt Count Selector (1 to 5 Scenes) & Quick Recipes */}
      <div className="bg-white border border-[#E2E0D8] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Number of Prompts Pill Selector */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Film className="w-4 h-4 text-[#15803D]" />
            <span>Number of Sequential Prompts:</span>
          </div>
          <div className="inline-flex items-center gap-1 bg-[#F2F0E8] p-1 rounded-xl border border-[#E2E0D8]">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => onChange({ sceneCount: num })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentCount === num
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#4B5563] hover:bg-[#EAE8E0]'
                }`}
              >
                {num} {num === 1 ? 'Scene (10s)' : 'Scenes'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Recipes */}
        <div className="space-y-1 w-full md:w-auto">
          <div className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick 1-Click Story Recipes:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_TEMPLATES.slice(0, 4).map(tpl => (
              <button
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E0D8] bg-[#FAF9F6] text-[11px] font-semibold text-[#111827] hover:bg-[#111827] hover:text-white transition cursor-pointer"
              >
                <span>{tpl.emoji}</span>
                <span>{tpl.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs & Selector Card */}
      <div className="bg-white rounded-3xl border border-[#E2E0D8] p-5 md:p-6 shadow-sm">

        {/* Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-1 bg-[#F2F0E8] rounded-2xl mb-5 border border-[#E2E0D8]">
          <button
            onClick={() => setActiveTab('character')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'character'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Character</span>
          </button>

          <button
            onClick={() => setActiveTab('animal')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'animal'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Animal ({selections.animals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('object')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'object'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Object ({selections.objects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('place')}
            className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'place'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Place</span>
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === 'event'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#15803D] hover:bg-[#15803D]/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Scenarios</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#DC2626] text-white shadow-xs'
                : 'text-[#DC2626] hover:bg-[#DC2626]/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Camera & Light</span>
          </button>

          <button
            onClick={() => setActiveTab('mood')}
            className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'mood'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mood</span>
          </button>

          <button
            onClick={() => setActiveTab('environment')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs md:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'environment'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Time & Weather</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'character' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111827]">Select Protagonist Character:</span>
              <span className="text-[#6B7280]">Select one</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {CHARACTERS.map(item => {
                const isSelected = selections.character === item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ character: item.name })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE8E0] border-[#111827] font-bold text-[#111827]'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#111827]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[#E2E0D8]">
              <input
                type="text"
                value={selections.customCharacter}
                onChange={e => onChange({ customCharacter: e.target.value, character: '' })}
                placeholder="Or enter custom character (e.g. Elderly gardener in apron)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
        )}

        {activeTab === 'animal' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111827]">Select Animal Companion(s):</span>
              <span className="text-[#6B7280]">Multi-select enabled</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {ANIMALS.map(item => {
                const isSelected = selections.animals.includes(item.name);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleArrayItem('animals', item.name)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE8E0] border-[#111827] font-bold text-[#111827]'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#111827]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[#E2E0D8]">
              <input
                type="text"
                value={selections.customAnimal}
                onChange={e => onChange({ customAnimal: e.target.value })}
                placeholder="Or enter custom animal (e.g. Tiny white fox with golden ears)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
        )}

        {activeTab === 'object' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111827]">Select Key Object(s) / Props:</span>
              <span className="text-[#6B7280]">Multi-select enabled</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {OBJECTS.map(item => {
                const isSelected = selections.objects.includes(item.name);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleArrayItem('objects', item.name)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE8E0] border-[#111827] font-bold text-[#111827]'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#111827]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[#E2E0D8]">
              <input
                type="text"
                value={selections.customObject}
                onChange={e => onChange({ customObject: e.target.value })}
                placeholder="Or enter custom object (e.g. Vintage wooden music box)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
        )}

        {activeTab === 'place' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111827]">Select Background Environment / Place:</span>
              <span className="text-[#6B7280]">Select primary place</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {PLACES.map(item => {
                const isSelected = selections.place === item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ place: item.name })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE8E0] border-[#111827] font-bold text-[#111827]'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#111827]" />}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[#E2E0D8]">
              <input
                type="text"
                value={selections.customPlace}
                onChange={e => onChange({ customPlace: e.target.value, place: '' })}
                placeholder="Or enter custom place (e.g. Quiet mountain cottage in snow)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
        )}

        {activeTab === 'event' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111827]">Select Event / Scenario Context:</span>
              <span className="text-[#6B7280]">Adds narrative setting (e.g. Road Trip, College)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {EVENTS.map(item => {
                const isSelected = selections.event === item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ event: isSelected ? '' : item.name })}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#15803D] text-white border-[#15803D] font-bold shadow-xs'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#15803D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.emoji} {item.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[10px] opacity-80 mt-1">{item.description}</div>
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-[#E2E0D8]">
              <input
                type="text"
                value={selections.customEvent || ''}
                onChange={e => onChange({ customEvent: e.target.value, event: '' })}
                placeholder="Or enter custom event (e.g. Midnight train ride, College graduation day)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E0D8] bg-[#FAF9F6] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="animate-fade-in">
            <CameraLightingMatrix
              cameraStyle={selections.cameraStyle || ''}
              lightingStyle={selections.lightingStyle || ''}
              onChangeCamera={cam => onChange({ cameraStyle: cam })}
              onChangeLighting={light => onChange({ lightingStyle: light })}
            />
          </div>
        )}

        {activeTab === 'mood' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-xs font-bold text-[#111827]">Atmospheric Mood:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {MOODS.map(item => {
                const isSelected = selections.mood === item.name;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ mood: item.name })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE8E0] border-[#111827] font-bold text-[#111827]'
                        : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-[#111827]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div>
              <div className="font-bold text-[#111827] mb-2">Time of Day:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {TIMES.map(item => {
                  const isSelected = selections.time === item.name;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange({ time: isSelected ? '' : item.name })}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#111827] text-white border-[#111827] font-bold'
                          : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151]'
                      }`}
                    >
                      {item.emoji} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#111827] mb-2">Weather Conditions:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                {WEATHER.map(item => {
                  const isSelected = selections.weather === item.name;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange({ weather: isSelected ? '' : item.name })}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#111827] text-white border-[#111827] font-bold'
                          : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151]'
                      }`}
                    >
                      {item.emoji} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* World Ingredients Pill Summary */}
        <div className="mt-4 pt-3 border-t border-[#E2E0D8] flex flex-wrap items-center gap-1.5 text-xs text-[#4B5563]">
          <span className="font-bold text-[#111827]">Storyboard Settings:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F0E8] border border-[#E2E0D8] text-[#111827] font-bold">
            🎬 {currentCount} {currentCount === 1 ? 'Scene' : 'Scenes'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F0E8] border border-[#E2E0D8] text-[#111827]">
            👤 {selections.customCharacter || selections.character || 'Girl'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F0E8] border border-[#E2E0D8] text-[#111827]">
            🐾 {selections.customAnimal || (selections.animals.length > 0 ? selections.animals.join(', ') : 'Cat')}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F0E8] border border-[#E2E0D8] text-[#111827]">
            📦 {selections.customObject || (selections.objects.length > 0 ? selections.objects.join(', ') : 'Lantern')}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F0E8] border border-[#E2E0D8] text-[#111827]">
            🌲 {selections.customPlace || selections.place || 'Enchanted Forest'}
          </span>
          {(selections.event || selections.customEvent) && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold">
              🚗 Event: {selections.customEvent || selections.event}
            </span>
          )}
          {selections.cameraStyle && (
            <span className="px-2 py-0.5 rounded-md bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] font-semibold">
              🎥 {selections.cameraStyle}
            </span>
          )}
          {selections.lightingStyle && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-semibold">
              ☀️ {selections.lightingStyle}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
