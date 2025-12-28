
uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormalElevated;


#include ./includes/simplexNoise2d.glsl

float getElevation(vec2 position) {
  vec2 warpedPosition = position;
  warpedPosition += uTime * 0.2;
  warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

  float elevation = 0.0;
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0; // -0.5 - 0.5
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0; // -0.25 - 0.25
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0; // -0.125 - 0.125

  float elevationSign = sign(elevation);
  elevation = pow(abs(elevation), 2.0) * elevationSign;
  elevation *= uStrength;

  return elevation;
}

void main()
{
  // Neighbors
  float shift = 0.01;
  vec3 posA = position + vec3(shift, 0.0, 0.0);
  vec3 posB = position + vec3(0.0, 0.0, -shift);

  // Elevations
  float elevation = getElevation(csm_Position.xz);
  csm_Position.y += elevation;
  posA.y = getElevation(posA.xz);
  posB.y = getElevation(posB.xz);

  // Calc normals
  vec3 toA = normalize(posA - csm_Position);
  vec3 toB = normalize(posB - csm_Position);
  csm_Normal = cross(toA, toB);

  vUv = uv;
  vPosition = csm_Position;
  vPosition.xz += uTime * 0.2;
  vNormalElevated = csm_Normal;
}