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

export interface Options {
  width: number;
  length: number;
  height: number;
}

export const DEFAULTS = {
  width: BASE_WIDTH,
  length: BASE_LENGTH,
  height: BASE_HEIGHT
} satisfies Options;

export function Door(options: Options = DEFAULTS) {
  const { width, length, height } = options;
  // Door
  // This mat needs light
  const doorMat = new THREE.MeshStandardMaterial({
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    map: doorColorTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture
  });
  // const doorMat = new THREE.MeshBasicMaterial({
  //   alphaMap: doorAlphaTexture,
  //   aoMap: doorAOTexture,
  //   map: doorColorTexture
  // });
  const repeat = new THREE.Vector2(0.6, 1);
  const offset = new THREE.Vector2(0.2, 0);
  [doorMat.alphaMap, doorMat.aoMap, doorMat.map, doorMat.metalnessMap, doorMat.roughnessMap, doorMat.normalMap].forEach((t) => {
    if (!t) return;
    t.repeat.copy(repeat);
    t.offset.copy(offset);
  });
  const doorGeom = new THREE.BoxGeometry(width / 3, height * 2 / 3, 0.25);
  const doorMesh = new THREE.Mesh(doorGeom, doorMat);
  doorMesh.position.set(0, height / 2, 0);

  return doorMesh;
}