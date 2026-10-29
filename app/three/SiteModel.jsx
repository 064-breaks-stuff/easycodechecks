import React from "react";

function Block({ resources, position, scale, material = "building", outlined = true }) {
  return (
    <group position={position} scale={scale}>
      <mesh geometry={resources.box} material={resources.materials[material]} />
      {outlined && <lineSegments geometry={resources.edges} material={resources.materials.edge} />}
    </group>
  );
}

export default function SiteModel({ resources, buildingRef, signsRef, guidesRef }) {
  return (
    <group dispose={null}>
      <Block resources={resources} position={[0, -0.12, 0]} scale={[6.8, 0.18, 5.4]} material="ground" />
      <lineSegments geometry={resources.grid} material={resources.materials.grid} />

      <group ref={buildingRef} scale={[1, 0.01, 1]}>
        <group position={[0.6, 0, -0.4]}>
          <Block resources={resources} position={[0, 0.8, 0]} scale={[2.9, 1.6, 2.05]} />
          <Block resources={resources} position={[0, 1.66, 0]} scale={[3.05, 0.12, 2.2]} material="roof" />
          <Block resources={resources} position={[-0.85, 0.57, 1.038]} scale={[0.66, 1.12, 0.025]} material="dark" />
          <Block resources={resources} position={[0.55, 0.6, 1.038]} scale={[1.62, 0.78, 0.025]} material="dark" />
          <Block resources={resources} position={[0.55, 0.6, 1.057]} scale={[0.025, 0.78, 0.012]} material="trim" outlined={false} />
          <Block resources={resources} position={[0.08, 0.6, 1.057]} scale={[0.025, 0.78, 0.012]} material="trim" outlined={false} />
          <Block resources={resources} position={[-1.46, 0.75, -0.18]} scale={[0.025, 0.64, 0.95]} material="dark" />
        </group>
        <group position={[2.55, 0, -1.0]}>
          <Block resources={resources} position={[0, 0.76, -0.57]} scale={[0.07, 1.52, 0.07]} material="trim" />
          <Block resources={resources} position={[0, 0.76, 0.57]} scale={[0.07, 1.52, 0.07]} material="trim" />
          <Block resources={resources} position={[0, 1.53, 0]} scale={[0.9, 0.09, 1.65]} material="roof" />
        </group>
      </group>

      <group ref={signsRef} scale={[1, 0.01, 1]}>
        <Block resources={resources} position={[0.6, 1.28, 0.65]} scale={[1.9, 0.34, 0.045]} material="lime" />
        <group position={[-2.05, 0, 1.45]}>
          <Block resources={resources} position={[0, 0.08, 0]} scale={[0.95, 0.16, 0.52]} material="roof" />
          <Block resources={resources} position={[0, 0.78, 0]} scale={[0.74, 1.24, 0.32]} />
          <Block resources={resources} position={[0, 1.04, 0.18]} scale={[0.62, 0.4, 0.025]} material="lime" />
          <Block resources={resources} position={[0, 0.53, 0.18]} scale={[0.5, 0.035, 0.025]} material="trim" outlined={false} />
        </group>
        <group position={[1.9, 0, 1.7]}>
          <Block resources={resources} position={[0, 0.42, 0]} scale={[0.065, 0.84, 0.065]} material="trim" />
          <Block resources={resources} position={[0, 0.91, 0]} scale={[0.7, 0.32, 0.075]} material="lime" />
          <Block resources={resources} position={[0, 0.91, 0.045]} scale={[0.33, 0.025, 0.012]} material="dark" outlined={false} />
        </group>
      </group>

      <group ref={guidesRef} scale={0.01}>
        <lineSegments geometry={resources.guides} material={resources.materials.guide} />
      </group>
    </group>
  );
}
