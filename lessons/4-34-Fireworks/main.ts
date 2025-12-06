
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui';

import '~/styles/style.css';

const gui = new GUI();

const width = window.innerWidth;
const height = window.innerHeight;
const pixelRatio = Math.min(window.devicePixelRatio, 2);

const sizes = {
  width,
  height,
  pixelRatio,
  resolution: new THREE.Vector2(width * pixelRatio, height * pixelRatio)
}

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  throw new Error("Unable to connect to canvas!");
}


const scene = new THREE.Scene();


// Particle textures
const textureLoader = new THREE.TextureLoader();
const textures = [
  textureLoader.load('./particles/1.png'),
  textureLoader.load('./particles/2.png'),
  textureLoader.load('./particles/3.png'),
  textureLoader.load('./particles/4.png'),
  textureLoader.load('./particles/5.png'),
  textureLoader.load('./particles/6.png'),
  textureLoader.load('./particles/7.png'),
  textureLoader.load('./particles/8.png'),
];





// Add test plane
let elapsedTime = 0.0;

// Fireworks Material
import vertexShader from './shaders/pattern.vert';
import fragShader from './shaders/pattern.frag';
import gsap from 'gsap';

// Fireworks
const createFirework = (
  count: number = 100,
  position: THREE.Vector3 = new THREE.Vector3(),
  size: number = 0.05,
  texture: THREE.Texture = textures[7],
  radius: number = 1,
  color: THREE.Color = new THREE.Color(0.1, 0.4, 0.8)
) => {
  // Geom

  // Randomized Data
  // Timing
  const timingMultiplierArray = new Float32Array(count);
  // Sizes
  const sizesArray = new Float32Array(count);
  // Particle positions
  const positionsArray = new Float32Array(count * 3);

  for (let i=0; i<count; i++) {
    timingMultiplierArray[i] = 1 + Math.random();

    sizesArray[i] = Math.random();

    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    const i3 = i * 3;
    positionsArray[i3    ] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1));
  geometry.setAttribute('aTimingMultiplier', new THREE.Float32BufferAttribute(timingMultiplierArray, 1));

  // Material
  texture.flipY = false
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // side: THREE.DoubleSide,
    uniforms: {
      uElapsed: new THREE.Uniform(elapsedTime),
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0)
    }
  });

  // Points
  const firework = new THREE.Points(geometry, material);
  firework.position.copy(position);
  scene.add(firework);

  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  }

  // Animate
  gsap.to(material.uniforms.uProgress, { value: 1, duration: 3, ease: 'linear', onComplete: destroy })
}


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);


// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);


const controls = new OrbitControls(camera, canvas as HTMLElement);
// controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.render(scene, camera); // Initial render


// Events
// window.addEventListener("mousemove", (evt) => {
//   // Subtract 0.5 from normalized coords to create center-origin cartesian axes (Y pointing up to match 3js)
//   cursor.x = evt.clientX / sizes.width - 0.5;
//   cursor.y = -(evt.clientY / sizes.height - 0.5);
// });

const getShiftedRand = (scale: number = 5) => (scale / 2) - (Math.random() * scale);

const createRandomFirework = () => {
  const positionScale = 5;
  const position = new THREE.Vector3(getShiftedRand(positionScale), getShiftedRand(positionScale), getShiftedRand(positionScale));

  const texture = textures[Math.floor(Math.random() * textures.length)];
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1, 0.7);

  createFirework(
    500,
    position,
    0.1,
    texture,
    2,
    color
  )
}

createRandomFirework();

// Sky
const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

const sun = new THREE.Vector3();

/// GUI

const effectController = {
    turbidity: 20,
    rayleigh: 1.75,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.7,
    elevation: -2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function guiChanged() {
  const uniforms = sky.material.uniforms;
  uniforms[ 'turbidity' ].value = effectController.turbidity;
  uniforms[ 'rayleigh' ].value = effectController.rayleigh;
  uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
  uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
  const theta = THREE.MathUtils.degToRad( effectController.azimuth );

  sun.setFromSphericalCoords( 1, phi, theta );

  uniforms[ 'sunPosition' ].value.copy( sun );

  renderer.toneMappingExposure = effectController.exposure;
  renderer.render( scene, camera );
}

gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, 'elevation', -45, 90, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

guiChanged();


// Animations
const clock = new THREE.Clock();

const tick = () => {
  elapsedTime = clock.getElapsedTime();
  // material.uniforms.uElapsed.value = elapsedTime;

  controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  // Timing
  window.requestAnimationFrame(tick);
}

tick();



window.addEventListener('click', createRandomFirework);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
  
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio)
});

// window.addEventListener('dblclick', () => {
//   if (!document.fullscreenElement) {
//     canvas.requestFullscreen();
//   } else {
//     document.exitFullscreen();
//   }
// });
