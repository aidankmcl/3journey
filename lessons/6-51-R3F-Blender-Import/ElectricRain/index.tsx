import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei';

import vertexShader from './shaders/vert.glsl';
import fragmentShader from './shaders/frag.glsl';
import textureURL from './shaders/glyphs.jpg';


export function ElectricRain() {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const count = 50;

  const glyphs = useTexture(textureURL);

  const randomOffsets = useMemo(() => {
    const array = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      array[i] = Math.random() // Random start time/offset
    }
    return array
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0),
    uColor: new THREE.Uniform(new THREE.Color('#00ff00')),
    uScale: new THREE.Uniform(new THREE.Vector3(0.075, 1.5, 1.0)),
    uGlyphsTexture: new THREE.Uniform(glyphs),
  }), [glyphs]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i=0; i<count; i++) {
      meshRef.current.setMatrixAt(i, new THREE.Matrix4(
        1, 1, 1, Math.random() * 10 - 5,
        1, 1, 1, Math.random() * 5 + 0.75,
        1, 1, 1, Math.random() * 10 - 5,
        1, 1, 1, 1,
      ))
    }
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[, , count]}>

      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute 
          attach="attributes-aDropOffset"
          args={[randomOffsets, 1]}
        />
      </planeGeometry>

      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending} 
        uniforms={uniforms}
      />
    </instancedMesh>
  )
}