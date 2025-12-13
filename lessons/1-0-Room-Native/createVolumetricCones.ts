import * as THREE from 'three';

import volumetricVert from './shaders/volumetricCones.vert';
import volumetricFrag from './shaders/volumetricCones.frag';

// ============================================================================
// Volumetric Beams (Instanced Cones)
// ============================================================================

const PI = Math.PI;
const DENSITY = PI;

export function createVolumetricCones(coneLength = 5, coneRadius = 1.0): THREE.InstancedMesh {
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

      const phi = gridXCenter / (DENSITY * 1.013);
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
