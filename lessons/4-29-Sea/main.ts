
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import GUI from 'lil-gui';

import '~/styles/style.css';

// const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// const cursor = { x: 0, y: 0 };


const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}


const scene = new THREE.Scene();

// Add test plane
const geom = new THREE.PlaneGeometry(10, 10, 512, 512);

let elapsedTime = 0.0;

// Pattern 2
import vertexShader from './shaders/pattern.vert';
import fragShader from './shaders/pattern.frag';

const debugObject = {
  depthColor: '#186691',
  surfaceColor: '#9bd8ff'
}

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragShader,
  uniforms: {
    uTime: { value: 0 },
    
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallIterations: { value: 4 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 }
  }
});

const plane = new THREE.Mesh(
  geom,
  material
);
plane.rotateOnAxis(new THREE.Vector3(1.0, 0.0, 0.0), -Math.PI / 2);
scene.add(plane);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 2);
camera.lookAt(plane.position);
scene.add(camera);


// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);


const controls = new OrbitControls(camera, canvas as HTMLElement);
// controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera); // Initial render


// Animations
const clock = new THREE.Clock();

const tick = () => {
  elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  geom.attributes.position.needsUpdate = true;

  controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  // Timing
  window.requestAnimationFrame(tick);
}

tick();


// Events
// window.addEventListener("mousemove", (evt) => {
//   // Subtract 0.5 from normalized coords to create center-origin cartesian axes (Y pointing up to match 3js)
//   cursor.x = evt.clientX / sizes.width - 0.5;
//   cursor.y = -(evt.clientY / sizes.height - 0.5);
// });

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
