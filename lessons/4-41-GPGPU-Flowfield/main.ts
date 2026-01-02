import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GPUComputationRenderer, type Variable } from 'three/addons/misc/GPUComputationRenderer.js';
import GUI from 'lil-gui'

import '~/styles/style.css';

import particlesVertexShader from './shaders/particles.vert';
import particlesFragmentShader from './shaders/particles.frag';

/**
* Base
*/
// Debug
const gui = new GUI({ width: 340 })


// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) throw new Error("No canvas available");

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/3journey/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
* Sizes
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
  
  // Materials
  if (material) material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
  
  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
* Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 5, 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.enableDamping = true

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

const debugObject = {
  clearColor: '#160920'
}
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)


/**
* Particles
*/
import gpgpuShader from './shaders/gpgpu/particles.glsl';

let computation: GPUComputationRenderer | null = null;
let material: THREE.ShaderMaterial | null = null;
let particlesVariable: Variable | null = null;

gltfLoader.load('./model.glb', (gltf) => {
  const baseGeometry = (gltf.scene.children[0] as THREE.Mesh).geometry;
  baseGeometry.setIndex(null);
  const baseCount = baseGeometry.attributes.position.count;

  const size = Math.ceil(Math.sqrt(baseCount));
  computation = new GPUComputationRenderer(size, size, renderer);

  const baseParticlesTexture = computation.createTexture();

  for (let i=0; i<baseCount; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    if (!baseParticlesTexture.image.data) break;

    baseParticlesTexture.image.data[i4 + 0] = baseGeometry.attributes.position.array[i3 + 0]
    baseParticlesTexture.image.data[i4 + 1] = baseGeometry.attributes.position.array[i3 + 1]
    baseParticlesTexture.image.data[i4 + 2] = baseGeometry.attributes.position.array[i3 + 2]
    baseParticlesTexture.image.data[i4 + 3] = Math.random();
  }

  particlesVariable = computation.addVariable('uParticles', gpgpuShader, baseParticlesTexture);
  computation.setVariableDependencies(particlesVariable, [particlesVariable]);

  particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
  particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
  particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture);
  particlesVariable.material.uniforms.uFlowfieldInfluence = new THREE.Uniform(0.75);
  particlesVariable.material.uniforms.uFlowfieldStrength = new THREE.Uniform(0.75);
  particlesVariable.material.uniforms.uFlowfieldFrequency = new THREE.Uniform(0.75);

  computation.init();

  const debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
      map: computation.getCurrentRenderTarget(particlesVariable).texture
    })
  );
  debug.position.x = 3;
  scene.add(debug);
  debug.visible = false;

  material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    // blending: THREE.AdditiveBlending,
    // depthWrite: false,
    uniforms: {
      uSize: new THREE.Uniform(0.15),
      uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
      uParticlesTexture: new THREE.Uniform(computation.getCurrentRenderTarget(particlesVariable).texture),
    }
  });

  const gpgpu = { size, computation, particlesVariable, material };


  const particlesUVArray = new Float32Array(baseCount * 2);
  const sizesArray = new Float32Array(baseCount);

  for (let y=0; y<gpgpu.size; y++) {
    for (let x=0; x<gpgpu.size; x++) {
      const i = (y * gpgpu.size) + x;
      const i2 = i * 2;

      const uvX = (x + 0.5) / gpgpu.size;
      const uvY = (y + 0.5) / gpgpu.size;

      particlesUVArray[i2 + 0] = uvX;
      particlesUVArray[i2 + 1] = uvY;

      sizesArray[i] = Math.random();
    }
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setDrawRange(0, baseCount);
  particlesGeometry.setAttribute('aParticlesUV', new THREE.BufferAttribute(particlesUVArray, 2));
  particlesGeometry.setAttribute('aColor', baseGeometry.attributes.color);
  particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1));

  const particles = {
    geometry: particlesGeometry,
    material,
    points: new THREE.Points(particlesGeometry, material),
    maxCount: 0,
    positions: [] as THREE.Float32BufferAttribute[]
  }

  scene.add(particles.points);
});



const clock = new THREE.Clock();
let previousTime = 0;

/**
* Animate
*/
const tick = () =>
  {
  // Update controls
  controls.update()

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // GPGPU Update
  if (computation && material && particlesVariable) {
    particlesVariable.material.uniforms.uTime.value = elapsedTime;
    particlesVariable.material.uniforms.uDeltaTime.value = deltaTime;

    computation.compute();
    material.uniforms.uParticlesTexture.value = computation.getCurrentRenderTarget(particlesVariable).texture;
  }
  
  // Render normal scene
  renderer.render(scene, camera)
  
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()