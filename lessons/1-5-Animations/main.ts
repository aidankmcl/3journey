import '~/styles/style.css';
import { House } from '~/objects/house';

import * as THREE from 'three';
import gsap from "gsap";

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

const scene = new THREE.Scene();

const house = House();

scene.add(house);


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 10, -10);
camera.lookAt(house.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);


const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Initial render
renderer.render(scene, camera);


// Greensock animations
gsap.to(house.position, { duration: 1, x: 10 })


const clock = new THREE.Clock();

// Animations
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  
  // Update objects
  house.rotation.y = elapsedTime * Math.PI;

  camera.position.set(-8 - (2 * Math.cos(elapsedTime)), 3 + (2 * Math.sin(elapsedTime)), camera.position.z);
  camera.lookAt(house.position);

  // Render
  renderer.render(scene, camera);

  // Timing
  window.requestAnimationFrame(tick);
}

tick();