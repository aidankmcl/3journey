varying vec3 vWorldPos;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vWorldPos = modelPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
