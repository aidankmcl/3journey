
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '~/styles/style.css';


import { loadModels, setupMediaPipe, startWebcam } from "./loaders";
import { animate } from "./animate";
import { loadViolinAudio } from './audio';
import violinAudioURL from '~/audio/violin-music.mp3';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}

const video = document.querySelector<HTMLVideoElement>('#webcam');
const canvas = document.querySelector('canvas.webgl');
if (!canvas || !video) {
  throw new Error("Unable to connect to the canvas or the video element!");
}

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 10, 5); 
scene.add(directionalLight);


const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.render(scene, camera); // Initial render


const addObjects = (bow: THREE.Group, violin: THREE.Group) => {
  const violinScale = 0.01;
  violin.scale.set(violinScale, violinScale, violinScale);
  violin.rotation.set(-Math.PI/4, Math.PI/8, Math.PI/3);
  violin.visible = false;
  scene.add(violin);

  const bowScale = 0.0008;
  bow.scale.set(bowScale, bowScale, bowScale);
  bow.rotation.set(-Math.PI / 2, -Math.PI / 4, Math.PI / 2);
  bow.visible = false;
  scene.add(bow);
};


// Initialize Everything
async function run() {
  if (!video) return;

  const loadingUI = document.querySelectorAll('#ui .loading');
  const loadedUI = document.querySelectorAll('#ui .loaded');

  const [{ bow, violin }, handLandmarker] = await Promise.all([
    loadModels(),
    setupMediaPipe()
  ]);

  // Place 3D model objects in scene
  addObjects(bow, violin);

  loadingUI.forEach(e => e.remove());
  loadedUI.forEach(e => (e as HTMLElement).style.display = 'block');

  const startButton = document.querySelector('#start') as HTMLButtonElement;
  if (!startButton) return;

  startButton.onclick = async () => {
    startButton.remove();
    await startWebcam(video);

    const violinAudioSource = await loadViolinAudio(violinAudioURL);
    if (!violinAudioSource) throw new Error('Violin audio failed to load');

    animate({
      video,
      handLandmarker,
      bow,
      violin,
      renderer,
      scene,
      camera,
      violinAudioSource
    });
  }
}

run();


const tick = () => {
  controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  // Timing
  window.requestAnimationFrame(tick);
}
tick();


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
