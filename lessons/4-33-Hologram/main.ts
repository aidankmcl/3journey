import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 7, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {
  clearColor: '#1d1f2a'
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
    .addColor(rendererParameters, 'clearColor')
    .onChange(() =>
    {
        renderer.setClearColor(rendererParameters.clearColor)
    })

/**
 * Material
 */
import vertGlsl from './shaders/hologram.vert';
import fragGlsl from './shaders/hologram.frag';
const material = new THREE.ShaderMaterial({
  // wireframe: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  vertexShader: vertGlsl,
  fragmentShader: fragGlsl,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uClearColor: new THREE.Uniform(new THREE.Color(0, 20, 120))
  }
});


/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne: THREE.Group | null = null
gltfLoader.load('./resources/suzanne.glb', (gltf) => {
  suzanne = gltf.scene
  suzanne.traverse((c) => {
    const child = c as THREE.Mesh;
    if (child.isMesh) child.material = material
  })
  scene.add(suzanne)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const deltaTime = clock.getDelta()
    material.uniforms.uTime.value = clock.getElapsedTime();

    // Rotate objects
    if(suzanne)
    {
        suzanne.rotation.x -= deltaTime * 0.1
        suzanne.rotation.y += deltaTime * 0.2
    }

    sphere.rotation.x -= deltaTime * 0.2
    sphere.rotation.y += deltaTime * 0.3

    torusKnot.rotation.x -= deltaTime * 0.1
    torusKnot.rotation.y += deltaTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()