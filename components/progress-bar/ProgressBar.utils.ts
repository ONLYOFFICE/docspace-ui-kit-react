/** Clamps a progress value to 0..100; anything that is not a finite number becomes 0. */
export const clampPercent = (percent: number): number => {
  if (!Number.isFinite(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
};
