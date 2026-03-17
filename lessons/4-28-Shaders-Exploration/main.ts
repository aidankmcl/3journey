
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '~/styles/style.css';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}


const scene = new THREE.Scene();

// Add test plane
const geom = new THREE.PlaneGeometry(1, 1, 32, 32);

let elapsedTime = 0.0;

// Pattern 2
import vertexShader from './shaders/pattern.vert';
import radarShader from './shaders/radar.frag';
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: radarShader,
  side: THREE.DoubleSide,
  uniforms: {
    uElapsed: { value: elapsedTime }
  }
});

const plane = new THREE.Mesh(
  geom,
  material
);
plane.position.set(-0.8, 0.2, -0.2);
scene.add(plane);

import perlinShader from './shaders/perlin.frag';
const plane2 = plane.clone();
plane2.material = plane.material.clone();
plane2.material.fragmentShader = perlinShader;
plane2.position.set(0, 0, 0);
scene.add(plane2);

import starShader from './shaders/stars.frag';
const plane3 = plane.clone();
plane3.material = plane.material.clone();
plane3.material.fragmentShader = starShader;
plane3.position.set(0.8, -0.2, 0.2);
scene.add(plane3);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1.5);
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
  plane.material.uniforms.uElapsed.value = elapsedTime;
  plane2.material.uniforms.uElapsed.value = elapsedTime;
  plane3.material.uniforms.uElapsed.value = elapsedTime;

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
