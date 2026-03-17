
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { Perf } from 'r3f-perf';

import { Portal } from './Portal';
import { ElectricRain } from './ElectricRain';



function Scene() {
  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[1, 1, 1]} intensity={1} />

    <Suspense>
      <ElectricRain />
      <Portal />
    </Suspense>
  </>
}


function App() {
  return (
    <Canvas camera={{
      position: [7, 5, 6]
    }}>
      {/* <Perf position='top-left' /> */}
      <color attach="background" args={['#090f06']} />
      <OrbitControls enableDamping dampingFactor={0.05} />

      <Scene />
    </Canvas>
  );
}

export default App;
