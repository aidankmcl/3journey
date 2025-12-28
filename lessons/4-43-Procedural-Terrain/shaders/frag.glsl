
uniform float uTime;
// Colors
uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormalElevated;

const float waterLevel = -0.1;
const float sandTop = -0.05;
const float grassTop = 0.0;
const float snowCapStart = 0.7;

#include ./includes/simplexNoise2d.glsl

void main()
{
  vec3 color = vec3(1.0);

  // Water
  float surfaceWaterMix = smoothstep(-1.0, waterLevel, vPosition.y);
  color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

  // Sand
  float sandMix = smoothstep(waterLevel, sandTop, vPosition.y);
  color = mix(color, uColorSand, sandMix);

  // Grass
  float groundMix = smoothstep(sandTop, grassTop, vPosition.y);
  float rockMix = abs(1.0 - dot(vec3(0.0, 1.0, 0.0), vNormalElevated));
  vec3 groundColor = mix(uColorGrass, uColorRock, step(0.3, rockMix));
  color = mix(color, groundColor, groundMix);

  // float snowCapWave = (cos(vPosition.x * 50.0) + sin(vPosition.z * 50.0)) * 0.05;
  // float snowThreshold = snowCapStart + snowCapWave;
  float snowThreshold = snowCapStart + simplexNoise2d(vPosition.xz * 15.0) * 0.1;
  float snowCapMix = step(snowThreshold, vPosition.y);
  color = mix(color, uColorSnow, snowCapMix);

  csm_DiffuseColor = vec4(color, 1.0);
}