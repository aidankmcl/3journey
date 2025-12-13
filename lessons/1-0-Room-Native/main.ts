import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import '~/styles/style.css';

import { SCENE_CONFIG, ANIMATION_CONFIG } from './config';
import { ShadowSystem } from './shadowSystem';
import { createCookieUniforms, createShadowCookieUniforms } from './materials';
import { createSceneObjects, addObjectsToScene } from './sceneObjects';
import { CameraDirector, shots } from './camera';

// ============================================================================
// Initialize Systems
// ============================================================================

const shadowSystem = new ShadowSystem();

// ============================================================================
// Shared Uniforms
// ============================================================================

const uniforms = createCookieUniforms(SCENE_CONFIG.discoBall.position);
const shadowUniforms = createShadowCookieUniforms(uniforms, shadowSystem.texture);

// ============================================================================
// Scene Setup
// ============================================================================

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

// Create and add all scene objects
const sceneObjects = createSceneObjects(uniforms, shadowUniforms);
addObjectsToScene(scene, sceneObjects);

const { volumetricMesh, discoBall, box, shadowCasters, excludeFromShadow } = sceneObjects;

// ============================================================================
// Camera & Controls
// ============================================================================

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-5, 0, 0);
camera.lookAt(discoBall.position);
scene.add(camera);

// Toggle between CameraDirector (production) and OrbitControls (development)
const USE_CAMERA_DIRECTOR = true;

// Camera Director for choreographed shots
const cameraDirector = USE_CAMERA_DIRECTOR
  ? new CameraDirector(camera, shots, { autoAdvance: true, loop: true })
  : null;

// OrbitControls for development/debugging
const controls = !USE_CAMERA_DIRECTOR
  ? new OrbitControls(camera, canvas)
  : null;

if (controls) {
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
}

// ============================================================================
// Renderer
// ============================================================================

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ============================================================================
// Resize Handler
// ============================================================================

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================================================
// Animation Loop
// ============================================================================

const clock = new THREE.Clock();

function tick() {
  const elapsedTime = clock.getElapsedTime();

  // Animate Y-axis rotation of the disco light pattern
  uniforms.uRotation.value = elapsedTime * ANIMATION_CONFIG.rotationSpeed;
  
  // Rotate volumetric mesh to match
  volumetricMesh.rotation.y = uniforms.uRotation.value;

  box.rotation.y = uniforms.uRotation.value;
  box.position.y = Math.sin(elapsedTime) * 0.5;
  
  // Render shadow map first
  shadowSystem.render(
    renderer,
    scene,
    uniforms.uLightPos.value,
    shadowCasters,
    excludeFromShadow
  );

  // Update camera (director or orbit controls)
  if (cameraDirector) {
    cameraDirector.update(elapsedTime);
  } else if (controls) {
    controls.update();
  }

  // Render main scene
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
