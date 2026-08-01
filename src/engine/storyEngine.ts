import type { UserSelections, GenerationResult, StoryBible, ScenePrompt } from '../types/generator';
import { DEFAULT_NEGATIVE_PROMPT, CHARACTERS, ANIMALS, OBJECTS, PLACES, MOODS, TIMES, WEATHER } from '../data/presets';
import { CAMERA_SHOTS, LIGHTING_STYLES } from '../components/CameraLightingMatrix';

// Helper to pick random element
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to format names nicely
const resolveName = (selected: string, custom: string, defaultFallback: string): string => {
  if (custom && custom.trim().length > 0) return custom.trim();
  if (selected) {
    const found = [...CHARACTERS, ...ANIMALS, ...OBJECTS, ...PLACES, ...MOODS, ...TIMES, ...WEATHER].find(p => p.id === selected);
    if (found) return found.name;
    return selected;
  }
  return defaultFallback;
};

// Expanded Procedural Character Traits
const CHARACTER_DESCRIPTIONS: Record<string, { clothing: string; hairAndFace: string; age: string }> = {
  'Girl': { clothing: 'a simple moss-green linen frock with a white apron and comfortable leather boots', hairAndFace: 'short dark brown hair with soft bangs and wide, expressive amber-brown eyes', age: '10 years old' },
  'Boy': { clothing: 'a rolled-sleeve cream shirt, navy trousers with suspenders, and worn brown shoes', hairAndFace: 'tousled dark hair with a curious grin and bright rosy cheeks', age: '11 years old' },
  'Child': { clothing: 'an oversized mustard-yellow knitted sweater and denim dungarees', hairAndFace: 'fluffy auburn hair and round innocent eyes', age: '7 years old' },
  'Young Woman': { clothing: 'a flowing indigo cotton dress with a woven straw sunhat', hairAndFace: 'long braided dark hair with gentle, contemplative features', age: '22 years old' },
  'Young Man': { clothing: 'a high-collared traveler coat over a beige linen shirt', hairAndFace: 'wind-blown brown hair and warm observant eyes', age: '24 years old' },
  'Little Witch': { clothing: 'a dark navy witch tunic with a oversized crimson ribbon tied in her hair', hairAndFace: 'spirited black bob cut and energetic wide eyes', age: '13 years old' },
  'Forest Explorer': { clothing: 'a khaki utility vest with brass buttons, cargo shorts, and sturdy hiking boots', hairAndFace: 'messy chestnut hair tucked under a canvas cap', age: '12 years old' },
  'Gardener': { clothing: 'a faded navy blue denim apron with wooden seed pegs in the front pocket', hairAndFace: 'kind crinkled eyes under a floppy woven straw hat', age: '55 years old' },
  'Baker': { clothing: 'a flour-dusted white apron over a burgundy long-sleeve shirt', hairAndFace: 'friendly round face with warm smile lines', age: '35 years old' },
  'Artist': { clothing: 'a paint-speckled smock dress and soft beret', hairAndFace: 'creative eyes framed by wispy brown curls', age: '19 years old' },
  'Student': { clothing: 'a vintage pleated school uniform jacket with brass buttons', hairAndFace: 'neatly parted black hair and thoughtful eyes', age: '15 years old' },
  'Traveler': { clothing: 'a weathered canvas cloak over a travel suit with leather buckles', hairAndFace: 'determined gaze and sun-kissed skin', age: '26 years old' },
};

const ANIMAL_DESCRIPTIONS: Record<string, { appearance: string; behavior: string }> = {
  'Cat': { appearance: 'a plush orange tabby cat with a creamy white chest and intelligent green eyes', behavior: 'moves with quiet grace, occasionally twitching its ears at woodland sounds' },
  'Dog': { appearance: 'a loyal fluffy Shiba Inu with honey-gold fur and a curling tail', behavior: 'sniffs the air playfully and trots with gentle enthusiasm' },
  'Rabbit': { appearance: 'a soft snow-white rabbit with long velvety ears and pink nose', behavior: 'twitches its nose curiously while pausing among clover blossoms' },
  'Fox': { appearance: 'a slender rust-red fox with a bushy white-tipped tail and sharp black paws', behavior: 'steps lightly through shadows with an inquisitive head tilt' },
  'Deer': { appearance: 'a gentle fawn with delicate white spots along its coat and large liquid eyes', behavior: 'steps carefully over mossy roots, pausing to graze quietly' },
  'Squirrel': { appearance: 'a nimble chestnut squirrel with a voluminous curved tail', behavior: 'holds a small acorn tightly while perching on a mossy branch' },
  'Owl': { appearance: 'a wise barn owl with heart-shaped white face feathers and speckled amber wings', behavior: 'turns its head slowly, blinking with calm solemnity' },
  'Red Panda': { appearance: 'a cuddly reddish-brown panda with white facial markings and ringed fluffy tail', behavior: 'waddles comfortably over fallen logs with playful curiosity' },
};

