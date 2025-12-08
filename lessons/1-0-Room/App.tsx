
import { useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

import { Cookie } from './Cookie';

const VolumetricMaterial = shaderMaterial(
  { color: new THREE.Color('white'), opacity: 1.0 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform vec3 color;
    uniform float opacity;
    void main() {
      float fade = 1.0 - vUv.y;
      fade = pow(fade, 2.0);
      gl_FragColor = vec4(color, opacity * fade);
    }
  `
)

extend({ VolumetricMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    volumetricMaterial: ThreeElements['shaderMaterial'] & {
      color?: THREE.ColorRepresentation;
      opacity?: number;
    }
  }
}


function Scene() {
  const [lightTarget, setLightTarget] = useState<THREE.Group | null>(null);

  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lightTarget) {
      lightTarget.rotation.x += 0.01;
      lightTarget.rotation.y += 0.01;
    }
  });

  return <>
    <ambientLight intensity={0.25} />

    {/* Room */}
    <Cookie position={[0, 0, 0]} side={THREE.BackSide}>
      <boxGeometry args={[8, 3, 10]} />
    </Cookie>


    {/* Props */}
    <Cookie position={[-2, 2, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
    </Cookie>

    <Cookie position={[-3, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
    </Cookie>
  </>
}


function App() {
  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <OrbitControls enableDamping dampingFactor={0.05} />

      <Scene />
    </Canvas>
  );
}

export default App;
