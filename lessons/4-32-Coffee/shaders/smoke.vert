precision mediump float;

uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include "includes/rotate2D.glsl"

void main()
{
  vec2 smokeUV = vUv;

  float timeVariance = uv.y * 0.2 + uTime * 0.01;

  vec3 newPosition = position;
  float twistPerlin = texture(
    uPerlinTexture,
    vec2(0.5, timeVariance)
  ).r;
  float angle = twistPerlin * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  vec2 windOffset = vec2(
    texture(uPerlinTexture, vec2(0.25, timeVariance)).r - 0.5,
    texture(uPerlinTexture, vec2(0.75, timeVariance)).g - 0.5
  );
  windOffset *= pow(uv.y, 2.0) * 10.0;
  newPosition.xz += windOffset;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
}
