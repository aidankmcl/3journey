import * as THREE from 'three';

const BASE_WIDTH = 3;
const BASE_LENGTH = 3;
const BASE_HEIGHT = 3;

const ROOF_HEIGHT = 2;
const ROOF_OVERHANG = 1;

interface Options {
  base?: Partial<{
    width: number;
    length: number;
    height: number;
  }>;
  roof?: Partial<{
    height: number;
    overhang: number;
  }>
}

const DEFAULTS = {
  base: {
    width: BASE_WIDTH,
    length: BASE_LENGTH,
    height: BASE_HEIGHT
  },
  roof: {
    height: ROOF_HEIGHT,
    overhang: ROOF_OVERHANG
  }
} satisfies Options;

export function House(options: Options = DEFAULTS) {
  const { base, roof } = {
    base: { ...DEFAULTS.base, ...options.base },
    roof: { ...DEFAULTS.roof, ...options.roof }
  }

  const house = new THREE.Group();

  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(base.width, base.height, base.length),
    new THREE.MeshBasicMaterial({ color: 0xa4122a })
  );
  baseMesh.position.setY(base.height / 2);
  house.add(baseMesh);

  const roofShape = new THREE.Shape();
  const halfWidth = (base.width + roof.overhang) / 2;
  roofShape.moveTo(-halfWidth, 0);
  roofShape.lineTo(0, roof.height);
  roofShape.lineTo(halfWidth, 0);
  roofShape.lineTo(-halfWidth, 0);
  const roofGeometry = new THREE.ExtrudeGeometry(roofShape, {
    depth: 4
  });
  const roofMesh = new THREE.Mesh(
    roofGeometry,
    new THREE.MeshBasicMaterial({ color: 0x060142 })
  );
  roofMesh.position.set(0, base.height, -base.length + roof.overhang);
  house.add(roofMesh);

  return house;
}