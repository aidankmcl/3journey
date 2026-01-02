
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import portalURL from './portal-keys.glb';
import textureURL from './baked.jpg';

import fragmentShader from './shaders/frag.glsl';
import vertexShader from './shaders/vert.glsl';
import { useMemo } from 'react';


export function Portal() {
  const { nodes } = useGLTF(portalURL);

  const texture = useTexture(textureURL);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  const uniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0),
    uDarkColor: new THREE.Uniform(new THREE.Color('#4cff4f')),
    uLightColor: new THREE.Uniform(new THREE.Color('#d7ffdf')),
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <>
    <mesh
      geometry={(nodes['monitorscreen'] as unknown as { geometry: THREE.BufferGeometry }).geometry}
      rotation={nodes['monitorscreen'].rotation}
      position={nodes['monitorscreen'].position}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
    <mesh
      geometry={(nodes['main'] as unknown as { geometry: THREE.BufferGeometry }).geometry}
      rotation={nodes['main'].rotation}
      position={nodes['main'].position}
    >
      <meshBasicMaterial map={texture} />
    </mesh>
  </>
}
