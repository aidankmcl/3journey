varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uColorMask;
uniform float uRotation;

#include "./includes/discoLight.glsl"

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);

  float alignment = clamp(dot(color, uColorMask), 0.0, 1.0);

  // Final color
  // gl_FragColor = vec4(color, smoothstep(0.01, 1.0, length(color)));
  gl_FragColor = vec4(vec3(alignment), smoothstep(0.01, 1.0, alignment));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
