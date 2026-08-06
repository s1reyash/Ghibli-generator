import type { UserSelections, GenerationResult, StoryBible, ScenePrompt, YouTubeMetadata } from '../types/generator';
import { DEFAULT_NEGATIVE_PROMPT, CHARACTERS, ANIMALS, OBJECTS, PLACES, EVENTS, MORAL_LESSONS, MOODS, TIMES, WEATHER } from '../data/presets';
import { CAMERA_SHOTS, LIGHTING_STYLES } from '../components/CameraLightingMatrix';
import { get100SeoTagsFormatted } from '../data/seoTags';

// Helper to pick random element
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to pick N unique random elements
const pickN = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL-STOPPING HOOKS — Scene 01 Opening Moments
// Each hook is a visually arresting first-2-second moment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCROLL_STOPPING_HOOKS: Record<string, string[]> = {
  'Enchanted Forest': [
    'A single golden spore drifts DOWN from above and lands on {char}\'s outstretched palm, suddenly bursting into a shower of tiny glowing particles that illuminate {char}\'s wide-eyed face from below',
    'A massive ancient tree root LIFTS slightly from the earth as {char} approaches, revealing a mysterious soft glow underneath — {char} freezes mid-step, mouth slightly open in wonder',
    'Dense morning fog parts like a curtain as {char} steps through, revealing an impossibly vast forest clearing filled with floating luminescent mushrooms',
    'A {animal} appears SILENTLY from behind a moss-covered boulder, its eyes catching the light and glowing briefly — {char} gasps softly and kneels down slowly',
  ],
  'Japanese Village': [
    'A paper lantern hanging from an old wooden eave IGNITES by itself with a warm amber glow as {char} walks beneath it — {char} stops and looks up with quiet surprise',
    'Cherry blossom petals suddenly swirl in a spiral vortex around {char}\'s silhouette, creating a pink whirlwind before gently settling — a {animal} watches from a stone wall',
    'An ancient wooden door of a machiya house creaks OPEN by itself, spilling warm golden light across the cobblestone path where {char} stands holding the {object}',
    '{char} places a hand on a stone lantern and it begins to GLOW from within, casting intricate shadow patterns across the wet cobblestones as a {animal} tilts its head curiously',
  ],
  'Small Cottage': [
    'Smoke from the cottage chimney suddenly forms a perfect SPIRAL shape against the sunset sky — {char} pauses on the garden path and watches it curl upward in wonder',
    'The cottage window boxes BLOOM in fast-motion as {char} approaches — flowers opening their petals one by one in a cascade of color, releasing tiny golden pollen motes',
    'A {animal} pushes open the cottage\'s small wooden door from inside, peeking out at {char} who stands on the stone steps holding the {object} — warm interior light spills out',
    'Morning dew drops on the ivy-covered cottage wall catch the sunrise and create tiny RAINBOW prisms that dance across {char}\'s face and clothing',
  ],
  'Bamboo Forest': [
    'A bamboo stalk bends and SPRINGS back, releasing a shower of dewdrops that catch the misty light in slow motion — {char} shields eyes with one hand while smiling',
    'Shafts of golden light pierce through the bamboo canopy and a single ray illuminates the {object} in {char}\'s hands, making it glow as if enchanted',
    'The bamboo forest SWAYS in a sudden gentle wave, creating a mesmerizing rhythmic pattern — a {animal} emerges from between the stalks, nose twitching',
    '{char} runs fingertips along a bamboo stalk and it produces a deep, resonant HUM — nearby stalks begin to vibrate in harmony, and a {animal} perks its ears',
  ],
  'Rainy Street': [
    'A single large raindrop LANDS in a puddle at {char}\'s feet, creating perfect concentric ripples that reflect the warm glow of paper lanterns above',
    '{char} opens the {object} and rain immediately starts beading on its surface in beautiful patterns — a {animal} darts under its shelter, pressing close to {char}\'s ankle',
    'Lightning flashes ONCE in the distance, briefly illuminating the entire cobblestone alleyway in silver-blue — {char}\'s silhouette is frozen mid-step, dramatic and cinematic',
    'Rain streams off a wooden eave create a curtain of water droplets that {char} reaches through — the drops scatter like tiny jewels around {char}\'s outstretched fingers',
  ],
  'Flower Garden': [
    'A butterfly lands on {char}\'s nose and its wings pulse with iridescent color — {char} crosses eyes slightly to look at it, face breaking into a gentle smile',
    '{char} touches a closed flower bud and it OPENS instantly in a burst of color and pollen dust, releasing a tiny cloud of golden sparkles that drift upward',
    'A sudden gust lifts hundreds of petals into the air around {char} — for a moment {char} stands in a TORNADO of floating flowers, arms spread wide, laughing silently',
    'The {object} in {char}\'s hands begins to vibrate softly, and nearby flowers turn their faces toward it as if drawn by invisible magnetism — a {animal} watches with tilted head',
  ],
};

