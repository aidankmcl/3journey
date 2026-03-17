
import { HandLandmarker } from "@mediapipe/tasks-vision";
import * as THREE from 'three';
import { updateAudio } from "./audio";
import { CircularBuffer } from "./buffer";

type Position = { x: number, y: number, z: number };

type NormalizedPosition = { x: number, y: number };
type MapContext = {
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  video: HTMLVideoElement;
};

const screenRaycaster = new THREE.Raycaster();
const projectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const BASE_PLANE_Z = 0;
const DEPTH_SCALE = 2.5;
const MIN_PLANE_Z = -0.4;
const MAX_PLANE_Z = 0.8;

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

const remapVisibleRange = (value: number, min: number, max: number) => {
  if (Math.abs(max - min) < Number.EPSILON) {
    return 0.5;
  }

  return clamp01((value - min) / (max - min));
};

const getVisibleVideoCoords = (
  pos: Position,
  video: HTMLVideoElement,
  renderer: THREE.WebGLRenderer
): NormalizedPosition => {
  const viewportWidth = renderer.domElement.clientWidth;
  const viewportHeight = renderer.domElement.clientHeight;
  const videoAspect = video.videoWidth / video.videoHeight;
  const viewportAspect = viewportWidth / viewportHeight;

  let xMin = 0;
  let xMax = 1;
  let yMin = 0;
  let yMax = 1;

  // The video uses `object-fit: cover`, so part of the camera frame is cropped.
  if (videoAspect > viewportAspect) {
    const visibleWidth = viewportAspect / videoAspect;
    const crop = (1 - visibleWidth) * 0.5;
    xMin = crop;
    xMax = 1 - crop;
  } else if (videoAspect < viewportAspect) {
    const visibleHeight = videoAspect / viewportAspect;
    const crop = (1 - visibleHeight) * 0.5;
    yMin = crop;
    yMax = 1 - crop;
  }

  return {
    x: 1 - remapVisibleRange(pos.x, xMin, xMax),
    y: remapVisibleRange(pos.y, yMin, yMax)
  };
};

const mapCoords = (
  pos: Position,
  context: MapContext,
  offset?: Position
) => {
  const { camera, renderer, video } = context;
  const normalized = getVisibleVideoCoords(pos, video, renderer);
  const ndc = new THREE.Vector2(
    normalized.x * 2 - 1,
    1 - normalized.y * 2
  );
  const planeZ = THREE.MathUtils.clamp(
    BASE_PLANE_Z - pos.z * DEPTH_SCALE + (offset?.z ?? 0),
    MIN_PLANE_Z,
    MAX_PLANE_Z
  );

  projectionPlane.constant = -planeZ;
  screenRaycaster.setFromCamera(ndc, camera);

  const point = screenRaycaster.ray.intersectPlane(
    projectionPlane,
    new THREE.Vector3()
  );

  if (!point) {
    return new THREE.Vector3(
      offset?.x ?? 0,
      offset?.y ?? 0,
      planeZ
    );
  }

  point.x += offset?.x ?? 0;
  point.y += offset?.y ?? 0;

  return point;
}

let lastVideoTime = -1;
const distanceBuffer = new CircularBuffer(5);

type AnimateProps = {
  video: HTMLVideoElement,
  handLandmarker: HandLandmarker,
  bow: THREE.Group,
  violin: THREE.Group,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  violinAudioSource: AudioBufferSourceNode
};

export function animate(props: AnimateProps) {
  const { video, handLandmarker, bow, violin, renderer, scene, camera, violinAudioSource } = props;

  // Detect hands if video is playing and has new data
  if (video && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    // Perform detection
    const results = handLandmarker.detectForVideo(video, performance.now());
    
    if (results.landmarks.length > 0) {
      const indexTip = results.landmarks[0][8];
      const thumbTip = results.landmarks[0][4];

      const mapContext = { camera, renderer, video };
      const indexPos = mapCoords(indexTip, mapContext);
      const thumbPos = mapCoords(thumbTip, mapContext, { x: -0.05, y: 0.1, z: 0 });

      const dist = indexPos.distanceTo(thumbPos);
      distanceBuffer.push(dist);

      updateAudio({
        violinAudioSource,
        smoothedDistance: distanceBuffer.getAverage(),
        smoothedSpeed: distanceBuffer.getAverageDelta(),
        distanceCutoff: 0.4,
        minSpeed: 0.005,
        maxSpeed: 2
      });
      
      // Update model positions
      bow.position.lerp(indexPos, 0.3);
      bow.visible = true;

      violin.position.lerp(thumbPos, 0.3);
      violin.visible = true;
    } else {
      bow.visible = false;
      violin.visible = false;
      updateAudio({
        violinAudioSource,
        smoothedDistance: 100,
        smoothedSpeed: 0,
        distanceCutoff: 0.1,
        minSpeed: 1,
        maxSpeed: 1
      });
    }
  }
  
  renderer.render(scene, camera);
  requestAnimationFrame(() => animate(props));
}
