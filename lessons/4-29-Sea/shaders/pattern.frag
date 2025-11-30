precision mediump float;

uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;


void main()
{
  // Perlin
  // float pattern = cnoise(vUv * 10.0);

  vec3 color = mix(uDepthColor, uSurfaceColor, vElevation);

  gl_FragColor = vec4(color, 1.0);
}
