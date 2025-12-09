
import { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { Cookie, VolumetricCookie, createDiscoUniforms } from './Cookie';


function Scene() {
  // Create shared uniforms once - all components reference the same object
  const discoUniforms = useMemo(() => createDiscoUniforms([0, 1, 0]), []);

  // Example: animate light position (or set it statically)
  useFrame(({ clock }) => {
    // Uncomment to animate:
    // const t = clock.getElapsedTime();
    // discoUniforms.uLightPos.value.set(Math.sin(t) * 2, 0, Math.cos(t) * 2);
    
    // Or set statically (no re-render needed):
    // discoUniforms.uLightPos.value.set(0, 0, 0);
  });

  return <>
    {/* <ambientLight intensity={0.25} /> */}

    {/* Volumetric beams - instanced cones */}
    <VolumetricCookie  
      discoUniforms={discoUniforms}
      coneLength={5}
      coneRadius={0.2}
    />

    {/* Room */}
    <Cookie position={[0, 0, 0]} side={THREE.BackSide} discoUniforms={discoUniforms}>
      <boxGeometry args={[8, 3, 10]} />
    </Cookie>

    {/* Disco ball visual */}
    <mesh>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial color="black" />
    </mesh>

    {/* Props */}
    <Cookie position={[-2, 2, 0]} discoUniforms={discoUniforms}>
      <sphereGeometry args={[1, 32, 32]} />
    </Cookie>

    <Cookie position={[-3, 0, 0]} discoUniforms={discoUniforms}>
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
