import './style.css';

import * as THREE from 'three';

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

const scene = new THREE.Scene();

const BASE_WIDTH = 3;
const BASE_LENGTH = 3;
const BASE_HEIGHT = 3;

const ROOF_HEIGHT = 2;
const ROOF_OVERHANG = 1;

const house = new THREE.Group();

const base = new THREE.Mesh(
  new THREE.BoxGeometry(BASE_WIDTH, BASE_HEIGHT, BASE_LENGTH),
  new THREE.MeshBasicMaterial({ color: 0xa4122a })
);
base.position.setY(BASE_HEIGHT / 2);
house.add(base);

const roofShape = new THREE.Shape();
const halfWidth = (BASE_WIDTH + ROOF_OVERHANG) / 2;
roofShape.moveTo(-halfWidth, 0);
roofShape.lineTo(0, ROOF_HEIGHT);
roofShape.lineTo(halfWidth, 0);
roofShape.lineTo(-halfWidth, 0);
const roofGeometry = new THREE.ExtrudeGeometry(roofShape, {
  depth: 4
});
const roof = new THREE.Mesh(
  roofGeometry,
  new THREE.MeshBasicMaterial({ color: 0x060142 })
);
roof.position.set(0, BASE_HEIGHT, -BASE_LENGTH / 2);
house.add(roof);

house.position.set(0, 0, 0);

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

renderer.render(scene, camera);

// console.log(mesh.position.distanceTo(camera.position));
// console.log(mesh.position.normalize())