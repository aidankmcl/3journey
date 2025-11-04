
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '~/styles/style.css';


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


const points = [];
for ( let i = 0; i < 10; i ++ ) {
  points.push(
    new THREE.Vector2(
      Math.max(i + (Math.random() - 0.5), Math.max(i - 1, 0)),
      Math.max(i + (Math.random() - 0.5), Math.max(i - 1, 0))
    )
  );
}
const geometry = new THREE.LatheGeometry(points);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
const tornado = new THREE.Mesh(geometry, material);
const scalar = 0.5;
tornado.scale.set(scalar, scalar, scalar);
scene.add(tornado);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, -10);
camera.lookAt(tornado.position);
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

type Bounds = { min: number; max: number; };
type PointBounds = { x: Bounds; y: Bounds; z: Bounds; };
const pointBounds: PointBounds[] = [];
const ogPos = tornado.geometry.getAttribute('position');
const boundRadius = 0.25;
for (let i=0; i<ogPos.count; i++) {
  pointBounds.push({
    x: { min: ogPos.getX(i) - boundRadius, max: ogPos.getX(i) + boundRadius },
    y: { min: ogPos.getY(i) - boundRadius, max: ogPos.getY(i) + boundRadius },
    z: { min: ogPos.getZ(i) - boundRadius, max: ogPos.getZ(i) + boundRadius }
  })
}


function updateTornado() {
  tornado.rotation.y = clock.getElapsedTime() * 4;

  let g = tornado.geometry;
  let p = g.getAttribute('position');

  for (let i = 0; i<p.count; i++) {
    const bounds = pointBounds[i];
    let x = Math.min(Math.max(p.getX(i) + 0.2 * (Math.random()-0.5), bounds.x.min), bounds.x.max);
    let y = Math.min(Math.max(p.getY(i) + 0.2 * (Math.random()-0.5), bounds.y.min), bounds.y.max);
    let z = Math.min(Math.max(p.getZ(i) + 0.2 * (Math.random()-0.5), bounds.z.min), bounds.z.max);
    p.setXYZ(i, x, y, z);
  }
  
  p.needsUpdate = true;
}

const tick = () => {
  controls.update();

  updateTornado();
  
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
