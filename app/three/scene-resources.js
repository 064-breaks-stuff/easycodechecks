import {
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";

export function createSceneResources() {
  const box = new BoxGeometry(1, 1, 1);
  const edges = new EdgesGeometry(box);
  const standard = (color, extra = {}) => new MeshStandardMaterial({ color, roughness: 0.88, metalness: 0.05, ...extra });
  const materials = {
    ground: standard("#1b3d30"),
    building: standard("#38644c"),
    roof: standard("#527c5d"),
    dark: standard("#102c24"),
    trim: standard("#84a58d"),
    lime: standard("#c7e879", { emissive: "#769742", emissiveIntensity: 0.18 }),
    edge: new LineBasicMaterial({ color: "#b4ceae", transparent: true, opacity: 0.38 }),
    grid: new LineBasicMaterial({ color: "#42634f", transparent: true, opacity: 0.6 }),
    guide: new LineBasicMaterial({ color: "#c7e879", transparent: true, opacity: 0.8 }),
  };

  const segments = [
    [-1.0, 0.06, 1.15], [2.25, 0.06, 1.15],
    [-1.0, 0.06, 1.04], [-1.0, 0.06, 1.27],
    [2.25, 0.06, 1.04], [2.25, 0.06, 1.27],
    [-2.65, 0.05, 1.45], [-2.65, 1.55, 1.45],
    [-2.77, 0.05, 1.45], [-2.53, 0.05, 1.45],
    [-2.77, 1.55, 1.45], [-2.53, 1.55, 1.45],
    [0.6, 1.32, 0.66], [0.6, 2.05, 1.1],
    [0.6, 2.05, 1.1], [1.65, 2.05, 1.1],
  ];
  const guides = new BufferGeometry().setFromPoints(segments.map((point) => new Vector3(...point)));

  const gridPoints = [];
  for (let index = 0; index <= 16; index += 1) {
    const coordinate = -3.2 + index * 0.4;
    if (Math.abs(coordinate) <= 2.4) gridPoints.push(new Vector3(-3.2, -0.022, coordinate), new Vector3(3.2, -0.022, coordinate));
    gridPoints.push(new Vector3(coordinate, -0.022, -2.4), new Vector3(coordinate, -0.022, 2.4));
  }
  const grid = new BufferGeometry().setFromPoints(gridPoints);

  return {
    box, edges, guides, grid, materials,
    dispose() {
      box.dispose();
      edges.dispose();
      guides.dispose();
      grid.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}
