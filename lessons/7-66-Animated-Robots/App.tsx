
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
import { Perf } from 'r3f-perf';

import { Robots } from './components/Robots';


function Scene() {
  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[1, 1, 1]} intensity={1} />

    <Suspense>
      <Robots />
    </Suspense>

    <mesh rotation-x={-Math.PI * 0.5}>
      <planeGeometry args={[100, 100]} />
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

      <KeyboardControls
        map={[
          { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
          { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
          { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
          { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
          { name: 'hit', keys: [ 'Space' ] },
        ]}
      >
        <Scene />
      </KeyboardControls>
    </Canvas>
  );
}

export default App;
