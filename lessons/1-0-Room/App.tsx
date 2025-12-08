
import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { Cookie, VolumetricCookie } from './Cookie';


function Scene() {
  const [lightTarget] = useState<THREE.Group | null>(null);

  useFrame(() => {
    if (lightTarget) {
      lightTarget.rotation.x += 0.01;
      lightTarget.rotation.y += 0.01;
    }
  });

  return <>
    <ambientLight intensity={0.25} />

    {/* Volumetric beams - instanced cones */}
    <VolumetricCookie 
      position={[0, 0, 0]} 
      coneLength={5}
      coneRadius={0.2}
    />

    {/* Room */}
    <Cookie position={[0, 0, 0]} side={THREE.BackSide}>
      <boxGeometry args={[8, 3, 10]} />
    </Cookie>

    <mesh>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial color="black" />
    </mesh>


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
