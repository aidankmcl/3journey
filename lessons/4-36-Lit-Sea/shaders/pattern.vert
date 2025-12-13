uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include "includes/perlinClassic3D.glsl"

float waveElevation(vec3 position)
{
    
  float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;

  for (float i=1.0; i<4.0; i++) {
    elevation -= abs(perlinClassic3D(vec3(position.xz * 3.0 * i, uTime * 0.3)) * 0.15 / i);
  }

  return elevation;
}


void main()
{
  float shift = 0.01;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, - shift);

  // float elevation = sin(modelPosition.x * uBigWavesFrequency.x) * sin(modelPosition.z * uBigWavesFrequency.y) * uBigWavesElevation;
  // float elevation = sin(vUv.x * uBigWavesFrequency.x) * uBigWavesElevation;

  float elevation = waveElevation(modelPosition.xyz);
  modelPosition.y += elevation;
  modelPositionA.y += waveElevation(modelPositionA);
  modelPositionB.y += waveElevation(modelPositionB);

  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computedNormal = cross(toA, toB);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
  vNormal = computedNormal;
  vPosition = modelPosition.xyz;
}
