import * as THREE from 'three';

import doorAlpha from '~/textures/door/alpha.jpg';
import doorAO from '~/textures/door/ambientOcclusion.jpg';
import doorColor from '~/textures/door/color.jpg';
import doorHeight from '~/textures/door/height.jpg';
import doorMetalness from '~/textures/door/metalness.jpg';
import doorNormal from '~/textures/door/normal.jpg';
import doorRoughness from '~/textures/door/roughness.jpg';

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
const [
  doorAlphaTexture,
  doorAOTexture,
  doorColorTexture,
  doorHeightTexture,
  doorMetalnessTexture,
  doorNormalTexture,
  doorRoughnessTexture
] = [
  doorAlpha,
  doorAO,
  doorColor,
  doorHeight,
  doorMetalness,
  doorNormal,
  doorRoughness
].map(url => textureLoader.load(url));

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
doorColorTexture.minFilter = THREE.NearestFilter;

const BASE_WIDTH = 3;
const BASE_LENGTH = 3;
const BASE_HEIGHT = 3;

const ROOF_HEIGHT = 2;
const ROOF_OVERHANG = 1;

export interface Options {
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

export const DEFAULTS = {
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

  // Base
  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(base.width, base.height, base.length),
    new THREE.MeshBasicMaterial({ color: 0xa4122a })
  );
  baseMesh.position.setY(base.height / 2);
  house.add(baseMesh);

  // Roof
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

  // Door
  // This mat needs light
  // const doorMat = new THREE.MeshStandardMaterial({
  //   alphaMap: doorAlphaTexture,
  //   aoMap: doorAOTexture,
  //   map: doorColorTexture,
  //   metalnessMap: doorMetalnessTexture,
  //   roughnessMap: doorRoughnessTexture,
  //   normalMap: doorNormalTexture
  // });
  const doorMat = new THREE.MeshBasicMaterial({
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    map: doorColorTexture
  });
  const repeat = new THREE.Vector2(0.6, 1);
  const offset = new THREE.Vector2(0.2, 0);
  [doorMat.alphaMap, doorMat.aoMap, doorMat.map].forEach((t) => {
    if (!t) return;
    t.repeat.copy(repeat);
    t.offset.copy(offset);
  });
  const doorGeom = new THREE.BoxGeometry(base.width / 3, base.height * 2 / 3, 0.25);
  const doorMesh = new THREE.Mesh(doorGeom, doorMat);
  doorMesh.position.set(0, base.height / 3, -base.length / 2);
  house.add(doorMesh);

  return house;
}