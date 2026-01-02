import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()
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
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.target.y = 3
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Model
 */
gltfLoader.load(
    './resources/bakedModel.glb',
    (gltf) => {
      const gltfObj = gltf.scene.getObjectByName('baked') as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
      if (!gltfObj?.material?.map) return;

      gltfObj.material.map.anisotropy = 8
      scene.add(gltf.scene)
    }
)


// Smoke
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(1.5, 6, 1.5);

import perlinURL from './resources/perlin.png';
const perlinTexture = textureLoader.load(perlinURL);
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

import vertGlsl from './shaders/smoke.vert';
import fragGlsl from './shaders/smoke.frag';
const smokeMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  vertexShader: vertGlsl,
  fragmentShader: fragGlsl,
  uniforms: {
    uPerlinTexture: new THREE.Uniform(perlinTexture),
    uTime: new THREE.Uniform(0)
  }
});

const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getDelta();

    // smoke.lookAt(camera.position);
    // Update smoke
    smokeMaterial.uniforms.uTime.value += elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
