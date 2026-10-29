export const motionConfig = {
  heroDuration: 760,
  revealDuration: 620,
  staggerDelay: 65,
  maxStaggerDelay: 260,
  revealDistance: 22,
};

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function easeOutCubic(value) {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
}

export function phaseProgress(progress, start, end) {
  if (end <= start) return progress >= end ? 1 : 0;
  return easeOutCubic((progress - start) / (end - start));
}

export function shouldEnableScene({ wideEnough, reducedMotion, saveData = false }) {
  return wideEnough && !reducedMotion && !saveData;
}