const DEFAULT_HOOKS = [
  'A mysterious warm GLOW appears from behind {char}, silhouetting them dramatically — {char} turns slowly to discover the {object} is emitting a soft pulsing light',
  'The {animal} appears from thin MIST, eyes catching ambient light and glowing briefly — {char} freezes mid-breath, clutching the {object} to their chest',
  'A gust of wind suddenly catches {char}\'s hair and clothing, creating a dramatic flowing silhouette against the sky — the {object} glints in the changing light',
  'Golden dust motes swirl in a beam of light that falls directly on {char}\'s face — {char}\'s eyes widen as a {animal} steps into view from the shadows',
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIVID MICRO-ACTIONS LIBRARY
// Specific, detailed small moments for each scene
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MICRO_ACTIONS_CHARACTER = [
  '{char} tucks a loose strand of hair behind one ear while glancing sideways at the {animal}',
  '{char} adjusts the collar of their clothing with one hand, the other hand brushing against wild grass tips',
  '{char}\'s fingers trace the carved details on the {object}, thumb rubbing a worn groove thoughtfully',
  '{char} breathes out slowly — visible breath in the cool air — and blinks with quiet contentment',
  '{char} crouches down to examine something small on the ground, tilting head with childlike curiosity',
  '{char} stretches both arms above their head, arching their back, then relaxes with a soft exhale',
  '{char} holds the {object} up to the light, rotating it slowly, watching how it catches the glow',
  '{char}\'s hand reaches out and catches a falling leaf mid-air, holding it up to compare its color to the sky',
  '{char} pauses and places one palm flat against a tree trunk, closing eyes as if listening to something beneath the bark',
  '{char} kneels beside a stream and cups water in both hands, lifting it to watch it trickle through fingers',
  '{char}\'s apron ripples in the wind and they grab the hem with one hand while balancing the {object} in the other',
  '{char} pulls the {object} closer to their chest protectively as a stronger breeze rushes through',
];

const MICRO_ACTIONS_ANIMAL: Record<string, string[]> = {
  'Cat': [
    'the cat stretches its front paws forward in a long, luxurious arch, then shakes its whiskers',
    'the cat bats at a floating dandelion seed with one velvet paw, head following it intently',
    'the cat rubs its cheek against {char}\'s ankle, leaving behind a purring warmth, eyes half-closed',
    'the cat leaps silently onto a low stone wall and sits with regal posture, tail curling around its paws',
    'the cat yawns widely showing tiny teeth, then licks one paw and swipes it behind an ear',
  ],
  'Dog': [
    'the dog sniffs a wildflower intensely, then sneezes, shaking its entire head comically',
    'the dog trots ahead, looks back at {char} with tongue out, then spins once in playful excitement',
    'the dog nuzzles its wet nose into {char}\'s palm, tail wagging in a wide happy arc',
    'the dog tilts its head at a distant sound, one ear perked up, then bounds forward with joy',
    'the dog flops onto its side in a patch of sunlight, belly up, paws paddling lazily at the air',
  ],
  'Rabbit': [
    'the rabbit thumps one hind foot twice on the ground, nose twitching rapidly in alert curiosity',
    'the rabbit hops in a tiny figure-eight pattern around {char}\'s feet, ears bouncing with each jump',
    'the rabbit stands on hind legs and stretches upward toward {char}\'s outstretched hand, whiskers quivering',
    'the rabbit grooming its face with both tiny front paws, pausing mid-wash to stare at something distant',
  ],
  'Fox': [
    'the fox tilts its narrow face sideways, one ear rotating independently, tracking a sound only it can hear',
    'the fox brushes its bushy white-tipped tail against {char}\'s leg as it circles past, fur rippling',
    'the fox pounces at a patch of rustling leaves, front paws together, then looks up at {char} almost embarrassed',
    'the fox sits with perfect poise, licking its dark paw pads clean, amber eyes watching {char} with ancient wisdom',
  ],
  'Deer': [
    'the fawn flicks both ears forward at a sudden sound, its spotted body tensing briefly before relaxing',
    'the fawn lowers its delicate head to drink from a tiny stream, creating the faintest ripples on the water surface',
    'the fawn takes one cautious step toward {char}, stretches its neck forward, and sniffs {char}\'s outstretched palm',
    'the fawn shakes its body in a full ripple from nose to tail, dislodging a tiny leaf caught in its spotted fur',
  ],
};

const DEFAULT_ANIMAL_MICRO = [
  'the {animal} pauses and tilts its head, looking at {char} with large, expressive eyes full of quiet understanding',
  'the {animal} moves closer to {char}\'s side, pressing its warm body gently against {char}\'s leg for comfort',
  'the {animal} notices a floating spore and reaches toward it with a paw, batting at it gently in the air',
  'the {animal} makes a soft, contented sound and settles into a comfortable walking rhythm beside {char}',
];

const MICRO_ACTIONS_ENVIRONMENT = [
  'a cloud of golden pollen drifts past in slow motion, each particle catching the light individually',
  'a tiny stream of water trickles between moss-covered rocks, creating miniature silver cascades',
  'leaves overhead rustle and shift, creating a moving mosaic of light and shadow on the ground',
  'a spider web between two branches catches the light, each strand glittering with morning dew',
  'tiny mushrooms along the path glow faintly with bioluminescent pale blue light',
  'a worn stone step cracks with age-marks, wildflowers growing from the crevices',
  'dandelion seeds drift across the scene in a lazy diagonal, backlit by warm golden light',
  'a distant bird takes flight from a treetop, its silhouette crossing the sky in graceful arcs',
  'ripples spread across a puddle as a single petal lands on its surface',
  'fireflies begin to pulse in the background, their lights syncing in gentle rhythmic waves',
  'a wind chime somewhere unseen rings once — a single clear note hanging in the quiet air',
  'shadows lengthen across the scene as the sun shifts, painting everything in warmer tones',
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PER-SCENE NARRATIVE PROGRESSIONS
// Unique action descriptions per scene position
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCENE_NARRATIVE_TEMPLATES: Record<string, { firstHalf: string; secondHalf: string }[]> = {
  'beginning': [
    {
      firstHalf: '{char} steps cautiously into the {place}, the {object} clutched tightly against their chest. {envMicro1}. {charMicro}.',
      secondHalf: 'A {animal} appears from behind {envElement} — {animalMicro}. {char}\'s eyes soften. {char} extends one trembling hand toward it. {envMicro2}.',
    },
    {
      firstHalf: '{char} stands at the threshold of the {place}, golden light spilling across their face. {charMicro}. {envMicro1}.',
      secondHalf: 'The {animal} emerges from the shadows, {animalMicro}. {char} lowers to one knee and offers a gentle palm. A moment of shared stillness. {envMicro2}.',
    },
    {
      firstHalf: 'Mist swirls around {char}\'s ankles as they enter the {place}, the {object} gleaming faintly. {envMicro1}. {charMicro}.',
      secondHalf: 'A soft rustling draws {char}\'s gaze — a {animal} watches from a mossy ledge, {animalMicro}. {char} smiles, recognition dawning in their eyes. {envMicro2}.',
    },
  ],
  'middle': [
    {
      firstHalf: '{char} and the {animal} walk side by side deeper into the {place}. {charMicro}. {animalMicro}. {envMicro1}.',
      secondHalf: '{char} pauses at a natural alcove and sets the {object} down on a flat stone. The {animal} circles it curiously. {envMicro2}. A gentle wind stirs the air.',
    },
    {
      firstHalf: 'The {animal} leads the way along a narrow path while {char} follows, one hand brushing against wild ferns. {charMicro}. {envMicro1}.',
      secondHalf: 'They discover a hidden clearing — {envMicro2}. {char} lifts the {object} and its surface catches the light beautifully. {animalMicro}.',
    },
    {
      firstHalf: '{char} sits on a weathered log and opens the {object}, examining it with quiet focus. The {animal} curls beside {char}\'s feet. {envMicro1}.',
      secondHalf: '{charMicro}. A sudden cascade of petals drifts through the air. The {animal} looks upward, {animalMicro}. {envMicro2}.',
    },
    {
      firstHalf: 'The path narrows through taller vegetation. {char} ducks under a low branch, the {object} tucked safely under one arm. {envMicro1}. {animalMicro}.',
      secondHalf: 'They emerge into a wider space bathed in warm light. {charMicro}. The {animal} sniffs the air and presses closer to {char}. {envMicro2}.',
    },
  ],
  'resolution': [
    {
      firstHalf: '{char} and the {animal} arrive at a serene overlook. {char} sets the {object} down gently and sits cross-legged. {charMicro}. {envMicro1}.',
      secondHalf: 'The {animal} nestles against {char}\'s lap, {animalMicro}. {char} strokes it gently. Golden fireflies begin to pulse around them in the fading light. {envMicro2}. A perfect, sustained moment of wordless peace.',
    },
    {
      firstHalf: 'The light softens to deep amber as {char} finds a quiet spot beneath an ancient tree. The {object} rests between {char}\'s feet. {envMicro1}. {charMicro}.',
      secondHalf: 'The {animal} climbs into {char}\'s lap and closes its eyes. {animalMicro}. {char}\'s breathing slows to match the {animal}\'s rhythm. {envMicro2}. The world holds its breath in gentle stillness.',
    },
    {
      firstHalf: '{char} leans against a moss-covered stone, the {object} cradled in both arms. {envMicro1}. {charMicro}. The last rays of daylight paint everything in warm gold.',
      secondHalf: 'The {animal} rests its head on {char}\'s knee, {animalMicro}. Stars begin to appear overhead. Fireflies gather in the middle distance. {envMicro2}. An unspoken understanding settles between them — they have found sanctuary.',
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHARACTER & ANIMAL DATA MAPS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

const ENV_ELEMENTS: Record<string, string[]> = {
  'Enchanted Forest': ['a moss-covered boulder', 'a gnarled tree root', 'a curtain of hanging vines', 'a cluster of glowing mushrooms'],
  'Japanese Village': ['a stone lantern', 'a wooden gate post', 'a cherry blossom branch', 'a ceramic rain jar'],
  'Small Cottage': ['a garden fence post', 'an ivy-draped window', 'a stone stepping block', 'a flower pot on the porch'],
  'Bamboo Forest': ['a tall bamboo cluster', 'a smooth river stone', 'a patch of ferns', 'a fallen bamboo crossbeam'],
  'Rainy Street': ['a wooden doorway', 'a rain-slicked barrel', 'a paper lantern pole', 'an overturned stone planter'],
  'Flower Garden': ['a rose trellis archway', 'a stone birdbath', 'a weathered wooden bench', 'a hedge of lavender'],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEMPLATE INTERPOLATION ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const interpolate = (
  template: string,
  vars: Record<string, string>
): string => {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROCEDURAL STORY GENERATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

  // Template variable map for interpolation
  const vars: Record<string, string> = {
    char: charName,
    animal: primaryAnimal.toLowerCase(),
    object: primaryObj.toLowerCase(),
    place: placeName.toLowerCase(),
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

  // ━━━ GENERATE DYNAMIC N-SCENE PROMPTS ━━━
  const scenes: ScenePrompt[] = [];

  // Pre-select unique micro-actions so they don't repeat across scenes
  const charMicros = pickN(MICRO_ACTIONS_CHARACTER, targetCount + 2).map(t => interpolate(t, vars));
  const animalMicroPool = MICRO_ACTIONS_ANIMAL[primaryAnimal] || DEFAULT_ANIMAL_MICRO;
  const animalMicros = pickN(animalMicroPool, targetCount + 2).map(t => interpolate(t, vars));
  const envMicros = pickN(MICRO_ACTIONS_ENVIRONMENT, targetCount * 2 + 2);
  const envElements = ENV_ELEMENTS[placeName] || ['a weathered stone', 'a cluster of wildflowers', 'a twisted root', 'a patch of soft moss'];

  // Select scroll-stopping hook for Scene 01
  const hookPool = SCROLL_STOPPING_HOOKS[placeName] || DEFAULT_HOOKS;
  const selectedHook = interpolate(pick(hookPool), vars);

  for (let idx = 1; idx <= targetCount; idx++) {
    const isFirst = idx === 1;
    const isLast = idx === targetCount;
    const isMid = !isFirst && !isLast;

    const sceneTitle = `Scene 0${idx} — ${isFirst ? 'The Hook' : isLast ? 'Sanctuary' : `Discovery ${idx}`}`;
    const sceneSubtitle = isFirst 
      ? 'Scroll-Stopping Opening' 
      : isLast 
      ? 'Peaceful Resolution' 
      : `Deepening Bond 0${idx}`;

    // Zero-Jerk Motion Vector Lock
    const motionLockVector = !isFirst
      ? `[ZERO-JERK MOTION CONTINUITY LOCK]: First frame of Scene 0${idx} matches EXACTLY the last frame of Scene 0${idx - 1}. Lock subject position (${charName} at center-right), subject velocity vector (walking forward at 0.5m/s), facing angle (3/4 profile facing left), clothing fold state, camera focal length (50mm lens), and lighting angle. NO sudden angle jump, NO pose pop, NO abrupt speed drop.`
      : `[BASELINE FRAME LOCK]: Establish stable 9:16 vertical tracking shot with steady 0.5m/s subject momentum.`;

    const endFrameAnchor = `FINAL FRAME SCENE 0${idx}: The ${charName} and ${primaryAnimal} ${isLast ? 'rest peacefully together, the ' + primaryAnimal + ' nestled against ' + charName + '\'s lap, surrounded by softly glowing fireflies in' : 'walk side-by-side through'} ${placeName}${eventName ? ` during the ${eventName}` : ''}, the ${primaryObj} resting ${isLast ? 'beside them on the ground' : 'in ' + charName + '\'s hands'}, framed in 9:16 vertical view.`;

    const moralInstruction = moralName
      ? `\n[MORAL & FABLE THEME LOCK]: This scene embodies "${moralName}". The ${charName}'s actions convey empathy, trust, and harmony with nature through specific gestures and expressions — not exposition.`
      : '';

    // Build the per-scene narrative block with unique micro-actions
    const sceneCategory = isFirst ? 'beginning' : isLast ? 'resolution' : 'middle';
    const narrativeTemplate = pick(SCENE_NARRATIVE_TEMPLATES[sceneCategory]);
    const envElement = pick(envElements);

    const microVars: Record<string, string> = {
      ...vars,
      charMicro: charMicros[idx - 1] || charMicros[0],
      animalMicro: animalMicros[idx - 1] || animalMicros[0],
      envMicro1: envMicros[(idx - 1) * 2] || envMicros[0],
      envMicro2: envMicros[(idx - 1) * 2 + 1] || envMicros[1],
      envElement,
    };

    const narrativeFirstHalf = interpolate(narrativeTemplate.firstHalf, microVars);
    const narrativeSecondHalf = interpolate(narrativeTemplate.secondHalf, microVars);

    // Build hook block for Scene 01 only
    const hookBlock = isFirst
      ? `\n[🔴 SCROLL-STOPPING HOOK — FIRST 2 SECONDS]:\n${selectedHook}\nThis visually arresting moment MUST appear in the first 2 seconds of the video to capture viewer attention and prevent scrolling past.\n`
      : '';

    const fullPromptText = `🎬 VIDEO ${idx} — ${isFirst ? 'THE HOOK' : isLast ? 'SANCTUARY' : 'DEEPENING'} (10 SECONDS)

[DURATION]: 10 seconds${!isFirst ? ` (Direct continuous match-cut from Video ${idx - 1})` : ''}
[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)
[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic. Soft watercolor backgrounds, rich painterly detail, warm storytelling atmosphere. Every frame should feel like a Ghibli painting come to life with specific micro-movements bringing it alive.${moralInstruction}
${hookBlock}
[STRICT CHARACTER & PROP CONTINUITY]:
- CHARACTER LOCK: ${charName}, ${charLockData.age}, wearing ${charLockData.clothing}. Hair: ${charLockData.hairAndFace}.
- ANIMAL LOCK: ${animNames} (${animLockData.appearance}).
- PROP LOCK: ${primaryObj} (${objDesc}).
- ENVIRONMENT: ${placeName}${eventName ? ` (${eventName})` : ''}. Time: ${timeName}. Weather: ${weatherName}. Palette: ${envLockData.palette}.${moralName ? `\n- MORAL THEME: ${moralName}.` : ''}

${motionLockVector}

[SCENE SETUP & CINEMATIC ACTION]:
00:00 - 00:04: 9:16 vertical ${chosenCamera.toLowerCase()}. ${narrativeFirstHalf} Lighting: ${chosenLighting}.
00:04 - 00:10: ${narrativeSecondHalf}

[SPECIFIC MICRO-ANIMATION REQUIREMENTS]:
- ${charMicros[idx - 1] || charMicros[0]}
- ${animalMicros[idx - 1] || animalMicros[0]}
- ${envMicros[(idx - 1) * 2] || envMicros[0]}

[CAMERA & LIGHTING]: 9:16 vertical composition. ${chosenCamera}. ${chosenLighting}. Zero camera jitter or abrupt focal pops.

[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape. Close-up Foley: crisp footstep textures on ${placeName.includes('Forest') ? 'moss and dried leaves' : placeName.includes('Street') ? 'wet cobblestones' : 'soft earth'}, fabric rustling with each step, the ${primaryAnimal}'s quiet breathing, ${placeName.includes('Rain') ? 'individual raindrops tapping on surfaces' : 'wind gently rustling nearby foliage'}. NO narration. NO dialogue. NO music.

[CONTINUITY ANCHOR]: ${endFrameAnchor}`;

    const characterActionSummary = isFirst 
      ? `Discovers ${primaryAnimal} in ${placeName} — hook moment` 
      : isLast 
      ? `Rests peacefully with ${primaryAnimal} — sanctuary reached` 
      : isMid 
      ? `Explores deeper with ${primaryAnimal} — bond deepens`
      : `Continues journey with ${primaryAnimal}`;

    scenes.push({
      sceneNumber: idx,
      title: sceneTitle,
      subtitle: sceneSubtitle,
      duration: '10 seconds',
      aspectRatio: '9:16 vertical format',
      sceneDescription: `Scene 0${idx} of ${targetCount}: ${charName} and ${primaryAnimal} in ${placeName}${eventName ? ` (${eventName})` : ''}.`,
      characterAction: characterActionSummary,
      cameraDirection: `9:16 vertical ${chosenCamera.toLowerCase()}`,
      lightingAndAtmosphere: chosenLighting,
      animationStyle: 'Whimsical hand-painted Japanese animation style in 9:16 vertical composition with scroll-stopping hooks and vivid micro-animations.',
      asmrSoundscape: `Close-up Foley on ${placeName.includes('Forest') ? 'moss, leaves' : 'stone, earth'}. ${primaryAnimal} breathing. Fabric rustle. NO music.`,
      continuityAnchor: endFrameAnchor,
      motionLockVector,
      fullPromptText,
    });
  }

  // ━━━ YOUTUBE SHORTS METADATA & 100 SEO TAGS ━━━
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
