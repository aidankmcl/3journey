precision mediump float;

uniform float uElapsed;
uniform vec3 uBaseColor;
uniform vec3 uShadeColor;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include "includes/ambientLight.glsl"
#include "includes/directionalLight.glsl"
#include "includes/spotLight.glsl"


vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
)
{
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    return mix(color, pointColor, point);
}

void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uBaseColor;

  // Lights
  vec3 light = vec3(0.0);
  light += ambientLight(
    vec3(1.0), // Light color
    1.0        // Light intensity,
  );
  light += directionalLight(
    vec3(1.0, 1.0, 1.0), // Light color
    1.0,                 // Light intensity
    normal,              // Normal
    vec3(1.0, 1.0, 0.0), // Light position
    viewDirection,       // View direction
    1.0                  // Specular power
  );
  // vec3 spot = spotLight(
  //   vec3(0.0, 2.0, 0.0),  // vec3 lightPosition
  //   vec3(0.0, 0.0, 0.0),  // vec3 lightTarget
  //   1.0,                  // float lightIntensity
  //   vec3(1.0),            // vec3 lightColor
  //   5.0,                  // float falloffDist
  //   20.0,                 // float specularPower
  //   normal,               // vec3 normal
  //   viewDirection,        // vec3 viewDirection
  //   vPosition             // vec3 position
  // );
  // color *= spot;

  // Halftone
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  float repetitions = 150.0;
  uv *= repetitions;
  uv = mod(uv, 1.0);

  vec3 direction = vec3(0.0, -1.0, 0.0);

  color = halftone(
    color,                 // Input color
    repetitions,                  // Repetitions
    vec3(0.0, - 1.0, 0.0), // Direction
    - 0.8,                 // Low
    1.5,                   // High
    vec3(1.0, 0.0, 0.0),   // Point color
    normal                 // Normal
  );
  color = halftone(
    color,                 // Input color
    repetitions,                 // Repetitions
    vec3(1.0,1.0, 0.0), // Direction
    0.1,                   // Low
    1.5,                   // High
    vec3(0.0, 1.0, 1.0),   // Point color
    normal                 // Normal
  );

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
