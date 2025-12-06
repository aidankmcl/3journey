precision mediump float;

attribute float aSize;
attribute float aTimingMultiplier;

uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

varying vec2 vUv;


float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}


void main()
{
  vec3 newPos = position;

  float progress = uProgress * aTimingMultiplier;

  // Exploding
  float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
  newPos *= explodingProgress;

  // Falling
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingProgress = clamp(fallingProgress, 0.0, 1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  newPos.y -= fallingProgress * 0.2;

  // Scaling
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);

  // Twinkling
  float twinklingProgress = remap(progress, 0.5, 0.8, 0.0, 1.0);
  twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 50.0) * 0.5 + 0.5;
  sizeTwinkling = 1.0 - (sizeTwinkling * twinklingProgress);


  vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
  gl_PointSize *= 1.0 / - viewPosition.z;

  if (gl_PointSize < 1.0) gl_Position = vec4(9999);

  vUv = uv;
}
