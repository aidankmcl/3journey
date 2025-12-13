import * as THREE from 'three';

// ============================================================================
// Shadow Configuration
// ============================================================================

export const SHADOW_CONFIG = {
  mapSize: 1024,
  near: 0.5,
  far: 20,
} as const;

// ============================================================================
// Scene Configuration
// ============================================================================

export const SCENE_CONFIG = {
  room: {
    dimensions: [12, 4, 10] as const,
    position: new THREE.Vector3(2.5, 0.5, 0),
  },
  discoBall: {
    radius: 0.25,
    position: new THREE.Vector3(0, -1, 0),
  },
  volumetric: {
    coneLength: 5,
    coneRadius: 0.4,
  },
  props: {
    sphere: {
      radius: 1,
      position: new THREE.Vector3(0, 2, -2),
    },
    box: {
      size: 1,
      position: new THREE.Vector3(0, 0, -3),
    },
  },
} as const;

// ============================================================================
// Animation Configuration
// ============================================================================

export const ANIMATION_CONFIG = {
  rotationSpeed: 0.4,
} as const;
