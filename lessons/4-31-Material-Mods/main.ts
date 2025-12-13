import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
  throw new Error("No canvas available to target");
}

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
import pxEnv from '~/textures/environmentMap/0/px.jpg';
import nxEnv from '~/textures/environmentMap/0/nx.jpg';
import pyEnv from '~/textures/environmentMap/0/py.jpg';
import nyEnv from '~/textures/environmentMap/0/ny.jpg';
import pzEnv from '~/textures/environmentMap/0/pz.jpg';
import nzEnv from '~/textures/environmentMap/0/nz.jpg';
const environmentMap = cubeTextureLoader.load([
    pxEnv,
    nxEnv,
    pyEnv,
    nyEnv,
    pzEnv,
    nzEnv
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
import colorTex from '~/models/LeePerrySmith/color.jpg';
import normalTex from '~/models/LeePerrySmith/normal.jpg';

const mapTexture = textureLoader.load(colorTex)
mapTexture.colorSpace = THREE.SRGBColorSpace
const normalTexture = textureLoader.load(normalTex)

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking
})

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
    {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    #include <common>
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>

    float angle = (0.2 * position.y) + uTime;
    mat2 rotateMatrix = get2dRotateMatrix(angle);
    
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

// Material
const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    normalMap: normalTexture
})

const customUniforms = {
  uTime: { value: 0 }
}

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
    {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    #include <common>
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>

    float angle = (0.2 * position.y) + uTime;
    mat2 rotateMatrix = get2dRotateMatrix(angle);
    
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
};

/**
 * Models
 */
import modelGLB from '~/models/LeePerrySmith/LeePerrySmith.glb';
gltfLoader.load(
    modelGLB,
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        // @ts-ignore - broken type from package
        mesh.material = material
        mesh.customDepthMaterial = depthMaterial
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)

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
camera.position.set(4, 1, - 4)
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
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()