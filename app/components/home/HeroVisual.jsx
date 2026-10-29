import React, { useCallback, useEffect, useRef, useState } from "react";
import SitePlan from "./SitePlan.jsx";
import SceneBoundary from "../../three/SceneBoundary.jsx";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import usePageVisibility from "../../hooks/usePageVisibility.js";
import useInView from "../../hooks/useInView.js";
import { clamp, shouldEnableScene } from "../../lib/motion-config.js";
import styles from "../../styles/scene.module.css";

function supportsWebGL2() {
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const wakeRef = useRef(null);
  const wideEnough = useMediaQuery("(min-width: 640px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const visible = usePageVisibility();
  const nearViewport = useInView(containerRef, "160px");
  const inViewport = useInView(containerRef);
  const [CanvasComponent, setCanvasComponent] = useState(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [saveData, setSaveData] = useState(true);

  useEffect(() => {
    setSaveData(Boolean(navigator.connection?.saveData));
  }, []);

  const enabled = shouldEnableScene({ wideEnough, reducedMotion, saveData });
  const active = enabled && visible && inViewport && !failed;

  useEffect(() => {
    if (!enabled || !nearViewport || !visible || failed || CanvasComponent) return undefined;
    let cancelled = false;
    if (!supportsWebGL2()) {
      setFailed(true);
      return undefined;
    }
    import("../../three/HeroCanvas.client.jsx").then((module) => {
      if (!cancelled) setCanvasComponent(() => module.default);
    }).catch((error) => {
      if (!cancelled) {
        setFailed(true);
        console.warn("3D enhancement unavailable; using the static site illustration.", error);
      }
    });
    return () => { cancelled = true; };
  }, [enabled, nearViewport, visible, failed, CanvasComponent]);

  useEffect(() => {
    if (!enabled) setReady(false);
  }, [enabled]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback(() => {
    setReady(false);
    setFailed(true);
  }, []);

  function handlePointerMove(event) {
    if (!active || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    pointerRef.current.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    wakeRef.current?.();
  }

  function handlePointerLeave() {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    if (active) wakeRef.current?.();
  }

  return (
    <div ref={containerRef} className={styles.visual} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <SitePlan sceneReady={enabled && ready && !failed}>
        {enabled && CanvasComponent && !failed && (
          <div className={`${styles.canvasLayer} ${ready ? styles.canvasVisible : ""}`} aria-hidden="true">
            <SceneBoundary onFailure={handleFailure}>
              <CanvasComponent active={active} pointerRef={pointerRef} wakeRef={wakeRef} onReady={handleReady} onFailure={handleFailure} />
            </SceneBoundary>
          </div>
        )}
      </SitePlan>
    </div>
  );
}
