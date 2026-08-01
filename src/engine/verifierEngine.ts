export interface VerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  score: number; // 0-100 portion
  feedback: string;
}

export interface VerificationReport {
  overallScore: number; // 0 - 100
  status: 'PERFECT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'INVALID';
  checks: VerificationCheck[];
  issues: string[];
  suggestions: string[];
  autoFixedPromptText: string;
}

export const verifyPrompt = (promptText: string): VerificationReport => {
  const text = promptText.trim();
  const lower = text.toLowerCase();

  const checks: VerificationCheck[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check 1: Duration (10 seconds)
  const has10s = lower.includes('10 second') || lower.includes('10s') || lower.includes('10-second');
  checks.push({
    id: 'duration',
    name: '10-Second Duration Requirement',
    passed: has10s,
    score: has10s ? 20 : 0,
    feedback: has10s
      ? 'Verified: Prompt explicitly specifies 10-second scene duration.'
      : 'Missing: Prompt must explicitly specify exactly 10 seconds duration.',
  });
  if (!has10s) {
    issues.push('Missing explicit 10-second duration constraint.');
    suggestions.push('Add "[DURATION]: 10 seconds" at the beginning of your prompt.');
  }

  // Check 2: Aspect Ratio (9:16 Vertical Format)
  const has916 = lower.includes('9:16') || lower.includes('vertical') || lower.includes('portrait');
  checks.push({
    id: 'aspect-ratio',
    name: '9:16 Vertical Video Format',
    passed: has916,
    score: has916 ? 15 : 0,
    feedback: has916
      ? 'Verified: 9:16 vertical video ratio confirmed for Mobile/Shorts.'
      : 'Missing: Prompt must explicitly mandate 9:16 vertical video format.',
  });
  if (!has916) {
    issues.push('Missing 9:16 vertical format specification.');
    suggestions.push('Add "[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)".');
  }

  // Check 3: Visual Style (Hand-painted Japanese animation aesthetic)
  const hasGhibliStyle =
    lower.includes('hand-painted') ||
    lower.includes('japanese animation') ||
    lower.includes('watercolor') ||
    lower.includes('whimsical') ||
    lower.includes('ghibli');
  checks.push({
    id: 'visual-style',
    name: 'Whimsical Hand-Painted Anime Aesthetic',
    passed: hasGhibliStyle,
    score: hasGhibliStyle ? 20 : 5,
    feedback: hasGhibliStyle
      ? 'Verified: Hand-painted Japanese animation visual style confirmed.'
      : 'Warning: Prompt lacks explicit hand-painted anime style guidance.',
  });
  if (!hasGhibliStyle) {
    issues.push('Weak visual style definition.');
    suggestions.push('Include "Whimsical hand-painted Japanese animation aesthetic with soft watercolor backgrounds".');
  }

  // Check 4: Audio & ASMR Foley (No Music, No Dialogue, No Voice)
  const hasASMR = lower.includes('asmr') || lower.includes('foley') || lower.includes('environmental sound');
  const bansBGM = lower.includes('no music') || lower.includes('no dialogue') || lower.includes('no narration') || lower.includes('no voice');
  const audioPassed = hasASMR && bansBGM;
  checks.push({
    id: 'asmr-audio',
    name: 'Natural ASMR Foley (No Music / No Voice)',
    passed: audioPassed,
    score: audioPassed ? 20 : hasASMR || bansBGM ? 10 : 0,
    feedback: audioPassed
      ? 'Verified: Immersive natural ASMR soundscape locked. No music or dialogue.'
      : 'Violation: Video prompts MUST mandate natural ASMR audio and ban music/dialogue.',
  });
  if (!audioPassed) {
    issues.push('Audio rules incomplete (Must require ASMR Foley and ban music/dialogue).');
    suggestions.push('Add "Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. NO narration. NO dialogue. NO music."');
  }

  // Check 5: Cinematic Camera Direction
  const hasCamera =
    lower.includes('camera') ||
    lower.includes('tracking shot') ||
    lower.includes('dolly') ||
    lower.includes('pan') ||
    lower.includes('crane') ||
    lower.includes('wide shot');
  checks.push({
    id: 'camera',
    name: 'Cinematic Camera Movement',
    passed: hasCamera,
    score: hasCamera ? 15 : 0,
    feedback: hasCamera
      ? 'Verified: Smooth cinematic camera direction detected.'
      : 'Missing: Specify camera movement (slow tracking, dolly-in, or pan).',
  });
  if (!hasCamera) {
    issues.push('Missing camera direction.');
    suggestions.push('Add camera movement instructions like "Slow tracking shot transitioning into a gentle dolly-in".');
  }

  // Check 6: Story Continuity Anchor
  const hasContinuity =
    lower.includes('continuity') ||
    lower.includes('final frame') ||
    lower.includes('first frame') ||
    lower.includes('anchor');
  checks.push({
    id: 'continuity',
    name: 'Story & Frame Continuity Anchor',
    passed: hasContinuity,
    score: hasContinuity ? 10 : 0,
    feedback: hasContinuity
      ? 'Verified: Continuity anchor specifies frame-to-frame locking.'
      : 'Missing: Add continuity anchor specifying exact start/end frames.',
  });
  if (!hasContinuity) {
    issues.push('Missing continuity anchor for 3-part scene alignment.');
    suggestions.push('Add "[CONTINUITY ANCHOR]: Final frame description for Scene alignment".');
  }

  // Calculate Overall Score
  const overallScore = checks.reduce((sum, c) => sum + c.score, 0);

  let status: VerificationReport['status'] = 'PERFECT';
  if (overallScore < 60) status = 'NEEDS_IMPROVEMENT';
  else if (overallScore < 85) status = 'GOOD';

  // Build Auto-Fixed Prompt Version
  let fixed = text;
  if (!has10s) {
    fixed = `[DURATION]: 10 seconds\n` + fixed;
  }
  if (!has916) {
    fixed = `[ASPECT RATIO]: 9:16 vertical video format (1080x1920 portrait composition)\n` + fixed;
  }
  if (!hasGhibliStyle) {
    fixed += `\n[VISUAL STYLE]: Whimsical hand-painted Japanese animation aesthetic inspired by classic fantasy animation. Soft watercolor backgrounds, rich painterly detail, warm storytelling atmosphere. Original characters and original environment.`;
  }
  if (!audioPassed) {
    fixed += `\n[ASMR AUDIO & SOUNDSCAPE]: Immersive natural ASMR soundscape with realistic environmental audio and subtle close-up Foley. NO narration. NO dialogue. NO music.`;
  }
  if (!hasCamera) {
    fixed += `\n[CAMERA DIRECTION]: Slow smooth vertical tracking shot with natural cinematic movement.`;
  }
  if (!hasContinuity) {
    fixed += `\n[CONTINUITY ANCHOR]: Character position, clothing, environment lighting, and objects remain locked across scenes.`;
  }

  return {
    overallScore,
    status,
    checks,
    issues,
    suggestions,
    autoFixedPromptText: fixed,
  };
};
