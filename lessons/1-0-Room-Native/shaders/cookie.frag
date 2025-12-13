varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uLightTarget;
uniform float uLightAngle;
uniform float uRotation;

#include "./includes/discoLight.glsl"

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);

  // Final color
  // gl_FragColor = vec4(color, smoothstep(0.01, 1.0, length(color)));
  gl_FragColor = vec4(vec3(length(color)), smoothstep(0.01, 1.0, length(color)));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
