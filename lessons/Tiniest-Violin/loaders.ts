
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import '~/styles/style.css';


const gltfLoader = new GLTFLoader();


import violinURL from '~/models/violin.glb';

const loadViolin = async () => {
  return new Promise<THREE.Group>((resolve) => {
    gltfLoader.load(violinURL, (glb) => {
      const violin = glb.scene;

      violin.visible = false;
      resolve(violin);
    });
  });
}


import bowURL from '~/models/bow.glb';

const loadBow = async () => {
  return new Promise<THREE.Group>((resolve) => {
    gltfLoader.load(bowURL, (glb) => {
      const bow = glb.scene;

      bow.traverse((c) => {
        const child = c as THREE.Mesh;
        if (child.isMesh) {
          (child.material as THREE.MeshStandardMaterial).color = new THREE.Color('#603800');
        }
      });

      bow.visible = false;
      resolve(bow);
    });
  })
}

export const loadModels = async () => {
  const [bow, violin] = await Promise.all([loadBow(), loadViolin()]);
  return { bow, violin };
}


export async function startWebcam(video: HTMLVideoElement) {
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
export async function setupMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
  );
  return await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });
}
