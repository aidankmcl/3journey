
import { forwardRef, useMemo, useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

import cookieVert from './cookie.vert';
import cookieFrag from './cookie.frag';


type CookieProps = ThreeElements['mesh'] & {
  side?: THREE.Side
}

export const Cookie = forwardRef<THREE.Mesh, CookieProps>(({ side = THREE.FrontSide, ...props }, ref) => {
  // This reference will give us direct access to the THREE.Mesh object
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uLightPos: { value: new THREE.Vector3(0, 0, 0) },
    uLightTarget: { value: new THREE.Vector3(0, 0, 0) },
    uLightAngle: { value: Math.PI / 16 }
  }), []);

  // // Subscribe this component to the render-loop
  useFrame(() => {
    // if (matRef.current) {
      // matRef.current.uniforms.uLightPos.value = [0, 0, 0];
      // matRef.current.uniforms.uLightPos.value = [0, 0, 0];
    // }
  });

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
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});
