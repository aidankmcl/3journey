varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uLightTarget;
uniform float uLightAngle;

#include "./discoLight.glsl"

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal);

  // Final color
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vec3(intensity), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}