const OBJECT_DESCRIPTIONS: Record<string, string> = {
  'Lantern': 'a brass hand-forged lantern emitting a warm, flickering golden glow through stained glass panes',
  'Umbrella': 'a traditional oil-paper umbrella painted with subtle botanical water-leaf patterns',
  'Book': 'an antique leather-bound journal tied with a silk ribbon and filled with hand-drawn botanical sketches',
  'Bicycle': 'a vintage mint-green bicycle with a woven wicker basket filled with fresh wildflowers',
  'Teapot': 'a hand-thrown ceramic teapot exhaling thin, fragrant wisps of steam from its spout',
  'Music Box': 'an ornate wooden music box with carved vine motifs and a tiny rotating brass key',
  'Flower Basket': 'a hand-woven reed basket brimming with pastel cosmos flowers and dew-covered leaves',
  'Magic Key': 'an antique tarnished key adorned with delicate wing-shaped key-head engravings',
  'Backpack': 'a rugged canvas rucksack with leather straps and a silver compass dangling from the side',
};

const ENVIRONMENT_DESCRIPTIONS: Record<string, { details: string; palette: string }> = {
  'Enchanted Forest': {
    details: 'towering ancient cedar trees carpeted in lush velvet moss, dappled sunlight filtering through canopy, wild clover, and floating golden spores',
    palette: 'rich moss green, deep emerald, warm sun-gold, and soft woodland earth tones'
  },
  'Japanese Village': {
    details: 'quaint wooden machiya houses with dark tiled roofs, stone lantern pathways, blooming cherry blossoms, and clear mountain stream channels',
    palette: 'warm cedar wood, slate gray, soft cherry blossom pink, and mossy stone green'
  },
  'Small Cottage': {
    details: 'a cozy stone-walled cottage with a thatched roof, climbing ivy, flowering window boxes, and a rustic stone chimney puffing light smoke',
    palette: 'warm terracotta, creamy white stone, ivy green, and sunset orange'
  },
  'Bamboo Forest': {
    details: 'tall jade-green bamboo stalks swaying gently in the breeze, smooth river pebbles beneath, and soft misty light filtering down',
    palette: 'jade green, mist gray, bamboo cream, and soft golden light'
  },
  'Rainy Street': {
    details: 'glistening cobblestone alleyway reflecting paper lantern lights, rain dripping from wooden eaves, and lush potted ferns beside doorway steps',
    palette: 'dewy cobalt blue, reflection gold, wet slate gray, and moss green'
  },
  'Flower Garden': {
    details: 'sprawling terrace garden filled with blooming hydrangeas, lavender, sunflowers, and fluttering swallowtail butterflies',
    palette: 'vibrant lavender purple, sunflower yellow, sky blue, and fresh grass green'
  },
};

// Procedural Story Generator — Over 15 Billion Unique Combinations Logic
export const generateSurpriseSelections = (): UserSelections => {
  const randomChar = pick(CHARACTERS).name;
  const randomAnim = [pick(ANIMALS).name];
  const randomObj = [pick(OBJECTS).name];
  const randomPlace = pick(PLACES).name;
  const randomMood = pick(MOODS).name;
  const randomTime = pick(TIMES).name;
  const randomWeather = pick(WEATHER).name;
  const randomCam = pick(CAMERA_SHOTS).name;
  const randomLight = pick(LIGHTING_STYLES).name;

  return {
    character: randomChar,
    customCharacter: '',
    animals: randomAnim,
    customAnimal: '',
    objects: randomObj,
    customObject: '',
    place: randomPlace,
    customPlace: '',
    mood: randomMood,
    time: randomTime,
    weather: randomWeather,
    cameraStyle: randomCam,
    lightingStyle: randomLight,
  };
};

