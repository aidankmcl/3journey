
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useLoader, type ThreeToJSXElements } from '@react-three/fiber';
import { Bvh, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three/webgpu';
import { Stats } from '@react-three/drei';
import type { WebGPURendererParameters } from 'three/src/renderers/webgpu/WebGPURenderer.js';
import WebGPU from 'three/examples/jsm/capabilities/WebGPU.js';
import { useControls } from 'leva';

import { getBoidsSimulation } from './BoidsSimulation';

import jellyJamURL from './static/songs/jelly-jam.mp3';
// import lalalaURL from './static/songs/la-la-la.mp3';

import jellyfishURL from './static/jellyfish.glb';
import gradientURL from './static/fft-colors.jpg'; // Update this path

import './ui.css';

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

// @ts-ignore
extend(THREE as any)

const count = 10000;

function Scene() {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load the gradient texture
  const gradientTexture = useLoader(THREE.TextureLoader, gradientURL);

  const { updateBoids, colorNode, positionNode, uniforms, fftTexture } = useMemo(() => {
    return getBoidsSimulation(count, gradientTexture, 200, 100);
  }, [gradientTexture]);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setHasInteracted(true);
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying((playing) => !playing);
  }

  useEffect(() => {
    if (audioRef.current && !analyserRef.current && hasInteracted) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;

      const track = audioContext.createMediaElementSource(audioRef.current);
      track.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      audioContext.resume();
    }
  }, [hasInteracted]);

  const controls = useControls('Simulation Arguments', {
    perceptionRadius: { value: 3.5, min: 0.1, max: 10 },
    maxForce: { value: 0.1, min: 0.01, max: 0.5, step: 0.01 },
    maxSpeed: { value: 20, min: 0.1, max: 30 },
    separationWeight: { value: 2, min: 0.1, max: 5 },
    alignmentWeight: { value: 1.5, min: 0.1, max: 5 },
    cohesionWeight: { value: 2, min: 0.1, max: 5 }
  }, { collapsed: true });

  useFrame((state) => {
    if (analyserRef.current && dataArrayRef.current && fftTexture.image.data) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);
      
      const averagedData = new Float32Array(8);
      for (let i = 0; i < averagedData.length; i++) {
        averagedData[i] = (dataArrayRef.current[i * 2] + dataArrayRef.current[i * 2 + 1]) / (2 * 255);
      }
      // Update texture data
      fftTexture.image.data.set(averagedData);
      fftTexture.needsUpdate = true;
    } else if (fftTexture.image.data) {
      // Test with hardcoded values to verify uniform updating works
      const testData = (new Float32Array(0)).fill(0);
      fftTexture.image.data.set(testData);
      fftTexture.needsUpdate = true;
    }

    uniforms.perceptionRadius.value = controls.perceptionRadius;
    uniforms.maxForce.value = controls.maxForce;
    uniforms.maxSpeed.value = controls.maxSpeed;
    uniforms.separationWeight.value = controls.separationWeight;
    uniforms.alignmentWeight.value = controls.alignmentWeight;
    uniforms.cohesionWeight.value = controls.cohesionWeight;

    const renderer = state.gl as unknown as THREE.WebGPURenderer;
    renderer.compute(updateBoids);
  });

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(0, 0, 0);
      dummy.scale.set(0.05, 0.05, 0.05);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
  });

  const jellyfish = useGLTF(jellyfishURL);

  // Extract geometry from the first mesh in the GLB model
  const jellyfishGeometry = useMemo(() => {
    let geometry: THREE.BufferGeometry | undefined = undefined;
    jellyfish.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && !geometry) {
        geometry = child.geometry;
      }
    });
    return geometry;
  }, [jellyfish]);

  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[0, 1, 0]} intensity={1} />

    <Html fullscreen zIndexRange={[500, 0]}>
      <div className={`ui ${isPlaying ? 'playing' : ''}`}>
        <button className='control' onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
      {/* <audio ref={audioRef} src={lalalaURL} /> */}
      <audio ref={audioRef} src={jellyJamURL} />      
    </Html>
    <Bvh>
      <instancedMesh
        ref={meshRef}
        args={[jellyfishGeometry, undefined, count]}
        position={[0, 0, 0]}
      >
        <meshStandardNodeMaterial
          colorNode={colorNode}
          positionNode={positionNode}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </Bvh>
  </>
}


function App() {
  if (!WebGPU.isAvailable()) return <h1>No webgpu available</h1>;

  return (
    <Canvas
      gl={async (props) => {
        console.info("WebGPU is supported");
        const renderer = new THREE.WebGPURenderer(
          props as WebGPURendererParameters
        );
        await renderer.init();
        return renderer;
      }}
      camera={{
        position: [0, 0, 8]
      }}
    >
      <color args={['#6dceff']} attach='background' />
      <Stats />
      <OrbitControls enableDamping dampingFactor={0.05} />

      <Scene />
    </Canvas>
  );
}

export default App;
