import * as THREE from 'three';
import type { EasingFunction } from './easing';
import { defaultEasing } from './easing';

// ============================================================================
// Shot Types
// ============================================================================

export interface CameraShot {
  /** Unique name for this shot (useful for debugging/manual triggering) */
  name: string;
  /** Camera position in world space */
  position: THREE.Vector3;
  /** Point the camera looks at */
  lookAt: THREE.Vector3;
  /** How long to hold this shot (seconds) before auto-advancing */
  duration: number;
  /** Time to transition INTO this shot (seconds). Default: 1.5 */
  transitionIn?: number;
  /** Easing function for the transition. Default: easeInOutCubic */
  easing?: EasingFunction;
}

// ============================================================================
// Shot Definitions
// ============================================================================

/**
 * Define your static camera shots here.
 * The camera will cycle through these in order, transitioning smoothly.
 */
export const shots: CameraShot[] = [
  {
    name: 'close-up',
    position: new THREE.Vector3(-1, -1, 0),
    lookAt: new THREE.Vector3(0, -1, 0),
    duration: 8,
    transitionIn: 2,
  },
  {
    name: 'wide-front',
    position: new THREE.Vector3(-4, 0, 0),
    lookAt: new THREE.Vector3(0, -1, 0),
    duration: 8,
    transitionIn: 2,
  },
  {
    name: 'corner-high',
    position: new THREE.Vector3(-3, 2, 3),
    lookAt: new THREE.Vector3(0, -1, 0),
    duration: 6,
    transitionIn: 1.5,
  },
  {
    name: 'low-angle',
    position: new THREE.Vector3(-2, -1, 2),
    lookAt: new THREE.Vector3(0, 0, 0),
    duration: 6,
    transitionIn: 1.5,
  },
  {
    name: 'side-profile',
    position: new THREE.Vector3(0, 0, 5),
    lookAt: new THREE.Vector3(0, -1, 0),
    duration: 6,
    transitionIn: 2,
  },
  {
    name: 'overhead',
    position: new THREE.Vector3(0, 3, 0.1),
    lookAt: new THREE.Vector3(0, -1, 0),
    duration: 5,
    transitionIn: 2,
  },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get a shot by name
 */
export function getShotByName(name: string): CameraShot | undefined {
  return shots.find((shot) => shot.name === name);
}

/**
 * Create a custom shot on the fly
 */
export function createShot(
  name: string,
  position: [number, number, number],
  lookAt: [number, number, number],
  duration: number,
  transitionIn = 1.5,
  easing: EasingFunction = defaultEasing
): CameraShot {
  return {
    name,
    position: new THREE.Vector3(...position),
    lookAt: new THREE.Vector3(...lookAt),
    duration,
    transitionIn,
    easing,
  };
}
