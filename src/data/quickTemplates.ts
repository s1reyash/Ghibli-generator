import type { UserSelections } from '../types/generator';

export interface QuickTemplate {
  id: string;
  title: string;
  emoji: string;
  description: string;
  selections: UserSelections;
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'rainy-cottage-tea',
    title: 'Rainy Tea Cottage',
    emoji: '🍵',
    description: 'Girl & Orange Cat in a cozy stone cottage during afternoon rain.',
    selections: {
      character: 'Girl',
      customCharacter: '',
      animals: ['Cat'],
      customAnimal: '',
      objects: ['Teapot'],
      customObject: '',
      place: 'Small Cottage',
      customPlace: '',
      mood: 'Cozy',
      time: 'Afternoon',
      weather: 'Light Rain',
    },
  },
  {
    id: 'enchanted-forest-lantern',
    title: 'Forest & Lantern',
    emoji: '🏮',
    description: 'Explorer & Fawn discovering glowing fireflies in ancient woods.',
    selections: {
      character: 'Forest Explorer',
      customCharacter: '',
      animals: ['Deer'],
      customAnimal: '',
      objects: ['Lantern'],
      customObject: '',
      place: 'Enchanted Forest',
      customPlace: '',
      mood: 'Magical',
      time: 'Golden Hour',
      weather: 'Clear',
    },
  },
  {
    id: 'little-witch-broom',
    title: "Little Witch's Flight",
    emoji: '🧹',
    description: 'Little Witch & Black Cat taking a peaceful sunset flight.',
    selections: {
      character: 'Little Witch',
      customCharacter: '',
      animals: ['Cat'],
      customAnimal: '',
      objects: ['Music Box'],
      customObject: '',
      place: 'Hilltop',
      customPlace: '',
      mood: 'Dreamy',
      time: 'Sunset',
      weather: 'Clear',
    },
  },
  {
    id: 'snowy-mountain-cabin',
    title: 'Snowy Mountain Cabin',
    emoji: '🏔️',
    description: 'Traveler & Shiba Inu resting beside a chimney fire in snow.',
    selections: {
      character: 'Traveler',
      customCharacter: '',
      animals: ['Dog'],
      customAnimal: '',
      objects: ['Book'],
      customObject: '',
      place: 'Mountain',
      customPlace: '',
      mood: 'Nostalgic',
      time: 'Evening',
      weather: 'Snow',
    },
  },
  {
    id: 'riverside-village-boat',
    title: 'Riverside Boat Drift',
    emoji: '⛵',
    description: 'Boy & White Fox drifting along a bamboo riverside in early morning.',
    selections: {
      character: 'Boy',
      customCharacter: '',
      animals: ['Fox'],
      customAnimal: '',
      objects: ['Small Boat'],
      customObject: '',
      place: 'Riverside Village',
      customPlace: '',
      mood: 'Peaceful',
      time: 'Morning',
      weather: 'Foggy',
    },
  },
];
