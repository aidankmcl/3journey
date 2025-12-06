import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import '~/styles/style.css';

import earthVertexShader from './shaders/earth.vert';
import earthFragmentShader from './shaders/earth.frag';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Earth
 */
import dayURL from '~/textures/earth/day.jpg';
const earthDayTexture = textureLoader.load(dayURL);
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;

import nightURL from '~/textures/earth/night.jpg';
const earthNightTexture = textureLoader.load(nightURL);
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;

import specularURL from '~/textures/earth/specularClouds.jpg';
const earthSpecularCloudsTexture = textureLoader.load(specularURL);
earthSpecularCloudsTexture.anisotropy = 8;


const parameters = {
  phi: Math.PI * 0.5,
  theta: 0.5,
  atmosphereDayColor: '#00aaff',
  atmosphereTwilightColor: '#ff6600'
}

// Sun
const sunSpherical = new THREE.Spherical(1, parameters.phi, parameters.theta);
const sunDirection = new THREE.Vector3();

const debugSun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
scene.add(debugSun);

const updateSun = () => {
  sunDirection.setFromSpherical(sunSpherical);

  debugSun.position
    .copy(sunDirection)
    .multiplyScalar(5);
}
updateSun();


// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
      uDayTexture: new THREE.Uniform(earthDayTexture),
      uNightTexture: new THREE.Uniform(earthNightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
      uSunDirection: new THREE.Uniform(sunDirection),
      uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(parameters.atmosphereDayColor)),
      uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(parameters.atmosphereTwilightColor))
    }
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

import atmosphereVert from './shaders/atmosphere.vert';
import atmosphereFrag from './shaders/atmosphere.frag';
const atmosphereMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  transparent: true,
  vertexShader: atmosphereVert,
  fragmentShader: atmosphereFrag,
  uniforms: {
      uSunDirection: new THREE.Uniform(sunDirection),
      uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(parameters.atmosphereDayColor)),
      uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(parameters.atmosphereTwilightColor))
    }
});

const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.035, 1.035, 1.035);
scene.add(atmosphere);


gui
  .add(parameters, 'phi')
  .min(0)
  .max(Math.PI * 2)
  .onChange((v: number) => {
    sunSpherical.phi = v;
    updateSun();
  });

gui
  .add(parameters, 'theta')
  .min(0)
  .max(Math.PI * 2)
  .onChange((v: number) => {
    sunSpherical.theta = v;
    updateSun();
  });
gui.addColor(parameters, 'atmosphereDayColor').onChange((v: string) => {
  atmosphereMaterial.uniforms.uAtmosphereDayColor.value = new THREE.Color(v);
  earthMaterial.uniforms.uAtmosphereDayColor.value = new THREE.Color(v);
});
gui.addColor(parameters, 'atmosphereTwilightColor').onChange((v: string) => {
  atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value = new THREE.Color(v);
  earthMaterial.uniforms.uAtmosphereTwilightColor.value = new THREE.Color(v);
});

const credits = {
  ["Planet Texture"]: "solarsystemscope.com"
}

const creditsFolder = gui.addFolder('Credits');
creditsFolder.add(credits, "Planet Texture").onChange(() => {
  credits['Planet Texture'] = "solarsystemscope.com";
});


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
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
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
