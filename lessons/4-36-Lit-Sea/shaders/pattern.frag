precision mediump float;

uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include "includes/directionalLight.glsl"
#include "includes/pointLight.glsl"


void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  // Light
  vec3 light = vec3(0.0);
  // light += directionalLight(
  //   vec3(1.0),            // Light color
  //   0.6,                  // Light intensity,
  //   normal,               // Normal
  //   vec3(-1.0, 0.5, 0.0), // Light position
  //   viewDirection,        // View direction
  //   30.0                  // Specular power
  // );
  light += pointLight(
    vec3(1.0),            // Light color
    10.0,                 // Light intensity,
    normal,               // Normal
    vec3(0.0, 0.25, 0.0), // Light position
    viewDirection,        // View direction
    30.0,                 // Specular power
    vPosition,            // Position
    0.95                  // Decay
  );

  

  // Perlin
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(0.0, 1.0, mixStrength);  

  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  color *= light;
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
