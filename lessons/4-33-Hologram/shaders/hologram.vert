precision mediump float;

uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include "includes/random2D.glsl"

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Glitch
  float glitchTime = uTime + modelPosition.y;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
  glitchStrength /= 3.0; // divided by the number of combined sine waves
  glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
  glitchStrength *= 0.2;
  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  gl_Position = projectedPosition;

  vUv = uv;
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}
