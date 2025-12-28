
import { Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';
import { Perf } from 'r3f-perf';

import { Helmet } from './Helmet';
import { Burger } from './Burger';

import foxURL from '~/models/Fox/glTF/Fox.gltf?url';
import { Fox } from './Fox';


function Scene() {
  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[1, 1, 1]} intensity={1} />

    <Suspense>
      <Fox />
    </Suspense>

    <Suspense>
      <Burger />
    </Suspense>

    <Suspense>
      <Helmet />
    </Suspense>

    <mesh rotation-x={-Math.PI * 0.5}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="ivory" />
    </mesh>
  </>
}


function App() {
  return (
    <Canvas camera={{
      position: [5, 3, 5]
    }}>
      <Perf position='top-left' />
      {/* <color attach="background" args={['black']} /> */}
      <OrbitControls enableDamping dampingFactor={0.05} />

      <Scene />
    </Canvas>
  );
}

export default App;
