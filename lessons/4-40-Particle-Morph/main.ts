import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

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
dracoLoader.setDecoderPath('../../shared/draco/')
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

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

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
camera.position.set(0, 0, 8 * 2)
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
const initGeometry = new THREE.SphereGeometry(3);
initGeometry.setIndex(null);
const initMaterial = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uSize: new THREE.Uniform(0.4),
    uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio))
  }
});

let startIndex = 0;
let targetIndex = 1;

const particles = {
  geometry: initGeometry as THREE.BufferGeometry,
  material: initMaterial,
  points: new THREE.Points(initGeometry as THREE.BufferGeometry, initMaterial),
  maxCount: 0,
  positions: [] as THREE.Float32BufferAttribute[]
}

// scene.add(particles.points);


gltfLoader.load('./models.glb', (gltf) => {
  const positions = gltf.scene.children.map((child) => (child as THREE.Mesh).geometry.attributes.position);

  for (const position of positions) {
    particles.maxCount = position.count > particles.maxCount ? position.count : particles.maxCount;
  }

  for (const position of positions) {
    const originalArray = position.array;
    const newArray = new Float32Array(particles.maxCount * 3);

    for (let i=0; i<particles.maxCount; i++) {
      const i3 = i * 3;
      if (i3 < originalArray.length) {
        newArray[i3 + 0] = originalArray[i3 + 0];
        newArray[i3 + 1] = originalArray[i3 + 1];
        newArray[i3 + 2] = originalArray[i3 + 2];
      } else {
        const randomIndex = Math.floor(position.count * Math.random()) * 3;
        newArray[i3 + 0] = originalArray[randomIndex + 0];
        newArray[i3 + 1] = originalArray[randomIndex + 1];
        newArray[i3 + 2] = originalArray[randomIndex + 2];
      }
    }

    particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
  }

  particles.geometry.dispose();
  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setIndex(null);
  particles.geometry.setAttribute('position', particles.positions[0]);
  particles.geometry.setAttribute('aPositionTarget', particles.positions[1]);

  particles.material.dispose();
  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uProgress: new THREE.Uniform(0),
      uSize: new THREE.Uniform(0.4),
      uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio))
    }
  });

  particles.points = new THREE.Points(particles.geometry, particles.material);
  particles.points.frustumCulled = false;
  scene.add(particles.points);

  gui.add(particles.material.uniforms.uProgress, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Progress');

  const morph = (index: number) => () => {
    particles.geometry.attributes.position = particles.positions[startIndex];
    particles.geometry.attributes.aPositionTarget = particles.positions[index];
    startIndex = index;
    gsap.fromTo(particles.material.uniforms.uProgress, { value: 0 }, { value: 1, duration: 2 });
  }

  const functions = {
    setTarget0: morph(0),
    setTarget1: morph(1),
    setTarget2: morph(2),
    setTarget3: morph(3),
  }

  gui.add(functions, 'setTarget0');
  gui.add(functions, 'setTarget1');
  gui.add(functions, 'setTarget2');
  gui.add(functions, 'setTarget3');
})

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()