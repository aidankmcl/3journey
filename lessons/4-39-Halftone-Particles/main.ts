import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import '~/styles/style.css';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

if (!canvas) throw new Error('No canvas available');

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

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

    // Materials
    particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

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
camera.position.set(0, 0, 18)
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
renderer.setClearColor('#181818')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)


const PARTICLE_COUNT = 128;

// Displacement
const displacementCanvas = document.createElement('canvas');
const displacement = {
  canvas: displacementCanvas,
  context: displacementCanvas.getContext('2d'),
  glowImage: new Image(),
  interactivePlane: new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
  ),
  raycaster: new THREE.Raycaster(),
  screenCursor: new THREE.Vector2(9999, 9999),
  canvasCursor: new THREE.Vector2(9999, 9999),
  canvasCursorPrev: new THREE.Vector2(9999, 9999),
  texture: new THREE.CanvasTexture(displacementCanvas)
};

if (!displacement.context) throw new Error('Displacement canvas context not available');
displacement.canvas.width = PARTICLE_COUNT;
displacement.canvas.height = PARTICLE_COUNT;
displacement.canvas.style.position = 'fixed';
const canvasBoxSize = `${Math.min(sizes.width / 5, sizes.height / 3)}px`;
displacement.canvas.style.width = canvasBoxSize;
displacement.canvas.style.height = canvasBoxSize;
displacement.canvas.style.top = '0';
displacement.canvas.style.left = '0';
displacement.canvas.style.zIndex = '0';
document.body.append(displacement.canvas);
// Draw
displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

// Glow image
import glowURL from '~/textures/glow.png';
displacement.glowImage.src = glowURL;
displacement.glowImage.onload = () => {
  if (!displacement.context) return;
  displacement.context.drawImage(
    displacement.glowImage,
    0,
    0,
    32,
    32
  );
};

// Interactive plane
displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);
window.addEventListener('pointermove', (event) => {
  // We want a screen cursor that goes from -1 to 1
  displacement.screenCursor.x = (event.clientX / sizes.width * 2) - 1;
  displacement.screenCursor.y = - (event.clientY / sizes.height * 2) + 1;
});

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, PARTICLE_COUNT, PARTICLE_COUNT)
particlesGeometry.setIndex(null);
particlesGeometry.deleteAttribute('normal');

import particlesVertexShader from './shaders/particles.vert';
import particlesFragmentShader from './shaders/particles.frag';
import textureURL from '~/images/hand.png';
// import textureURL from '~/images/ncil-book-square.png';

const imageTexture = textureLoader.load(textureURL);

const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count);
const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);
for (let i=0; i<intensitiesArray.length; i++) {
  intensitiesArray[i] = Math.random();
  anglesArray[i] = Math.random() * Math.PI * 2;
}
particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1));
particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1));

const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
      uImageTexture: new THREE.Uniform(imageTexture),
      uDisplacementTexture: new THREE.Uniform(displacement.texture)
    }
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Raycaster
    displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
    const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane);
    if (intersections.length) {
      const uv = intersections[0].uv;

      if (uv) {
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = displacement.canvas.height - uv.y * displacement.canvas.height;
      }
    }

    if (displacement.context) {
      displacement.context.globalCompositeOperation = 'source-over';
      displacement.context.globalAlpha = 0.025;
      displacement.context.fillRect(
        0,
        0,
        displacement.canvas.width,
        displacement.canvas.height
      );

      // Speed alpha
      const cursorDistance = displacement.canvasCursorPrev.distanceTo(displacement.canvasCursor);
      displacement.canvasCursorPrev.copy(displacement.canvasCursor);
      const alpha = cursorDistance * 0.1;

      // Displacement
      const glowSize = displacement.canvas.width * 0.25;
      displacement.context.globalAlpha = Math.min(alpha, 1);
      displacement.context.globalCompositeOperation = 'lighten';
      displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
      )

      // Texture
      displacement.texture.needsUpdate = true;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()