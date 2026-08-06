export interface PresetItem {
  id: string;
  name: string;
  emoji: string;
  description?: string;
}

export interface UserSelections {
  character: string;
  customCharacter: string;
  animals: string[];
  customAnimal: string;
  objects: string[];
  customObject: string;
  place: string;
  customPlace: string;
  event?: string;
  customEvent?: string;
  mood: string;
  time: string;
  weather: string;
  cameraStyle?: string;
  lightingStyle?: string;
  sceneCount?: number; // 1 to 5 scenes
}

export interface StoryBible {
  title: string;
  conceptSummary: string;
  characterLock: {
    name: string;
    appearance: string;
    clothing: string;
    hairAndFace: string;
    age: string;
  };
  animalLock: {
    species: string;
    appearance: string;
    behavior: string;
  };
  environmentLock: {
    name: string;
    details: string;
    palette: string;
    lighting: string;
    weather: string;
    timeOfDay: string;
  };
  objectLock: {
    names: string[];
    details: string;
  };
  eventLock?: {
    name: string;
    details: string;
  };
  asmrAudioProfile: {
    foleyDetails: string[];
    ambientSoundscape: string;
  };
}

export interface ScenePrompt {
  sceneNumber: number;
  title: string;
  subtitle: string;
  duration: '10 seconds';
  aspectRatio: '9:16 vertical format';
  sceneDescription: string;
  characterAction: string;
  cameraDirection: string;
  lightingAndAtmosphere: string;
  animationStyle: string;
  asmrSoundscape: string;
  continuityAnchor: string;
  motionLockVector: string; // Zero-Jerk Motion Continuity Lock
  fullPromptText: string;
}

export interface YouTubeMetadata {
  title: string;
  description: string;
  timestamps: { time: string; label: string }[];
  hashtags: string[];
  fullCopyText: string;
}

export interface GenerationResult {
  id: string;
  timestamp: number;
  selections: UserSelections;
  bible: StoryBible;
  scenes: ScenePrompt[];
  scene1: ScenePrompt;
  scene2: ScenePrompt;
  scene3: ScenePrompt;
  negativePrompt: string;
  youtubeMetadata: YouTubeMetadata;
}
