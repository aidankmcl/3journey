precision mediump float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  // Perlin
  // float pattern = cnoise(vUv * 10.0);


  // vec3 color = vec3(vUv.xy, 1.0);

  // // One approach using fixed circle with diffuse background
  // float dist = distance(gl_PointCoord, vec2(0.5));
  // float diffusion = 0.5 - dist;
  // float circle = 1.0 - step(0.2, dist);
  // float pattern = diffusion + circle;
  
  // Another that's only using exponential falloff for a denser center
  float dist = distance(gl_PointCoord, vec2(0.5));
  float pattern = 1.0 - dist;
  pattern = pow(pattern, 6.0);

  vec3 color = mix(vec3(0.0), vColor, pattern);

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
