uniform float uTime;
uniform vec3 uDarkColor;
uniform vec3 uLightColor;

varying vec2 vUv;

#include ./cnoise.glsl

void main()
{
  float strength = cnoise(vec3(vUv * 5.0, uTime));
  vec3 color = mix(uLightColor, uDarkColor, strength);
  gl_FragColor = vec4(color, 1.0);
}