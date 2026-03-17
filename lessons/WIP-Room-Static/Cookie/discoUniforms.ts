
import * as THREE from 'three';

export type DiscoUniforms = {
  uLightPos: { value: THREE.Vector3 };
};

// Create shared uniforms once - mutate .value directly, no re-renders
export function createDiscoUniforms(initialPos: THREE.Vector3Tuple = [0, 0, 0]): DiscoUniforms {
  return {
    uLightPos: { value: new THREE.Vector3(...initialPos) },
  };
}

// Hook for components to use - just returns the same object reference
export function useDiscoUniforms(shared: DiscoUniforms) {
  return shared;
}

// Helper to update light position (call in useFrame)
export function setDiscoLightPos(uniforms: DiscoUniforms, x: number, y: number, z: number) {
  uniforms.uLightPos.value.set(x, y, z);
}
