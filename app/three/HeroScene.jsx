import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { clamp, phaseProgress } from "../lib/motion-config.js";
import { createSceneResources } from "./scene-resources.js";
import SiteModel from "./SiteModel.jsx";

export default function HeroScene({ active, pointerRef, wakeRef, onReady }) {
  const groupRef = useRef(null);
  const buildingRef = useRef(null);
  const signsRef = useRef(null);
  const guidesRef = useRef(null);
  const elapsed = useRef(0);
  const reportedReady = useRef(false);
  const readyFrame = useRef(null);
  const resources = useMemo(() => createSceneResources(), []);
  const { camera, size, invalidate } = useThree();

  useEffect(() => () => resources.dispose(), [resources]);

  useEffect(() => {
    camera.position.set(6.2, 4.9, 6.2);
    camera.lookAt(0, 0.35, 0);
    camera.zoom = Math.min(size.width / 9.8, size.height / 8.5);
    camera.updateProjectionMatrix();
    if (active) invalidate();
  }, [camera, size.width, size.height, active, invalidate]);

  useEffect(() => {
    wakeRef.current = () => { if (active) invalidate(); };
    if (active) invalidate();
    return () => { wakeRef.current = null; };
  }, [wakeRef, active, invalidate]);

  useEffect(() => () => {
    if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current);
  }, []);

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;
    if (!reportedReady.current) {
      reportedReady.current = true;
      readyFrame.current = requestAnimationFrame(() => {
        readyFrame.current = null;
        onReady();
      });
    }

    const dt = clamp(delta, 0.001, 0.05);
    elapsed.current += dt;
    const progress = clamp(elapsed.current / 1.9, 0, 1);
    buildingRef.current.scale.y = Math.max(0.01, phaseProgress(progress, 0, 0.68));
    signsRef.current.scale.y = Math.max(0.01, phaseProgress(progress, 0.32, 0.88));
    guidesRef.current.scale.setScalar(Math.max(0.01, phaseProgress(progress, 0.62, 1)));

    const targetY = 0.06 + pointerRef.current.x * 0.085;
    const targetX = pointerRef.current.y * 0.025;
    const blend = 1 - Math.exp(-dt * 8);
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * blend;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * blend;
    const moving = Math.abs(targetY - groupRef.current.rotation.y) + Math.abs(targetX - groupRef.current.rotation.x) > 0.00025;
    if (progress < 1 || moving) state.invalidate();
  });

  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[-3, 6, 4]} intensity={3.2} color="#f0f4d7" />
      <directionalLight position={[4, 3, -3]} intensity={1.1} color="#b7d7b1" />
      <group ref={groupRef} rotation={[0, 0.06, 0]}>
        <SiteModel resources={resources} buildingRef={buildingRef} signsRef={signsRef} guidesRef={guidesRef} />
      </group>
    </>
  );
}
