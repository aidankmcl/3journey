import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import cookieVert from './shaders/cookie.vert';
import cookieFrag from './shaders/cookie.frag';
import cookieWithShadowFrag from './shaders/cookieWithShadow.frag';
import volumetricVert from './shaders/volumetricCones.vert';
import volumetricFrag from './shaders/volumetricCones.frag';

import '~/styles/style.css';

// ============================================================================
// Shadow Map Setup (Custom cube map rendered from light position)
// ============================================================================

const SHADOW_MAP_SIZE = 1024;
const SHADOW_NEAR = 0.5;
const SHADOW_FAR = 20;

// Create cube render target for shadow map
const shadowCubeRT = new THREE.WebGLCubeRenderTarget(SHADOW_MAP_SIZE, {
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
});

// Camera for rendering shadow cube map
const shadowCamera = new THREE.CubeCamera(SHADOW_NEAR, SHADOW_FAR, shadowCubeRT);

// Depth material for rendering to shadow map (stores distance from light)
const depthMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uLightPos;
    uniform float uShadowFar;
    varying vec3 vWorldPosition;
    void main() {
      float depth = length(vWorldPosition - uLightPos) / uShadowFar;
      gl_FragColor = vec4(vec3(depth), 1.0);
    }
  `,
  uniforms: {
    uLightPos: { value: new THREE.Vector3(0, -1, 0) },
    uShadowFar: { value: SHADOW_FAR },
  },
});

// ============================================================================
// Shared Uniforms (referenced by all cookie materials)
// ============================================================================

const uniforms = {
  uLightPos: { value: new THREE.Vector3(0, -1, 0) },
  uRotation: { value: 0 },
};

// Uniforms for shadow-enabled cookie material
const shadowUniforms = {
  ...uniforms,
  uShadowMap: { value: shadowCubeRT.texture },
};

function createCookieMaterial(side: THREE.Side = THREE.FrontSide, transparent: boolean = false, depthWrite: boolean = true): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: cookieVert,
    fragmentShader: cookieFrag,
    uniforms,
    side,
    transparent,
    depthWrite,
  });
}

function createShadowCookieMaterial(side: THREE.Side = THREE.FrontSide): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: cookieVert,
    fragmentShader: cookieWithShadowFrag,
    uniforms: shadowUniforms,
    side,
  });
}

// ============================================================================
// Volumetric Beams (Instanced Cones)
// ============================================================================

const PI = Math.PI;
const DENSITY = PI;

function createVolumetricCones(coneLength = 5, coneRadius = 1.0): THREE.InstancedMesh {
  const directions: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];

  // Generate beam directions and colors
  // Match shader: gridX = phi * density * 1.01, gridY = theta * density
  const phiSteps = Math.ceil(DENSITY * 3 * 1.01);
  const thetaSteps = Math.ceil(DENSITY * 3);

  for (let cellY = 0; cellY < thetaSteps; cellY++) {
    for (let cellX = -phiSteps; cellX <= phiSteps; cellX++) {
      const gridXCenter = cellX + 0.5;
      const gridYCenter = cellY + 0.5;

      const phi = gridXCenter / (DENSITY * 1.01);
      const theta = gridYCenter / DENSITY;

      // Skip polar regions
      if (theta > PI - 0.275 || theta < 0.325) continue;

      // Compute beam color
      const xMod = ((cellX % 2) + 2) % 2;
      const yMod = ((cellY % 2) + 2) % 2;

      let r = 0, g = 0, b = 0;

      if (yMod === 0) {
        const third = 1.0 - (((cellX % 3) + 3) % 3);
        r = xMod;
        g = Math.max(0, third);
      } else {
        const third = Math.max(0, Math.min(1, 1.0 - (((cellX % 4) + 4) % 4)));
        r = third;
        b = 1;
      }

      // Black out diagonals
      if ((((cellX + cellY) % 2) + 2) % 2 === 0) {
        r = 0; g = 0; b = 0;
      }

      // Skip black beams
      if (r < 0.01 && g < 0.01 && b < 0.01) continue;

      // Spherical to cartesian
      const sinTheta = Math.sin(theta);
      directions.push(new THREE.Vector3(
        sinTheta * Math.cos(phi),
        Math.cos(theta),
        sinTheta * Math.sin(phi)
      ));
      colors.push(new THREE.Color(r, g, b));
    }
  }

  const count = directions.length;

  // Geometry: cone with tip at origin
  const geometry = new THREE.CylinderGeometry(coneRadius, 0, coneLength, 16, 1, true);
  geometry.translate(0, coneLength / 2, 0);
  
  // Instanced color attribute
  const colorArray = new Float32Array(count * 3);
  colors.forEach((c, i) => {
    colorArray[i * 3] = c.r;
    colorArray[i * 3 + 1] = c.g;
    colorArray[i * 3 + 2] = c.b;
  });
  geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colorArray, 3));

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: volumetricVert,
    fragmentShader: volumetricFrag,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  // Instanced mesh
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;

  // Set instance transforms
  const dummy = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);

  directions.forEach((dir, i) => {
    dummy.position.set(0, 0, 0);
    dummy.quaternion.setFromUnitVectors(up, dir);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;

  return mesh;
}

// ============================================================================
// Scene Setup
// ============================================================================

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

// Volumetric beams (excluded from shadow pass)
const volumetricMesh = createVolumetricCones(5, 0.4);
volumetricMesh.position.copy(uniforms.uLightPos.value);
scene.add(volumetricMesh);

// Room with shadow-enabled cookie material (single mesh)
const room = new THREE.Mesh(
  new THREE.BoxGeometry(12, 4, 10),
  createShadowCookieMaterial(THREE.BackSide)
);
room.position.x = 2.5;
room.position.y = 0.5;
scene.add(room);

// Disco ball visual
const discoBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 16, 16),
  new THREE.MeshBasicMaterial({ color: 'black' })
);
discoBall.position.copy(uniforms.uLightPos.value);
scene.add(discoBall);

// Props (these cast shadows)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  createCookieMaterial(THREE.FrontSide, true, false)
);
sphere.position.set(0, 2, -2);
scene.add(sphere);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  createCookieMaterial(THREE.FrontSide, true, false)
);
box.position.set(0, 0, -3);
scene.add(box);

// Objects that cast shadows into the shadow map
const shadowCasters: THREE.Mesh[] = [sphere, box, discoBall];

// ============================================================================
// Camera & Controls
// ============================================================================

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-5, 0, 0);
camera.lookAt(discoBall.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ============================================================================
// Renderer
// ============================================================================

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ============================================================================
// Resize Handler
// ============================================================================

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================================================
// Animation Loop
// ============================================================================

const clock = new THREE.Clock();

// Function to render our custom shadow cube map
function renderShadowMap() {
  // Position shadow camera at light position
  shadowCamera.position.copy(uniforms.uLightPos.value);
  depthMaterial.uniforms.uLightPos.value.copy(uniforms.uLightPos.value);
  
  // Store original state
  const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  const originalBackground = scene.background;
  const wasVisible = {
    volumetric: volumetricMesh.visible,
    room: room.visible,
  };
  
  // Set background to white (1.0) = max depth = no shadow caster
  scene.background = new THREE.Color(1, 1, 1);
  
  // Hide objects that shouldn't be in shadow map
  volumetricMesh.visible = false;
  room.visible = false;
  
  // Swap shadow casters to depth material
  shadowCasters.forEach(obj => {
    originalMaterials.set(obj, obj.material);
    obj.material = depthMaterial;
  });
  
  // Render the 6 faces of the cube shadow map
  shadowCamera.update(renderer, scene);
  
  // Restore everything
  scene.background = originalBackground;
  volumetricMesh.visible = wasVisible.volumetric;
  room.visible = wasVisible.room;
  
  shadowCasters.forEach(obj => {
    obj.material = originalMaterials.get(obj)!;
  });
}

function tick() {
  const elapsedTime = clock.getElapsedTime();

  // Animate Y-axis rotation of the disco light pattern
  const rotationSpeed = 0.4;
  uniforms.uRotation.value = elapsedTime * rotationSpeed;
  
  // Rotate volumetric mesh to match
  volumetricMesh.rotation.y = uniforms.uRotation.value;

  box.rotation.y = uniforms.uRotation.value;
  box.position.y = Math.sin(elapsedTime) * 0.5;
  
  // Render shadow map first
  renderShadowMap();

  // Render main scene
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
