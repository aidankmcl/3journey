
import { forwardRef, useMemo, useRef } from 'react';
import { type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

import cookieVert from './cookie.vert';
import cookieFrag from './cookie.frag';
import { type DiscoUniforms } from './discoUniforms';

type CookieProps = ThreeElements['mesh'] & {
  side?: THREE.Side;
  discoUniforms?: DiscoUniforms;
}

export const Cookie = forwardRef<THREE.Mesh, CookieProps>(({ side = THREE.FrontSide, discoUniforms, ...props }, ref) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Merge shared disco uniforms with any local uniforms
  const uniforms = useMemo(() => ({
    uLightPos: discoUniforms?.uLightPos ?? { value: new THREE.Vector3(0, 0, 0) },
    uLightTarget: { value: new THREE.Vector3(0, 0, 0) },
    uLightAngle: { value: Math.PI / 16 }
  }), [discoUniforms]);

  return (
    <mesh {...props} ref={ref}>
      {props.children}

      <shaderMaterial
        ref={matRef}
        vertexShader={cookieVert}
        fragmentShader={cookieFrag}
        uniforms={uniforms}
        side={side}
        transparent={true}
      />
    </mesh>
  );
});

export { VolumetricCookie } from './VolumetricCookie';
export { createDiscoUniforms, setDiscoLightPos, type DiscoUniforms } from './discoUniforms';
