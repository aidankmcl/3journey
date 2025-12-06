
import { forwardRef, useMemo, useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

import selectiveLightFrag from '~/shaders/selectiveLight.frag';
import selectiveLightVert from '~/shaders/selectiveLight.vert';


type LitMeshProps = ThreeElements['mesh'] & {
  light: THREE.SpotLight | null;
}

export const LitMesh = forwardRef<THREE.Mesh, LitMeshProps>(({ light, ...props }, ref) => {
  // This reference will give us direct access to the THREE.Mesh object
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uLightPos: { value: new THREE.Vector3(0, 0, 0) },
    uLightTarget: { value: new THREE.Vector3(0, 0, 0) },
    uLightAngle: { value: 0 }
  }), []);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(() => {
    if (light && matRef.current) {
      light.updateMatrixWorld();
      if (light.target) light.target.updateMatrixWorld();

      matRef.current.uniforms.uLightAngle.value = light.angle;

      light.getWorldPosition(matRef.current.uniforms.uLightPos.value);
      if (light.target) light.target.getWorldPosition(matRef.current.uniforms.uLightTarget.value);
    }
  });

  return (
    <mesh {...props} ref={ref}>
      {props.children}

      <shaderMaterial
        ref={matRef}
        transparent={true}
        depthWrite={false}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
        vertexShader={selectiveLightVert}
        fragmentShader={selectiveLightFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
});
