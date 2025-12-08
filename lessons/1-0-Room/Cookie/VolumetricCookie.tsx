import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import volumetricVert from './volumetricCones.vert';
import volumetricFrag from './volumetricCones.frag';

type Vec3Input = THREE.Vector3 | THREE.Vector3Tuple;

function toVector3(input: Vec3Input): THREE.Vector3 {
  return input instanceof THREE.Vector3 ? input : new THREE.Vector3(...input);
}

type VolumetricCookieProps = {
  lightPos?: Vec3Input;
  coneLength?: number;
  coneRadius?: number;
  position?: THREE.Vector3Tuple;
  groupRef?: React.RefObject<THREE.Group>;
};

const PI = Math.PI;
const DENSITY = PI * 2.0;

// Replicate disco grid logic from GLSL to generate beam directions and colors
function generateBeamData(): { directions: THREE.Vector3[]; colors: THREE.Color[] } {
  const directions: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];

  // Match shader: gridX = phi * density * 1.01, gridY = theta * density
  // phi: -PI to PI, theta: 0 to PI
  const phiSteps = Math.ceil(DENSITY * 3 * 1.01);
  const thetaSteps = Math.ceil(DENSITY * 3);

  for (let cellY = 0; cellY < thetaSteps; cellY++) {
    for (let cellX = -phiSteps; cellX <= phiSteps; cellX++) {
      // Cell center
      const gridXCenter = cellX + 0.5;
      const gridYCenter = cellY + 0.5;

      // Reverse grid to phi/theta
      const phi = gridXCenter / (DENSITY * 1.01);
      const theta = gridYCenter / DENSITY;

      // Skip polar regions (matches shader)
      if (theta > PI - 0.275 || theta < 0.325) continue;

      // Compute beam color (matches shader logic exactly)
      const xMod = ((cellX % 2) + 2) % 2;
      const yMod = ((cellY % 2) + 2) % 2;

      let r = 0, g = 0, b = 0;

      if (yMod === 0) {
        const third = 1.0 - (((cellX % 3) + 3) % 3);
        r = xMod;
        g = Math.max(0, third);
        b = 0;
      } else {
        const third = Math.max(0, Math.min(1, 1.0 - (((cellX % 4) + 4) % 4)));
        r = third;
        g = 0;
        b = 1;
      }

      // Black out diagonals
      if ((((cellX + cellY) % 2) + 2) % 2 === 0) {
        r = 0; g = 0; b = 0;
      }

      // Skip black beams
      if (r < 0.01 && g < 0.01 && b < 0.01) continue;

      // Convert spherical to cartesian direction
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const dir = new THREE.Vector3(
        sinTheta * cosPhi,
        cosTheta,
        sinTheta * sinPhi
      );

      directions.push(dir);
      colors.push(new THREE.Color(r, g, b));
    }
  }

  return { directions, colors };
}

export const VolumetricCookie = forwardRef<THREE.Group, VolumetricCookieProps>(
  (
    {
      lightPos = new THREE.Vector3(0, 0, 0),
      coneLength = 10,
      coneRadius = 0.15,
      position = [0, 0, 0],
    },
    ref
  ) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const matRef = useRef<THREE.ShaderMaterial>(null);

    const [ refresh, setRefresh ] = useState(false);
    const { directions, colors } = useMemo(() => generateBeamData(), []);
    const count = directions.length;

    // Create instanced color attribute
    const colorArray = useMemo(() => {
      const arr = new Float32Array(count * 3);
      colors.forEach((c, i) => {
        arr[i * 3 + 0] = c.r;
        arr[i * 3 + 1] = c.g;
        arr[i * 3 + 2] = c.b;
      });
      return arr;
    }, [colors, count]);

    const lightPosVec = useMemo(() => toVector3(lightPos), [lightPos]);

    const geometry = useMemo(() => {
      // Use CylinderGeometry with radiusTop=0 for a true pointed cone
      // radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded
      const geo = new THREE.CylinderGeometry(coneRadius, 0, coneLength, 16, 1, true);
      
      // Cylinder is centered at origin by default, tip at +Y/2, base at -Y/2
      // We want tip at origin, base extending outward along +Y
      // So translate by +coneLength/2 to put tip at origin
      geo.translate(0, coneLength / 2, 0);
      
      // Add instanced color attribute
      const colorAttr = new THREE.InstancedBufferAttribute(colorArray, 3);
      geo.setAttribute('aColor', colorAttr);

      // Large bounding sphere to prevent culling
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), coneLength * 2);
      
      return geo;
    }, [coneLength, coneRadius, colorArray, refresh]);


    // Set up instance matrices once
    useEffect(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      const dummy = new THREE.Object3D();
      const up = new THREE.Vector3(0, 1, 0);

      directions.forEach((dir, i) => {
        // Position at origin (group position handles light pos)
        dummy.position.set(0, 0, 0);

        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(up, dir);
        dummy.quaternion.copy(quaternion);

        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
      setRefresh(true);
    }, [directions, geometry]);


    const uniforms = useMemo(() => ({}), []);

    return (
      <group ref={ref} position={position}>
        <instancedMesh
          ref={meshRef}
          args={[geometry, undefined, count]}
          frustumCulled={false}
        >
          <shaderMaterial
            ref={matRef}
            vertexShader={volumetricVert}
            fragmentShader={volumetricFrag}
            uniforms={uniforms}
            side={THREE.FrontSide}
            transparent={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </instancedMesh>
      </group>
    );
  }
);
