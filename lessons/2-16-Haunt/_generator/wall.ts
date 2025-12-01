import * as THREE from 'three'

interface Props {
  width: number;
  height: number;
  depth?: number;
}

export const Wall = (data: Props) => {
  const { width, height } = data;
  const depth = data.depth ?? 0.15;

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial()
  )

  return wall;
}
