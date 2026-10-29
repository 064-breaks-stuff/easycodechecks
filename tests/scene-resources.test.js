import { describe, expect, it } from "vitest";
import { createSceneResources } from "../app/three/scene-resources.js";

describe("procedural scene resources", () => {
  it("creates shared geometry without a WebGL renderer", () => {
    const resources = createSceneResources();
    try {
      expect(resources.box.isBufferGeometry).toBe(true);
      expect(resources.edges.isBufferGeometry).toBe(true);
      expect(resources.guides.getAttribute("position").count).toBe(16);
      expect(resources.materials.lime.isMeshStandardMaterial).toBe(true);
    } finally {
      resources.dispose();
    }
  });
  it("emits disposal for pooled resources", () => {
    const resources = createSceneResources();
    let disposed = 0;
    resources.box.addEventListener("dispose", () => { disposed += 1; });
    resources.materials.lime.addEventListener("dispose", () => { disposed += 1; });
    resources.dispose();
    expect(disposed).toBe(2);
  });
});
