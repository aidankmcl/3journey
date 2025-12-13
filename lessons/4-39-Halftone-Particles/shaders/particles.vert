uniform vec2 uResolution;
uniform sampler2D uImageTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
  vec4 textureColor = texture(uImageTexture, uv);
  // Displacement
  vec3 newPosition = position;
  float displacementIntensity = texture(uDisplacementTexture, uv).r;
  vec3 displacement = vec3(cos(aAngle), sin(aAngle), 1.0);
  displacement = normalize(displacement);
  displacement *= smoothstep(0.1, 0.5, displacementIntensity);
  newPosition += displacement * 1.0 * aIntensity;

  // Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // float intensity = smoothstep(0.01, 0.8, textureColor.g + textureColor.b / 2.0);
  float intensity = 1.0 - length(textureColor - 0.5);

  // Point size
  gl_PointSize = 0.15 * intensity * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = textureColor.rgb;
}