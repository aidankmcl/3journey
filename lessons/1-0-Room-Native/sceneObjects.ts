import * as THREE from 'three';
import { SCENE_CONFIG } from './config';
import { createVolumetricCones } from './createVolumetricCones';
import type { CookieUniforms, ShadowCookieUniforms } from './materials';
import { createCookieMaterial, createShadowCookieMaterial } from './materials';

// ============================================================================
// Scene Objects
// ============================================================================

export interface SceneObjects {
  volumetricMesh: THREE.InstancedMesh;
  room: THREE.Mesh;
  discoBall: THREE.Mesh;
  sphere: THREE.Mesh;
  box: THREE.Mesh;
  shadowCasters: THREE.Mesh[];
  excludeFromShadow: THREE.Object3D[];
}

/**
 * Create all scene objects with their materials
 */
export function createSceneObjects(
  uniforms: CookieUniforms,
  shadowUniforms: ShadowCookieUniforms
): SceneObjects {
  const config = SCENE_CONFIG;

  // Volumetric beams (excluded from shadow pass)
  const volumetricMesh = createVolumetricCones(
    config.volumetric.coneLength,
    config.volumetric.coneRadius
  );
  volumetricMesh.position.copy(uniforms.uLightPos.value);

  // Room with shadow-enabled cookie material
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(...config.room.dimensions),
    createShadowCookieMaterial(shadowUniforms, { side: THREE.BackSide })
  );
  room.position.copy(config.room.position);

  // Disco ball visual
  const discoBall = new THREE.Mesh(
    new THREE.SphereGeometry(config.discoBall.radius, 16, 16),
    new THREE.MeshBasicMaterial({ color: 'black' })
  );
  discoBall.position.copy(uniforms.uLightPos.value);

  // Props (these cast shadows)
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(config.props.sphere.radius, 32, 32),
    createCookieMaterial(uniforms, {
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    })
  );
  sphere.position.copy(config.props.sphere.position);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(
      config.props.box.size,
      config.props.box.size,
      config.props.box.size
    ),
    createCookieMaterial(uniforms, {
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    })
  );
  box.position.copy(config.props.box.position);

  return {
    volumetricMesh,
    room,
    discoBall,
    sphere,
    box,
    shadowCasters: [sphere, box, discoBall],
    excludeFromShadow: [volumetricMesh, room],
  };
}

/**
 * Add all scene objects to the scene
 */
export function addObjectsToScene(scene: THREE.Scene, objects: SceneObjects): void {
  scene.add(objects.volumetricMesh);
  scene.add(objects.room);
  scene.add(objects.discoBall);
  scene.add(objects.sphere);
  scene.add(objects.box);
}
