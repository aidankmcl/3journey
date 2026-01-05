
import * as THREE from 'three';
import {
  color,
  storage,
  instanceIndex,
  Fn,
  deltaTime,
  positionLocal,
  normalize,
  vec3,
  cross,
  mat3,
  uniform,
  If,
  Loop,
  length,
  float,
  int,
  mix,
  clamp,
  texture,
  uv
} from "three/tsl";


export const getBoidsSimulation = (
  count: number,
  gradientTexture: THREE.Texture,
  width: number = 20,
  height: number = 15,
  fftBinCount: number = 8
) => {
  // Use DataTexture for updateable array data
  const fftDataArray = new Float32Array(fftBinCount).fill(0);
  const fftTexture = new THREE.DataTexture(fftDataArray, fftBinCount, 1, THREE.RedFormat, THREE.FloatType);
  fftTexture.needsUpdate = true;
  const fftData = texture(fftTexture);
  
  // Gradient texture for vertical coloring
  const gradientTex = texture(gradientTexture);

  const perceptionRadius = uniform(0.5);
  const maxForce = uniform(0.5);
  const maxSpeed = uniform(3);

  const separationWeight = uniform(2);
  const alignmentWeight = uniform(1.5);
  const cohesionWeight = uniform(2);

  // Storage buffer setup for tracking position and velocity
  const positionArray = new Float32Array(count * 3);
  const velocityArray = new Float32Array(count * 3);

  for (let i=0; i < count * 3; i += 3) {
    positionArray[i + 0] = (Math.random() - 0.5) * width;
    positionArray[i + 1] = (Math.random() - 0.5) * height;
    positionArray[i + 2] = (Math.random() - 0.5) * width;

    velocityArray[i + 0] = Math.random() - 0.5;
    velocityArray[i + 1] = Math.random() - 0.5;
    velocityArray[i + 2] = Math.random() - 0.5;
  }

  const positionStorage = storage(new THREE.InstancedBufferAttribute(positionArray, 3), 'vec3', count);
  const velocityStorage = storage(new THREE.InstancedBufferAttribute(velocityArray, 3), 'vec3', count);


  // Boids flocking algorithm implementation
  const updateBoids = Fn(() => {
    const position = positionStorage.element(instanceIndex);
    const velocity = velocityStorage.element(instanceIndex);

    const separation = vec3(0).toVar();
    const alignment = vec3(0).toVar();
    const cohesion = vec3(0).toVar();
    const neighborCount = float(0).toVar();

    Loop(count, ({ i }) => {
      If(i.notEqual(instanceIndex), () => {
        const otherBoidPos = positionStorage.element(i);
        const otherBoidVel = velocityStorage.element(i);

        const dirOtherToSelf = position.sub(otherBoidPos);
        const dist = length(dirOtherToSelf);

        If(dist.lessThan(perceptionRadius), () => {
          const sepPush = dirOtherToSelf.normalize().div(dist);
          separation.addAssign(sepPush);
          alignment.addAssign(otherBoidVel);
          cohesion.addAssign(otherBoidPos);

          neighborCount.addAssign(1);
        });
      });
    });

    If(neighborCount.greaterThan(0), () => {
      alignment.divAssign(neighborCount);
      alignment.assign(alignment.normalize().mul(maxSpeed).sub(velocity));
      
      cohesion.divAssign(neighborCount);
      const directionToCenter = cohesion.sub(position).normalize();
      cohesion.assign(directionToCenter.mul(maxSpeed).sub(velocity));

      separation.assign(separation.normalize().mul(maxSpeed).sub(velocity));
    });

    const acceleration = vec3(0).toVar();
    acceleration.addAssign(alignment.mul(alignmentWeight));
    acceleration.addAssign(cohesion.mul(cohesionWeight));
    acceleration.addAssign(separation.mul(separationWeight));

    // Update velocity
    If(length(acceleration).greaterThan(maxForce), () => {
      acceleration.assign(acceleration.normalize().mul(maxForce));
    });
    velocity.addAssign(acceleration);

    // Update position
    If(length(velocity).greaterThan(maxSpeed), () => {
      velocity.assign(velocity.normalize().mul(maxSpeed));
    });
    position.addAssign(velocity.mul(deltaTime));

    // Handle bounds
    If(position.x.greaterThan(width / 2), () => { position.x.assign(-width / 2) });
    If(position.x.lessThan(-width / 2), () => { position.x.assign(width / 2) });
    If(position.y.greaterThan(height / 2), () => { position.y.assign(-height / 2) });
    If(position.y.lessThan(-height / 2), () => { position.y.assign(height / 2) });
    If(position.z.greaterThan(width / 2), () => { position.z.assign(-width / 2) });
    If(position.z.lessThan(-width / 2), () => { position.z.assign(width / 2) });

    // Store data for next execution
    positionStorage.element(instanceIndex).assign(position);
    velocityStorage.element(instanceIndex).assign(velocity);
  })().compute(count);


  // Rotation logic
  const velocityAttr = velocityStorage.toAttribute().xyz;
  // Now we define a new coordinate system based on our intended rotation (where velocity dir is where the mesh's Y direction points)
  const forward = normalize(velocityAttr);  // We know velocity dir is where we want to point (forward)
  const worldUp = vec3(0, 1, 0);  // The global up is always the same for us, Y+ (1 so it's normalized)
  const right = normalize(cross(forward, worldUp));  // We define a new X axis based on the right hand rule
  const depth = normalize(cross(right, forward));  // With our new X (right) and new Y (forward), we can define a new Z (depth), again with right hand rule
  // In order to rotate the vertices of the mesh, we multiply by the new, normalized, coordinate system defined by { x: right, y: forward, z: depth }
  const rotationMatrix = mat3(right, forward, depth);
  const rotatedPosition = rotationMatrix.mul(positionLocal);


  const newPosition = positionStorage.element(instanceIndex);
  const bin = clamp(newPosition.x.add(width / 2).div(width).mul(fftBinCount).floor(), 0, fftBinCount - 1);
  
  // Sample from FFT texture
  const uvCoord = vec3(float(bin).div(fftBinCount), 0.5, 0);
  const fftValue = fftData.sample(uvCoord.xy).r;
  
  // Sample gradient based on normalized Y position (0 at bottom, 1 at top)
  const normalizedY = newPosition.y.add(height / 2).div(height);
  const gradientColor = gradientTex.sample(vec3(0.5, normalizedY, 0).xy).rgb;
  const gradientColorMix = mix(color('mediumpurple'), gradientColor, fftValue.greaterThanEqual(normalizedY));
  
  // Mix gradient with FFT intensity
  const colorNode = mix(color('mediumpurple'), gradientColorMix, fftValue);
  const positionNode = rotatedPosition.add(positionStorage.toAttribute());

  // return { colorNode, positionNode, separationDistance, alignmentDistance, cohesionDistance, freedomFactor };
  return {
    updateBoids,
    colorNode,
    positionNode,
    fftTexture,
    uniforms: {
      perceptionRadius,
      maxForce,
      maxSpeed,
      separationWeight,
      alignmentWeight,
      cohesionWeight,
    }
  }
};
