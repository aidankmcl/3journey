
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import '~/styles/style.css';

const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const cursor = { x: 0, y: 0 };


const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}


const scene = new THREE.Scene();

// Add test plane
const geom = new THREE.PlaneGeometry(1, 1, 32, 32);


// Pattern 2
import vertexShader from './shaders/pattern.vert';
import fragShader from './shaders/pattern.frag';
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragShader,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(
  geom,
  material
);
scene.add(plane);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
camera.lookAt(plane.position);
scene.add(camera);


const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);


const controls = new OrbitControls(camera, canvas as HTMLElement);
// controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera); // Initial render


// Animations
// const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

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
