
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import GUI from 'lil-gui';

import '~/styles/style.css';

import { Door } from './door';


const gui = new GUI();

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

// Vars
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// const cursor = { x: 0, y: 0 };


const scene = new THREE.Scene();


// Textures
import matcapURL from '~/textures/matcaps/1.png';
import gradientURL from '~/textures/gradients/3.jpg';

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(matcapURL);
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load(gradientURL);


// Materials
// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();

// Phong
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color('#6666ff');

// Toon
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
gui.add(material, 'metalness').min(0).max(1).step(0.05).setValue(0.6);
gui.add(material, 'roughness').min(0).max(1).step(0.05).setValue(0.1);


// Lights
// const ambientLight = new THREE.AmbientLight('#ffffee', 0.5);
// const pointLight = new THREE.PointLight('#ffffff', 20);
// pointLight.position.z = 4;
// scene.add(ambientLight, pointLight);


// Environment
const hdrLoader = new HDRLoader();
import envURL from '~/textures/environmentMap/2k.hdr';
hdrLoader.load(envURL, (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap;
  scene.environment = envMap;
});


// Mesh
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(),
  material
);
torus.position.x = -3;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  material
);
sphere.position.x = 0;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(),
  material
);
box.position.x = 3;


const door = Door();
door.position.y = 2;


scene.add(torus, sphere, box, door);



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 2, 10);
camera.lookAt(scene.position);
scene.add(camera);


// Axes viz
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);


// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;


// Render
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
