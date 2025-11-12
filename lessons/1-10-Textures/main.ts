
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import { House, DEFAULTS as houseDefaults } from '~/objects/house';
import '~/styles/style.css';
import gsap from 'gsap';

const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const cursor = { x: 0, y: 0 };

/** NOTE: The change here is that the door is added to the House */

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

const scene = new THREE.Scene();

const options = { ...houseDefaults };
const house = House(options);
scene.add(house);

gui.title("House");
gui.add(house.scale, 'x').min(1).max(10).step(0.25).name("House Width");
gui.add(house.scale, 'y').min(1).max(10).step(0.25).name("House Height");
gui.add(house.scale, 'z').min(1).max(10).step(0.25).name("House Length");

const debug = {
  jump: () => {
    gsap.to(house.rotation, { y: Math.PI * 3, duration: 1.25 })
    gsap.to(house.position, { y: 2, duration: 1 })
    .then(() => {
      gsap.to(house.position, { y: 0, duration: 0.25 })
    })
  }
};
gui.add(debug, "jump");


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera); // Initial render


// Animations
// const clock = new THREE.Clock()

const tick = () => {
  controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  // Timing
  window.requestAnimationFrame(tick);
}

tick();


// Events
window.addEventListener("mousemove", (evt) => {
  // Subtract 0.5 from normalized coords to create center-origin cartesian axes (Y pointing up to match 3js)
  cursor.x = evt.clientX / sizes.width - 0.5;
  cursor.y = -(evt.clientY / sizes.height - 0.5);
});

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
