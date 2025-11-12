
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


const textureLoader = new THREE.TextureLoader();
import flagTextureURL from '~/textures/door/color.jpg';
// import flagTextureURL from '~/textures/minecraft.png';
const flagTexture = textureLoader.load(flagTextureURL);

const scene = new THREE.Scene();

// Add test plane
const geom = new THREE.PlaneGeometry(1, 1, 32, 32);
const count = geom.attributes.position.count;
const randoms = new Float32Array(count);
for (let i=0; i<count; i++) {
  randoms[i] = 0.5 - Math.random();
}
geom.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// Test 1
// import vertexShader from './shaders/test.vert';
// import fragShader from './shaders/test.frag';
// const material = new THREE.RawShaderMaterial({
//   vertexShader: vertexShader,
//   fragmentShader: fragShader,
//   transparent: true
// });

// Test 2
import vertexShader from './shaders/test2.vert';
import fragShader from './shaders/test2.frag';
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragShader,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('lightblue') },
    uTexture: { value: flagTexture }
  },
});
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('Freq X');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('Freq Y');

const plane = new THREE.Mesh(
  geom,
  material
);
plane.scale.y *= 2 / 3;
scene.add(plane);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
camera.lookAt(plane.position);
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

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
