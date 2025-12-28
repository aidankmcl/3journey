import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 })
const debugObject = {
  colorWaterDeep: '#002b3d',
  colorWaterSurface: '#66a8ff',
  colorSand: '#ffe894',
  colorGrass: '#85d534',
  colorSnow: '#ffffff',
  colorRock: '#bfbd8d',
}

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) throw new Error('No canvas');

// Scene
const scene = new THREE.Scene()

/**
 * Environment map
 */
// import hdrURL from './spruit_sunrise.hdr';
// import hdrURL from './../4-42-Wobbly-Sphere/urban_alley_01_1k.hdr';
// const hdrLoader = new HDRLoader();
// hdrLoader.load(hdrURL, (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping

//   scene.background = environmentMap
//   scene.environment = environmentMap
// })

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.2),
  uStrength: new THREE.Uniform(2.5),
  uWarpFrequency: new THREE.Uniform(7),
  uWarpStrength: new THREE.Uniform(0.2),
  // Colors
  uColorWaterDeep: new THREE.Uniform(new THREE.Color(debugObject.colorWaterDeep)),
  uColorWaterSurface: new THREE.Uniform(new THREE.Color(debugObject.colorWaterSurface)),
  uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
  uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
  uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
  uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
}
gui.add(uniforms.uPositionFrequency, 'value', 0, 1, .001).name('uPositionFrequency')
gui.add(uniforms.uStrength, 'value', 0, 10, .001).name('uStrength')
gui.add(uniforms.uWarpFrequency, 'value', 0, 10, .001).name('uWarpFrequency')
gui.add(uniforms.uWarpStrength, 'value', 0, 1, .001).name('uWarpStrength')

gui.addColor(debugObject, 'colorWaterDeep').onChange((v: string) => { uniforms.uColorWaterDeep.value.set(v) })
gui.addColor(debugObject, 'colorWaterSurface').onChange((v: string) => { uniforms.uColorWaterSurface.value.set(v) })
gui.addColor(debugObject, 'colorSand').onChange((v: string) => { uniforms.uColorSand.value.set(v) })
gui.addColor(debugObject, 'colorGrass').onChange((v: string) => { uniforms.uColorGrass.value.set(v) })
gui.addColor(debugObject, 'colorSnow').onChange((v: string) => { uniforms.uColorSnow.value.set(v) })
gui.addColor(debugObject, 'colorRock').onChange((v: string) => { uniforms.uColorRock.value.set(v) })

const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
geometry.rotateX(-Math.PI * 0.5);
geometry.deleteAttribute('uv');
geometry.deleteAttribute('normal');

import fragmentShader from './shaders/frag.glsl';
import vertexShader from './shaders/vert.glsl';
const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshStandardMaterial,

  fragmentShader,
  vertexShader,
  uniforms,

  metalness: 0,
  roughness: 0.5,
  color: '#85d534',
});

const depthMaterial = new CustomShaderMaterial({
  baseMaterial: THREE.MeshDepthMaterial,

  vertexShader,
  uniforms,

  depthPacking: THREE.RGBADepthPacking
});

const terrain = new THREE.Mesh(geometry, material);
terrain.customDepthMaterial = depthMaterial;
terrain.receiveShadow = true;
terrain.castShadow = true;
scene.add(terrain);

// Water
const water = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.3,
    })
)
water.rotateX(-Math.PI * 0.5);
water.position.y = -0.05;
scene.add(water)


// Board
const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
const boardHole = new Brush(new THREE.BoxGeometry(10, 2, 10));
// boardHole.position.y = 0.1;
// boardHole.updateMatrixWorld();
const evaluator = new Evaluator();

const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
board.castShadow = true;
board.receiveShadow = true;
board.geometry.clearGroups();
board.material = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  metalness: 0,
  roughness: 0.3,
});
board.updateMatrixWorld();

scene.add(board);


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffeaa4', 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
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
camera.position.set(-15, 8, 10)
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
    const elapsedTime = clock.getElapsedTime()
    uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()