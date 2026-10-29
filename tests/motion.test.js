import { describe, expect, it } from "vitest";
import { clamp, easeOutCubic, phaseProgress, shouldEnableScene } from "../app/lib/motion-config.js";

describe("motion safety and progression", () => {
  it("keeps numerical inputs bounded", () => {
    expect(clamp(-4, 0, 1)).toBe(0);
    expect(clamp(7, 0, 1)).toBe(1);
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
  it("reveals scene phases in a bounded interval", () => {
    expect(phaseProgress(0.1, 0.3, 0.8)).toBe(0);
    expect(phaseProgress(0.9, 0.3, 0.8)).toBe(1);
    expect(phaseProgress(0.55, 0.3, 0.8)).toBeGreaterThan(0);
    expect(phaseProgress(0.55, 0.3, 0.8)).toBeLessThan(1);
  });
  it("does not enable 3D for small screens, reduced motion, or data saving", () => {
    expect(shouldEnableScene({ wideEnough: true, reducedMotion: false })).toBe(true);
    expect(shouldEnableScene({ wideEnough: false, reducedMotion: false })).toBe(false);
    expect(shouldEnableScene({ wideEnough: true, reducedMotion: true })).toBe(false);
    expect(shouldEnableScene({ wideEnough: true, reducedMotion: false, saveData: true })).toBe(false);
  });
});
