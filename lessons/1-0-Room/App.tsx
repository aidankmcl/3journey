
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, SpotLight } from '@react-three/drei'; // Import OrbitControls from Drei
import * as THREE from 'three';

import { LitMesh } from '~/r3f/LitMesh';


function Scene() {
  const [lightTarget, setLightTarget] = useState<THREE.Group | undefined>();
  const [lightA, setLightA] = useState<THREE.SpotLight | null>(null);
  const [lightB, setLightB] = useState<THREE.SpotLight | null>(null);

  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lightTarget) {
      lightTarget.rotation.x += 0.01;
      lightTarget.rotation.y += 0.01;
    }
  });

  return <>
    <group ref={setLightTarget} position={[0, 0, 0]}>
      <SpotLight
        ref={setLightA}
        position={[0, 2, 0]}
        target={lightTarget}
        distance={10}
        intensity={1}
        angle={Math.PI / 4}
        anglePower={10}
        attenuation={3}
        color="#ffffff"
      />

      <SpotLight
        ref={setLightB}
        position={[2, 0, 0]}
        target={lightTarget}
        distance={10}
        intensity={1}
        angle={Math.PI / 4}
        anglePower={10}
        attenuation={3}
        color="#ffffff"
      />
    </group>

    <LitMesh position={[0, 0, 0]} light={lightA}>
      <sphereGeometry args={[0.8]} />
    </LitMesh>

    <LitMesh position={[0, 0, 0]} light={lightB} ref={boxRef}>
      <boxGeometry args={[1, 1, 1]} />
    </LitMesh>
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
