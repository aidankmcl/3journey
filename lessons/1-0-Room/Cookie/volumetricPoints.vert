uniform vec3 uLightPos;
uniform float uPointSize;

varying vec3 vWorldPos;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vWorldPos = modelPosition.xyz;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Size attenuation (smaller when farther)
  gl_PointSize = uPointSize * (1.0 / -viewPosition.z);
}
