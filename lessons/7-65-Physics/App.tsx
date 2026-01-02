
import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { Physics, RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';

import hitSoundURL from './hit.mp3';


function Scene() {

  const [hitSound] = useState(() => new Audio(hitSoundURL));

  const cube = useRef<RapierRigidBody | null>(null);
  const cubeJump = () => {
    if (!cube.current) return;

    const mass = cube.current.mass();
    cube.current.applyImpulse({ x: 0, y: mass * 5, z: 0 }, true);
    cube.current.applyTorqueImpulse({ x: mass * Math.random(), y: mass * Math.random(), z: mass * Math.random() }, true);
  }

  const twister = useRef<RapierRigidBody | null>(null);
  useFrame((state) => {
    if (!twister.current) return;

    const elapsed = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, elapsed * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twister.current.setNextKinematicRotation(quaternionRotation);

    const angle = elapsed * 0.5;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    twister.current.setNextKinematicTranslation({ x, y: -0.8, z })
  });

  const collisionEnter = () => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  }
  
  return <>
    <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
    <ambientLight intensity={ 1.5 } />

    <Physics debug>

      <RigidBody colliders="ball" position={[0, 2, 0 ]}>
        <mesh castShadow>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>


      <RigidBody
        ref={cube}
        position={[2, 2, 0]}
        gravityScale={0.8}
        restitution={0.5}
        friction={0.7}
        colliders={false}
        onCollisionEnter={collisionEnter}
        onCollisionExit={() => {
          console.log('meow')
        }}
      >
        <CuboidCollider args={[0.5, 0.5, 0.5]} mass={3} />
        <mesh castShadow onClick={cubeJump}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" friction={0.7}>
        <mesh receiveShadow position-y={ - 1.25 }>
            <boxGeometry args={ [ 10, 0.5, 10 ] } />
            <meshStandardMaterial color="greenyellow" />
        </mesh>
      </RigidBody>

      <RigidBody ref={twister} type="kinematicPosition" position={[0, -0.8, 0]}>
        <mesh castShadow scale={[0.4, 0.4, 3]}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

    </Physics>
  </>
}


function App() {
  return (
    <Canvas
      shadows
      camera={{
        position: [5, 3, 5]
      }}
    >
      <Perf position='top-left' />
      <color attach="background" args={['rgba(245, 255, 230, 1)']} />
      <OrbitControls makeDefault enableDamping={false} />

      <Scene />
    </Canvas>
  );
}

export default App;
