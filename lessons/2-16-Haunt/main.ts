import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { house } from './_generator'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
  throw new Error("No canvas available");
}

// Scene
const scene = new THREE.Scene()

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
scene.add(sphere)

const floorSize = 20;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(floorSize, floorSize),
  new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)


const house = new THREE.Group();
scene.add(house);

// Walls
const wallWidth = 4;
const wallHeight = 2.5;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallWidth, wallHeight, wallWidth),
  new THREE.MeshStandardMaterial()
);
walls.position.y = wallHeight / 2;
house.add(walls);

// Roof
const roofHeight = 1.5;
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(wallWidth * 0.9, roofHeight, 4, 1),
  new THREE.MeshStandardMaterial()
)
roof.position.y = wallHeight + roofHeight / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof)

// Door
const doorWidth = wallWidth * 1 / 3;
const doorHeight = wallHeight * 3 / 4;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorWidth, doorHeight),
  new THREE.MeshStandardMaterial({ color: 0xaa2200 })
);
door.position.z = (wallWidth / 2) + 0.001;
door.position.y = doorHeight / 2;
house.add(door)

// Bushes
const bushes = new THREE.Group();
const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial());
b1.position.x = 1;
const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial());
b2.position.x = 1.75;
const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial());
b3.position.x = -1.25;
const b4 = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial());
b4.position.x = -2;
bushes.add(b1, b2, b3, b4);
bushes.position.z = (wallWidth / 2) + 0.25;
bushes.position.y = 0.25;
house.add(bushes);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveShape = new THREE.Shape();
graveShape.moveTo(0, 0);
graveShape.lineTo(0, 1);
graveShape.absarc(0.5, 1, 0.5, Math.PI, Math.PI * 2, true);
graveShape.lineTo(1, 0);
graveShape.lineTo(0, 0);
const graveGeom = new THREE.ExtrudeGeometry(graveShape, { depth: 0.25, bevelEnabled: false });
const graveMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

const radiusMin = wallWidth + 1;
const radiusMax = radiusMin + 4;
const randRotationStrength = 0.3;

for (let i=0; i<30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = radiusMin + ((radiusMax - radiusMin) * Math.random());
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeom, graveMat);
  grave.position.x = x;
  grave.position.z = y;
  grave.position.y -= 0.25;

  grave.rotation.x = (Math.random() - 0.5) * randRotationStrength;
  grave.rotation.y = (Math.random() - 0.5) * randRotationStrength;
  grave.rotation.z = (Math.random() - 0.5) * randRotationStrength;

  graves.add(grave);
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new THREE.Timer();

const tick = () =>
{
    // Timer
    timer.update()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()