export const generateStory = (selections: UserSelections): GenerationResult => {
  const charName = resolveName(selections.character, selections.customCharacter, 'Girl');
  const animNames = selections.animals.length > 0 
    ? selections.animals.map(a => resolveName(a, '', a)).join(' and ') 
    : (selections.customAnimal ? selections.customAnimal : 'Cat');
  const primaryAnimal = selections.animals[0] ? resolveName(selections.animals[0], '', selections.animals[0]) : (selections.customAnimal || 'Cat');
  
  const objNames = selections.objects.length > 0 
    ? selections.objects.map(o => resolveName(o, '', o)).join(' and ') 
    : (selections.customObject ? selections.customObject : 'Lantern');
  const primaryObj = selections.objects[0] ? resolveName(selections.objects[0], '', selections.objects[0]) : (selections.customObject || 'Lantern');

  const placeName = resolveName(selections.place, selections.customPlace, 'Enchanted Forest');
  const moodName = selections.mood || 'Peaceful';

  const timeName = selections.time || pick(['Golden Hour', 'Late Afternoon', 'Early Morning', 'Sunset', 'Twilight']);
  const weatherName = selections.weather || pick(['Clear with gentle breeze', 'Light mist', 'Soft sunlight', 'Light rain']);

  const chosenCamera = selections.cameraStyle || 'Slow tracking shot transitioning to a gentle dolly-in';
  const chosenLighting = selections.lightingStyle || `${timeName} lighting with soft glowing highlights and painterly volumetric sunbeams`;

  const charLockData = CHARACTER_DESCRIPTIONS[charName] || {
    clothing: `a custom Ghibli-style outfit tailored for ${charName.toLowerCase()} with hand-stitched linen and soft natural dyes`,
    hairAndFace: `expressive eyes and distinct hand-drawn features matching ${charName}`,
    age: 'young protagonist'
  };

  const animLockData = ANIMAL_DESCRIPTIONS[primaryAnimal] || {
    appearance: `a whimsical ${primaryAnimal.toLowerCase()} with soft textured fur and expressive gentle eyes`,
    behavior: `curious and friendly, moving naturally with the scene`
  };

  const objDesc = OBJECT_DESCRIPTIONS[primaryObj] || `a beautifully crafted ${primaryObj.toLowerCase()} with rich hand-painted detail`;

  const envLockData = ENVIRONMENT_DESCRIPTIONS[placeName] || {
    details: `a serene, hand-painted ${placeName.toLowerCase()} with lush natural flora, gentle atmospheric depth, and cinematic perspective`,
    palette: `natural earthy green, sky blue, warm sunlight highlights, and soft shadow tones`
  };

  const titleTemplates = [
    `The ${primaryObj} in the ${placeName}`,
    `Whispers of the ${placeName}`,
    `The ${charName} and the ${primaryAnimal}`,
    `A ${moodName} Day in ${placeName}`,
    `The Secrets of the ${primaryObj}`,
  ];
  const storyTitle = pick(titleTemplates);

  const conceptSummary = `In a ${moodName.toLowerCase()} ${placeName.toLowerCase()} during ${timeName.toLowerCase()}, a ${charName.toLowerCase()} carrying a ${primaryObj.toLowerCase()} encounters a ${primaryAnimal.toLowerCase()}, forming a quiet bond through a magical 3-part 9:16 vertical journey.`;

  const bible: StoryBible = {
    title: storyTitle,
    conceptSummary,
    characterLock: {
      name: charName,
      appearance: `${charName}, ${charLockData.age}, with ${charLockData.hairAndFace}`,
      clothing: charLockData.clothing,
      hairAndFace: charLockData.hairAndFace,
      age: charLockData.age,
    },
    animalLock: {
      species: animNames,
      appearance: animLockData.appearance,
      behavior: animLockData.behavior,
    },
    environmentLock: {
      name: placeName,
      details: envLockData.details,
      palette: envLockData.palette,
      lighting: chosenLighting,
      weather: weatherName,
      timeOfDay: timeName,
    },
    objectLock: {
      names: [objNames],
      details: objDesc,
    },
    asmrAudioProfile: {
      foleyDetails: [
        'Subtle cloth rustle of linen garment',
        `Soft footsteps pressing into ${placeName.includes('Forest') ? 'moss and fallen leaves' : 'cobblestone and grass'}`,
        `Quiet breathing and soft paws of ${primaryAnimal}`,
        'Gentle breeze shaking tree leaves',
        'Subtle wooden or metal clink of ' + primaryObj,
      ],
      ambientSoundscape: `Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. Soft wind, distant birds, foliage movement. NO narration. NO dialogue. NO music.`,
    },
  };

  const scene1EndFrame = `FINAL FRAME SCENE 1: The ${charName} kneels close to the ${primaryAnimal} in ${placeName}, holding the ${primaryObj} between them, framed vertically in 9:16 aspect ratio.`;
  const scene1PromptText = `🎬 VIDEO 1 — BEGINNING (10 SECONDS)

[DURATION]: 10 seconds
[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)
[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic inspired by classic fantasy animation. Original characters and original environment. Soft watercolor backgrounds, rich painterly detail, warm storytelling atmosphere.

[CHARACTER LOCK]: ${charName}, ${charLockData.age}, wearing ${charLockData.clothing}. Hair: ${charLockData.hairAndFace}.
[ANIMAL LOCK]: ${animNames} (${animLockData.appearance}).
[ENVIRONMENT LOCK]: ${placeName} (${envLockData.details}). Time: ${timeName}. Weather: ${weatherName}. Palette: ${envLockData.palette}.
[PROP LOCK]: ${primaryObj} (${objDesc}).

[SCENE SETUP & ACTION]:
00:00 - 00:04: 9:16 vertical ${chosenCamera.toLowerCase()} as the ${charName} walks through ${placeName} carrying the ${primaryObj}. Lighting: ${chosenLighting}. The ${charName} pauses as a subtle rustling sound catches their attention.
00:04 - 00:10: Gentle dolly-in as the ${charName} spots the ${primaryAnimal} resting near a mossy tree root. The ${charName} kneels down gently and holds out the ${primaryObj}. The ${primaryAnimal} tilts its head curiously and steps closer.

[CAMERA & LIGHTING]: 9:16 vertical composition. ${chosenCamera}. ${chosenLighting}.

[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. Crisp footsteps on mossy ground, gentle cloth movement, soft wind through leaves, distant woodland bird chirps, quiet breath of the ${primaryAnimal}. NO narration. NO dialogue. NO music.

[CONTINUITY ANCHOR]: ${scene1EndFrame}`;

  const scene1: ScenePrompt = {
    sceneNumber: 1,
    title: 'Scene 01 — Beginning',
    subtitle: 'Discovery & Meeting',
    duration: '10 seconds',
    aspectRatio: '9:16 vertical format',
    sceneDescription: `The ${charName} travels through ${placeName} holding the ${primaryObj} and notices the ${primaryAnimal} for the first time.`,
    characterAction: `The ${charName} gently kneels and offers the ${primaryObj} toward the ${primaryAnimal}.`,
    cameraDirection: `9:16 vertical ${chosenCamera.toLowerCase()}.`,
    lightingAndAtmosphere: chosenLighting,
    animationStyle: 'Whimsical hand-painted Japanese animation style with rich watercolor textures in 9:16 vertical composition.',
    asmrSoundscape: 'Subtle footsteps on leaves, cloth rustle, quiet animal breath, gentle breeze. NO music.',
    continuityAnchor: scene1EndFrame,
    fullPromptText: scene1PromptText,
  };

  const scene2EndFrame = `FINAL FRAME SCENE 2: The ${charName} and ${primaryAnimal} stand side-by-side at the edge of a hidden glade in ${placeName}, gazing together toward a glowing natural sanctuary in 9:16 vertical frame.`;
  const scene2PromptText = `🎬 VIDEO 2 — CONTINUATION (10 SECONDS)

[DURATION]: 10 seconds (Direct continuation from Video 1)
[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)
[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic. Identical visual style, color grading, and line-art texture as Video 1.

[STRICT CONTINUITY LOCK]:
- FIRST FRAME MUST MATCH EXACTLY THE FINAL FRAME OF VIDEO 1: The ${charName} kneeling beside the ${primaryAnimal} holding the ${primaryObj} in 9:16 portrait.
- EXACT SAME CHARACTER: ${charName} wearing ${charLockData.clothing}.
- EXACT SAME ANIMAL: ${primaryAnimal} (${animLockData.appearance}).
- EXACT SAME ENVIRONMENT: ${placeName}. Same time of day (${timeName}), same lighting, same weather (${weatherName}).

[SCENE SETUP & ACTION]:
00:00 - 00:04: The ${primaryAnimal} stands up, turns around with a playful head glance, and trots ahead down a narrow sunlit trail in ${placeName}. The ${charName} stands up gracefully, holding the ${primaryObj}, and follows closely.
00:04 - 00:10: Smooth medium 9:16 vertical tracking shot following them as they walk together deeper into ${placeName}. They emerge into a hidden clearing where ancient wooden arches and glowing wildflowers open up.

[CAMERA & LIGHTING]: 9:16 vertical composition. ${chosenCamera}. Continuous ${chosenLighting}.

[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. Soft rustle of grass underfoot, light metallic/wood sound from ${primaryObj}, gentle animal footsteps, atmospheric ambient wind. NO narration. NO dialogue. NO music.

[CONTINUITY ANCHOR]: ${scene2EndFrame}`;

  const scene2: ScenePrompt = {
    sceneNumber: 2,
    title: 'Scene 02 — Continuation',
    subtitle: 'The Shared Journey',
    duration: '10 seconds',
    aspectRatio: '9:16 vertical format',
    sceneDescription: `Direct continuation from Scene 1. The ${primaryAnimal} leads the ${charName} deeper into ${placeName} toward a hidden clearing.`,
    characterAction: `The ${charName} follows the ${primaryAnimal} through the environment while keeping the ${primaryObj} held steadily.`,
    cameraDirection: `Smooth 9:16 vertical tracking shot side-by-side with character movement.`,
    lightingAndAtmosphere: chosenLighting,
    animationStyle: 'Identical hand-painted Japanese animation style with seamless visual continuity in 9:16 format.',
    asmrSoundscape: 'Rhythmic footsteps on soft earth, gentle rustle of clothes, wind through tall grass. NO music.',
    continuityAnchor: scene2EndFrame,
    fullPromptText: scene2PromptText,
  };

  const scene3EndFrame = `FINAL FRAME SCENE 3: A calm, breathtaking 9:16 vertical wide shot of the ${charName} sitting peacefully beside the ${primaryAnimal} in ${placeName} under the ${timeName} sky, as the camera slowly pulls back into lingering tranquility.`;
  const scene3PromptText = `🎬 VIDEO 3 — ENDING (10 SECONDS)

[DURATION]: 10 seconds (Direct continuation from Video 2)
[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)
[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic. Complete visual harmony with Videos 1 and 2.

[STRICT CONTINUITY LOCK]:
- FIRST FRAME MUST MATCH EXACTLY THE FINAL FRAME OF VIDEO 2: Standing at the edge of the hidden clearing in ${placeName} in 9:16 vertical view.
- EXACT SAME CHARACTER: ${charName} wearing ${charLockData.clothing}.
- EXACT SAME ANIMAL: ${primaryAnimal} (${animLockData.appearance}).
- EXACT SAME ENVIRONMENT & PROPS: ${placeName}, ${primaryObj} set down on mossy ground.

[SCENE SETUP & ACTION]:
00:00 - 00:05: The ${charName} sits down comfortably on a carpet of moss beside the ${primaryAnimal}. The ${primaryObj} is set gently on the ground, radiating a warm peaceful amber glow. The ${primaryAnimal} curled up beside them, resting its head gently.
00:05 - 00:10: Slow cinematic vertical 9:16 crane/dolly-out shot pulling back to reveal the surrounding ${placeName} as evening fireflies drift through the warm ${timeName} atmosphere. A peaceful, wholesome, emotional resolution.

[CAMERA & LIGHTING]: 9:16 vertical composition. ${chosenCamera} pulling away into a wide panoramic frame. ${chosenLighting}.

[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. Quiet evening insects, soft crackle or hum of ${primaryObj}, gentle night breeze through leaves, peaceful lingering nature ambience. NO narration. NO dialogue. NO music.

[CONTINUITY ANCHOR]: ${scene3EndFrame}`;

  const scene3: ScenePrompt = {
    sceneNumber: 3,
    title: 'Scene 03 — Ending',
    subtitle: 'Peaceful Resolution',
    duration: '10 seconds',
    aspectRatio: '9:16 vertical format',
    sceneDescription: `Direct continuation from Scene 2. The ${charName} and ${primaryAnimal} rest together in the clearing as night falls softly.`,
    characterAction: `The ${charName} rests beside the ${primaryAnimal} while setting down the ${primaryObj}.`,
    cameraDirection: `Slow smooth 9:16 vertical ${chosenCamera.toLowerCase()}.`,
    lightingAndAtmosphere: chosenLighting,
    animationStyle: 'Whimsical hand-painted Japanese animation aesthetic ending on a picturesque 9:16 vertical frame.',
    asmrSoundscape: 'Calm night breeze, evening crickets, quiet breath, gentle ASMR environment. NO music.',
    continuityAnchor: scene3EndFrame,
    fullPromptText: scene3PromptText,
  };

  return {
    id: `story-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    timestamp: Date.now(),
    selections,
    bible,
    scene1,
    scene2,
    scene3,
    negativePrompt: DEFAULT_NEGATIVE_PROMPT,
  };
};
