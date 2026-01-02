
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import '~/styles/style.css';

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

// Add test plane
let elapsedTime = 0.0;

// Pattern 2
import vertexShader from './shaders/pattern.vert';
import fragShader from './shaders/pattern.frag';
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragShader,
  side: THREE.DoubleSide,
  uniforms: {}
});


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);


// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);


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


const fingerPointer = new THREE.Mesh(
  new THREE.SphereGeometry(0.05),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(fingerPointer);

async function startWebcam() {
  if (!video) return;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720,
        facingMode: "user" // Use front camera
      }
    });
    video.srcObject = stream;
    // Wait for video metadata to load so we know the size
    return new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
}


// Vision task
let handLandmarker: HandLandmarker;
let lastVideoTime = -1;

async function setupMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });
}

function animate() {
  // Detect hands if video is playing and has new data
  if (handLandmarker && video && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    
    // Perform detection
    const results = handLandmarker.detectForVideo(video, performance.now());
    
    if (results.landmarks.length > 0) {
      // Get Index Finger Tip (Index 8) of the first hand
      const indexTip = results.landmarks[0][8];
      
      // --- COORDINATE MAPPING ---
      // MediaPipe gives normalized coords (0 to 1).
      // We must map them to our Three.js world space.
      
      // 1. Center the values (0.5 becomes 0)
      // 2. Flip X because webcam is mirrored
      // 3. Multiply by a "scale factor" (approx 4-5 works for this camera Z-depth)
      const x = (0.5 - indexTip.x) * 4; 
      const y = (0.5 - indexTip.y) * 3; 
      
      // Simple Z mapping: closer to camera = smaller Z value in MP
      // This is rough approximation for demo purposes
      const z = -indexTip.z * 5; 
      
      // Update Sphere Position
      fingerPointer.position.lerp(new THREE.Vector3(x, y, z), 0.3);
    }
  }
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Initialize Everything
async function run() {
  await startWebcam();
  await setupMediaPipe();
  animate();
}

run();


// Animations
const clock = new THREE.Clock();

const tick = () => {
  elapsedTime = clock.getElapsedTime();
  material.uniforms.uElapsed.value = elapsedTime;
  
  controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  // Timing
  window.requestAnimationFrame(tick);
}

tick();


// Events
// window.addEventListener("mousemove", (evt) => {
//   // Subtract 0.5 from normalized coords to create center-origin cartesian axes (Y pointing up to match 3js)
//   cursor.x = evt.clientX / sizes.width - 0.5;
//   cursor.y = -(evt.clientY / sizes.height - 0.5);
// });

// window.addEventListener("resize", () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;
//   sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

//   material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(sizes.pixelRatio);
// });

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
