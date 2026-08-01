import React from 'react';
import { Camera, SunMedium, Check } from 'lucide-react';

interface CameraLightingMatrixProps {
  cameraStyle: string;
  lightingStyle: string;
  onChangeCamera: (camera: string) => void;
  onChangeLighting: (lighting: string) => void;
}

export const CAMERA_SHOTS = [
  { id: 'low-dolly', name: 'Low-Angle Dolly Track', emoji: '🎥', description: 'Low perspective ground tracking shot' },
  { id: 'macro-close', name: 'Macro Detail Close-Up', emoji: '🔍', description: 'Intimate focal detail on object/character' },
  { id: 'wide-crane', name: 'Wide Cinematic Crane', emoji: '🏔️', description: 'Sweeping panoramic wide view' },
  { id: 'orbit-pan', name: 'Gentle Circular Orbit', emoji: '🔄', description: 'Slow 360-degree rotational movement' },
];

export const LIGHTING_STYLES = [
  { id: 'volumetric-sun', name: 'Volumetric Sunbeams', emoji: '☀️', description: 'Dappled light rays filtering through foliage' },
  { id: 'golden-bloom', name: 'Golden Hour Bloom', emoji: '🌄', description: 'Warm amber sunset glow with soft lens bloom' },
  { id: 'bioluminescent', name: 'Bioluminescent Spores', emoji: '✨', description: 'Glowing magical spore particles' },
  { id: 'twilight-mist', name: 'Dewy Twilight Mist', emoji: '🌫️', description: 'Cool evening fog reflecting lantern light' },
];

export const CameraLightingMatrix: React.FC<CameraLightingMatrixProps> = ({
  cameraStyle,
  lightingStyle,
  onChangeCamera,
  onChangeLighting,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E2E0D8] p-5 md:p-6 shadow-sm space-y-4 my-4">
      <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-[11px] font-bold uppercase tracking-wider">
            絵コンテ Matrix
          </span>
          <h3 className="text-sm font-bold text-[#111827] font-serif">
            Director's Camera & Lighting Matrix
          </h3>
        </div>
        <span className="text-xs text-[#6B7280]">Fine-tune prompt direction</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Camera Movements */}
        <div>
          <label className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Camera Shot Technique:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAMERA_SHOTS.map(c => {
              const isSelected = cameraStyle === c.name;
              return (
                <button
                  key={c.id}
                  onClick={() => onChangeCamera(isSelected ? '' : c.name)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827] font-bold shadow-xs'
                      : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#111827]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{c.emoji} {c.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">{c.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lighting Schemes */}
        <div>
          <label className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-amber-500" />
            <span>Atmospheric Lighting Scheme:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LIGHTING_STYLES.map(l => {
              const isSelected = lightingStyle === l.name;
              return (
                <button
                  key={l.id}
                  onClick={() => onChangeLighting(isSelected ? '' : l.name)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827] font-bold shadow-xs'
                      : 'bg-[#FAF9F6] border-[#E2E0D8] text-[#374151] hover:border-[#111827]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{l.emoji} {l.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">{l.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
