
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import '~/styles/style.css';

const gui = new GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}

// const cursor = { x: 0, y: 0 };

const parameters = {
  clearColor: '#8c3da9',
  baseColor: '#e7b172',
  shadeColor: '#e7b172'
}


const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}


const scene = new THREE.Scene();

// Add test plane
let elapsedTime = 0.0;

// Pattern 2
import vertexShader from './shaders/pattern.vert';
import fragShader from './shaders/pattern.frag';
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragShader,
  side: THREE.DoubleSide,
  uniforms: {
    uElapsed: new THREE.Uniform(elapsedTime),
    uBaseColor: new THREE.Uniform(new THREE.Color(parameters.baseColor)),
    uShadeColor: new THREE.Uniform(new THREE.Color(parameters.shadeColor)),
    uResolution: new THREE.Uniform(new THREE.Vector2(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    ))
  }
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.75, 32, 32),
  material
);
scene.add(sphere);

const pyramid = new THREE.Mesh(
  new THREE.ConeGeometry(1, 1, 4),
  material
);
pyramid.position.x -= 2;
scene.add(pyramid);

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1),
  material
);
torus.position.x += 2;
torus.scale.set(0.5, 0.5, 0.5);
scene.add(torus);


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 5);
camera.lookAt(sphere.position);
scene.add(camera);


// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);


const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setClearColor(parameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.render(scene, camera); // Initial render

gui.addColor(parameters, 'clearColor')
  .onChange(() => renderer.setClearColor(parameters.clearColor))
gui.addColor(parameters, 'baseColor')
  .onChange((val: string) => {
    material.uniforms.uBaseColor.value = new THREE.Color(val);
    material.needsUpdate = true;
  })
gui.addColor(parameters, 'shadeColor')
  .onChange((val: string) => {
    material.uniforms.uShadeColor.value = new THREE.Color(val);
    material.needsUpdate = true;
  })

// Animations
const clock = new THREE.Clock();

const tick = () => {
  elapsedTime = clock.getElapsedTime();
  material.uniforms.uElapsed.value = elapsedTime;

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
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
