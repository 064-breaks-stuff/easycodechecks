import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import HeroScene from "./HeroScene.jsx";

export default function HeroCanvas({ active, pointerRef, wakeRef, onReady, onFailure }) {
  const removeContextListener = useRef(null);

  useEffect(() => () => {
    removeContextListener.current?.();
  }, []);

  return (
    <Canvas
      orthographic
      style={{ pointerEvents: "none" }}
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [6.2, 4.9, 6.2], zoom: 50, near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.setClearColor("#18362b", 0);
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        const canvas = gl.domElement;
        canvas.setAttribute("aria-hidden", "true");
        canvas.setAttribute("tabindex", "-1");
        const handleLoss = (event) => {
          event.preventDefault();
          onFailure();
        };
        canvas.addEventListener("webglcontextlost", handleLoss);
        removeContextListener.current?.();
        removeContextListener.current = () => canvas.removeEventListener("webglcontextlost", handleLoss);
      }}
    >
      <HeroScene active={active} pointerRef={pointerRef} wakeRef={wakeRef} onReady={onReady} />
    </Canvas>
  );
}
