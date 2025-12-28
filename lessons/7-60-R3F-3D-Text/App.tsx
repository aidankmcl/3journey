
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

import font from '~/fonts/helvetiker_regular.typeface.json?url';
import { useEffect, useRef } from 'react';

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32)
const material = new THREE.MeshMatcapMaterial()


function Scene() {

  const donutGroup = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!donutGroup.current) return;

    for (const donut of donutGroup.current.children) {
      donut.rotation.y += delta * 0.2;
    }
  });

  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);
  useEffect(() => {
    matcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.needsUpdate = true;

    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);

  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[1, 1, 1]} intensity={1} />

    <Center>
      <Text3D
        material={material}
        font={font}
        size={0.75}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        HELLO R3F
        <meshMatcapMaterial matcap={matcapTexture} />
      </Text3D>
    </Center>

    <group ref={donutGroup}>
      {[...Array(100)].map((_, i) =>
        <mesh
          key={`donut-${i}`}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}
          rotation={[
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            0
          ]}
          scale={ 0.2 + Math.random() * 0.2 }
        >
          <meshMatcapMaterial matcap={ matcapTexture } />
        </mesh>
      )}
    </group>
  </>
}


function App() {
  return (
    <Canvas camera={{
      position: [5, 3, 5]
    }}>
      <Perf position='top-left' />
      <color attach="background" args={['rgba(245, 255, 230, 1)']} />
      <OrbitControls makeDefault dampingFactor={0.05} />

      <Scene />
    </Canvas>
  );
}

export default App;
