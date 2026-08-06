import type { UserSelections, GenerationResult, StoryBible, ScenePrompt, YouTubeMetadata } from '../types/generator';
import { DEFAULT_NEGATIVE_PROMPT, CHARACTERS, ANIMALS, OBJECTS, PLACES, EVENTS, MORAL_LESSONS, MOODS, TIMES, WEATHER } from '../data/presets';
import { CAMERA_SHOTS, LIGHTING_STYLES } from '../components/CameraLightingMatrix';
import { get100SeoTagsFormatted } from '../data/seoTags';

// Helper to pick random element
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to format names nicely
const resolveName = (selected: string, custom: string, defaultFallback: string): string => {
  if (custom && custom.trim().length > 0) return custom.trim();
  if (selected) {
    const found = [...CHARACTERS, ...ANIMALS, ...OBJECTS, ...PLACES, ...EVENTS, ...MORAL_LESSONS, ...MOODS, ...TIMES, ...WEATHER].find(p => p.id === selected);
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
  const randomEvent = pick(EVENTS).name;
  const randomMoral = pick(MORAL_LESSONS).name;
  const randomMood = pick(MOODS).name;
  const randomTime = pick(TIMES).name;
  const randomWeather = pick(WEATHER).name;
  const randomCam = pick(CAMERA_SHOTS).name;
  const randomLight = pick(LIGHTING_STYLES).name;
  const randomCount = pick([2, 3, 4, 5]);

  return {
    character: randomChar,
    customCharacter: '',
    animals: randomAnim,
    customAnimal: '',
    objects: randomObj,
    customObject: '',
    place: randomPlace,
    customPlace: '',
    event: randomEvent,
    customEvent: '',
    moralLesson: randomMoral,
    customMoralLesson: '',
    mood: randomMood,
    time: randomTime,
    weather: randomWeather,
    cameraStyle: randomCam,
    lightingStyle: randomLight,
    sceneCount: randomCount,
  };
};

export const generateStory = (selections: UserSelections): GenerationResult => {
  const targetCount = selections.sceneCount && selections.sceneCount >= 1 && selections.sceneCount <= 5 ? selections.sceneCount : 3;

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
  const eventName = resolveName(selections.event || '', selections.customEvent || '', '');
  const moralName = resolveName(selections.moralLesson || '', selections.customMoralLesson || '', '');
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

  const titleTemplates = moralName
    ? [`The Lesson of ${moralName}`, `Whispers of ${moralName}`, `${charName}'s Journey of ${moralName}`]
    : eventName 
    ? [`The ${eventName} with ${primaryObj}`, `${charName}'s ${eventName}`, `A ${moodName} ${eventName} in ${placeName}`]
    : [`The ${primaryObj} in the ${placeName}`, `Whispers of the ${placeName}`, `The ${charName} and the ${primaryAnimal}`];
  const storyTitle = pick(titleTemplates);

  const conceptSummary = `In a ${moodName.toLowerCase()} ${placeName.toLowerCase()} during ${timeName.toLowerCase()}${eventName ? ` (${eventName.toLowerCase()})` : ''}, a ${charName.toLowerCase()} carrying a ${primaryObj.toLowerCase()} encounters a ${primaryAnimal.toLowerCase()}, embarking on a ${targetCount}-part journey${moralName ? ` reflecting the moral truth that "${moralName.toLowerCase()}"` : ''}.`;

  const bible: StoryBible = {
    title: storyTitle,
    conceptSummary,
    moralSummary: moralName ? `Moral Lesson: "${moralName}" — Reminding us that quiet kindness, trust, and gentle patience heal the world.` : undefined,
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
      details: envLockData.details + (eventName ? ` (${eventName} setting)` : ''),
      palette: envLockData.palette,
      lighting: chosenLighting,
      weather: weatherName,
      timeOfDay: timeName,
    },
    objectLock: {
      names: [objNames],
      details: objDesc,
    },
    eventLock: eventName ? { name: eventName, details: `Visual setting and scenario context for ${eventName}` } : undefined,
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

  // Generate dynamic N scene prompts with ZERO-JERK MOTION CONTINUITY LOCKS
  const scenes: ScenePrompt[] = [];

  for (let idx = 1; idx <= targetCount; idx++) {
    const isFirst = idx === 1;
    const isLast = idx === targetCount;

    const sceneTitle = `Scene 0${idx} — ${isFirst ? 'Beginning' : isLast ? 'Resolution' : `Part ${idx}`}`;
    const sceneSubtitle = isFirst 
      ? 'Discovery & Meeting' 
      : isLast 
      ? 'Peaceful Sanctuary & Moral Realization' 
      : `Journey Stage 0${idx}`;

    // Zero-Jerk Motion Vector Lock
    const motionLockVector = !isFirst
      ? `[ZERO-JERK MOTION CONTINUITY LOCK]: First frame of Scene 0${idx} matches EXACTLY the last frame of Scene 0${idx - 1}. Lock subject position (${charName} at center-right), subject velocity vector (walking forward at 0.5m/s), facing angle (3/4 profile facing left), clothing fold state, camera focal length (50mm lens), and lighting angle. NO sudden angle jump, NO pose pop, NO abrupt speed drop.`
      : `[BASELINE FRAME LOCK]: Establish stable 9:16 vertical tracking shot with steady 0.5m/s subject momentum.`;

    const endFrameAnchor = `FINAL FRAME SCENE 0${idx}: The ${charName} and ${primaryAnimal} ${isLast ? 'sit peacefully beside each other in' : 'walk side-by-side through'} ${placeName}${eventName ? ` during the ${eventName}` : ''}, holding the ${primaryObj}, framed in 9:16 vertical view.`;

    const moralInstruction = moralName
      ? `\n[MORAL & FABLE THEME LOCK]: Scene embodies the core lesson of "${moralName}". The ${charName}'s gentle actions toward the ${primaryAnimal} express empathy, quiet kindness, and harmony.`
      : '';

    const fullPromptText = `🎬 VIDEO ${idx} — ${isFirst ? 'BEGINNING' : isLast ? 'ENDING' : 'CONTINUATION'} (10 SECONDS)

[DURATION]: 10 seconds${!isFirst ? ` (Direct continuous match-cut from Video ${idx - 1})` : ''}
[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)
[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic. Soft watercolor backgrounds, rich painterly detail, warm storytelling atmosphere.${moralInstruction}

[STRICT CHARACTER & PROP CONTINUITY]:
- CHARACTER LOCK: ${charName}, ${charLockData.age}, wearing ${charLockData.clothing}. Hair: ${charLockData.hairAndFace}.
- ANIMAL LOCK: ${animNames} (${animLockData.appearance}).
- PROP LOCK: ${primaryObj} (${objDesc}).
- ENVIRONMENT: ${placeName}${eventName ? ` (${eventName})` : ''}. Time: ${timeName}. Weather: ${weatherName}. Palette: ${envLockData.palette}.${moralName ? `\n- MORAL THEME: ${moralName}.` : ''}

${motionLockVector}

[SCENE SETUP & ACTION]:
00:00 - 00:04: 9:16 vertical ${chosenCamera.toLowerCase()} as the ${charName} ${isFirst ? `travels through ${placeName} carrying the ${primaryObj}` : `continues walking seamlessly with the ${primaryAnimal}`}. Lighting: ${chosenLighting}.
00:04 - 00:10: ${isLast ? `The ${charName} and ${primaryAnimal} settle peacefully beside each other, setting down the ${primaryObj} as night fireflies drift gently, expressing quiet gratitude.` : `The ${primaryAnimal} leads the way forward down a sunlit path while the ${charName} follows with smooth, fluid movement.`}

[CAMERA & LIGHTING]: 9:16 vertical composition. ${chosenCamera}. ${chosenLighting}. Zero camera jitter or abrupt focal pops.

[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. Crisp footsteps, soft cloth rustle, wind through foliage, gentle animal breath. NO narration. NO dialogue. NO music.

[CONTINUITY ANCHOR]: ${endFrameAnchor}`;

    scenes.push({
      sceneNumber: idx,
      title: sceneTitle,
      subtitle: sceneSubtitle,
      duration: '10 seconds',
      aspectRatio: '9:16 vertical format',
      sceneDescription: `Scene 0${idx} of ${targetCount}: ${charName} and ${primaryAnimal} in ${placeName}${eventName ? ` (${eventName})` : ''}.`,
      characterAction: isLast ? `Rests beside ${primaryAnimal}` : `Walks steadily with ${primaryAnimal}`,
      cameraDirection: `9:16 vertical ${chosenCamera.toLowerCase()}`,
      lightingAndAtmosphere: chosenLighting,
      animationStyle: 'Whimsical hand-painted Japanese animation style in 9:16 vertical composition with zero-jerk motion locks.',
      asmrSoundscape: 'Subtle footsteps, cloth rustle, quiet animal breath, gentle breeze. NO music.',
      continuityAnchor: endFrameAnchor,
      motionLockVector,
      fullPromptText,
    });
  }

  // Generate YouTube Shorts Metadata & Attach 100 SEO Tags
  const { hashtags, fullText: allSeoTagsText } = get100SeoTagsFormatted();
  const youtubeTitle = moralName 
    ? `Anime ASMR Moral Story | ${moralName} with ${charName} & ${primaryAnimal} #Shorts`
    : `Anime ASMR | Cozy ${moodName} ${eventName || placeName} with ${primaryAnimal} in Ghibli Style #Shorts`;

  const youtubeDescription = `Step into a whimsical Studio Ghibli inspired 9:16 vertical ASMR journey. Follow ${charName} and a gentle ${primaryAnimal} carrying a ${primaryObj} through a ${moodName.toLowerCase()} ${placeName.toLowerCase()}${eventName ? ` during a ${eventName.toLowerCase()}` : ''}.${moralName ? `\n\n💖 Moral Takeaway: "${moralName}" — Reminding us of the quiet warmth of empathy and small acts of kindness.` : ''}

🌿 Relax with natural environmental Foley audio, soft footsteps, rustling foliage, and calm atmospheric visuals. No music, no dialogue.

🎬 Sequential Video Prompts generated for 10-second AI video creation.`;

  const fullCopyText = `${youtubeTitle}

${youtubeDescription}

🏷️ HASHTAGS & VIRAL SEO TAGS (100 TAGS):
${allSeoTagsText}`;

  const youtubeMetadata: YouTubeMetadata = {
    title: youtubeTitle,
    description: youtubeDescription,
    hashtags: hashtags.slice(0, 15),
    allSeoTags: hashtags,
    allSeoTagsText,
    fullCopyText,
  };

  return {
    id: `story-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    timestamp: Date.now(),
    selections,
    bible,
    scenes,
    scene1: scenes[0],
    scene2: scenes[1] || scenes[0],
    scene3: scenes[2] || scenes[scenes.length - 1],
    negativePrompt: DEFAULT_NEGATIVE_PROMPT,
    youtubeMetadata,
  };
};
