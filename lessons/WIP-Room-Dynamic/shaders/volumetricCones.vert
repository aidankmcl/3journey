attribute vec3 aColor;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  vUv = uv;
  vColor = aColor;

  // instanceMatrix transforms cone to world position/orientation
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
