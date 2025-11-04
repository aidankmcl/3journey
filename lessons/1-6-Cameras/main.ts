
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import gsap from "gsap";

import '~/styles/style.css';
import { House } from '~/objects/house';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Events
const cursor = {
  x: 0,
  y: 0
};

window.addEventListener("mousemove", (evt) => {
  // Subtract 0.5 from normalized coords to create center-origin cartesian axes (Y pointing up to match 3js)
  cursor.x = evt.clientX / sizes.width - 0.5;
  cursor.y = -(evt.clientY / sizes.height - 0.5);
  console.log(cursor);
});


const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

const scene = new THREE.Scene();


const house = House();
house.scale.set(0.5, 0.5, 0.5);
scene.add(house);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// const aspectRatio = sizes.width / sizes.height;
// const camScale = 5;
// const camera = new THREE.OrthographicCamera(-camScale * aspectRatio, camScale * aspectRatio, camScale, -camScale, 0.1, 100);
camera.position.set(0, 0, -10);
camera.lookAt(house.position);
scene.add(camera);


const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);


const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera); // Initial render


// Greensock animations
// gsap.to(house.position, { duration: 1, x: 10 })


// Animations
// const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  
  // Update objects
  // house.rotation.y = elapsedTime * Math.PI / 8;

  // const horizontalVal = cursor.x * Math.PI * 2;
  // camera.position.x = Math.sin(horizontalVal) * 5;
  // camera.position.z = Math.cos(horizontalVal) * 5;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(house.position);

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Timing
  window.requestAnimationFrame(tick);
}

tick();
