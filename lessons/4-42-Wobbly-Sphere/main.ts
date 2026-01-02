import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import GUI from 'lil-gui'

import '~/styles/style.css';

/**
* Base
*/
// Debug
const gui = new GUI({ width: 325 })

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) throw new Error("No canvas available");

// Scene
const scene = new THREE.Scene()

// Loaders
const rgbeLoader = new HDRLoader()

/**
* Environment map
*/
import hdrURL from './urban_alley_01_1k.hdr';
rgbeLoader.load(hdrURL, (environmentMap) =>
  {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping
  
  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
* Wobble
*/

import vertexShader from './shaders/wobble.vert';
import fragmentShader from './shaders/wobble.frag';

const uniforms = {
  uTime: new THREE.Uniform(0),

  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),

  uWarpPositionFrequency: new THREE.Uniform(0.5),
  uWarpTimeFrequency: new THREE.Uniform(0.4),
  uWarpStrength: new THREE.Uniform(0.3),

  uColorA: new THREE.Uniform(new THREE.Color('red')),
  uColorB: new THREE.Uniform(new THREE.Color('blue')),
}

// Material
const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader,
  fragmentShader,
  uniforms,

  // MeshPhysicalMaterial
  metalness: 0,
  roughness: 0.5,
  color: '#ffffff',
  transmission: 0,
  ior: 1.5,
  thickness: 1.5,
  transparent: true,
  wireframe: false
});

const depthMaterial = new CustomShaderMaterial({
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader,
  uniforms,

  depthPacking: THREE.RGBADepthPacking
});

gui.add(uniforms.uPositionFrequency, 'value', 0, 1, 0.001).name('uPositionFrequency')
gui.add(uniforms.uTimeFrequency, 'value', 0, 1, 0.001).name('uTimeFrequency')
gui.add(uniforms.uStrength, 'value', 0, 1, 0.001).name('uStrength')
gui.add(uniforms.uWarpPositionFrequency, 'value', 0, 1, 0.001).name('uWarpPositionFrequency')
gui.add(uniforms.uWarpTimeFrequency, 'value', 0, 1, 0.001).name('uWarpTimeFrequency')
gui.add(uniforms.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength')

gui.addColor(uniforms.uColorA, 'value').name('uColorA');
gui.addColor(uniforms.uColorB, 'value').name('uColorB');

// @ts-ignore
gui.add(material, 'metalness', 0, 1, 0.001) // @ts-ignore
gui.add(material, 'roughness', 0, 1, 0.001) // @ts-ignore
gui.add(material, 'transmission', 0, 1, 0.001) // @ts-ignore
gui.add(material, 'ior', 0, 10, 0.001) // @ts-ignore
gui.add(material, 'thickness', 0, 10, 0.001) // @ts-ignore
gui.addColor(material, 'color')

// Geometry
let geometry = new THREE.IcosahedronGeometry(2.5, 50) as THREE.BufferGeometry;
geometry = mergeVertices(geometry);
geometry.computeTangents();

// Mesh
const wobble = new THREE.Mesh(geometry, material)
wobble.customDepthMaterial = depthMaterial;
wobble.receiveShadow = true
wobble.castShadow = true
scene.add(wobble)

/**
* Plane
*/
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
)
plane.receiveShadow = true
plane.rotation.y = Math.PI
plane.position.y = - 5
plane.position.z = 5
scene.add(plane)

/**
* Lights
*/
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

/**
* Sizes
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
  {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
  
  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
* Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(13, - 3, - 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.enableDamping = true

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
* Animate
*/
const clock = new THREE.Clock()

const tick = () =>
  {
  const elapsedTime = clock.getElapsedTime();

  uniforms.uTime.value = elapsedTime;
  
  // Update controls
  controls.update()
  
  // Render
  renderer.render(scene, camera)
  
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()