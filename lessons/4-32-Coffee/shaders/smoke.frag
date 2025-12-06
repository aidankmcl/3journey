precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;


void main()
{
  vec2 smokeUV = vUv;
  smokeUV.x *= 0.5;
  smokeUV.y *= 0.3;
  smokeUV.y -= uTime * 0.05;
  // smokeUV.y -= mod(uTime * 0.1, 1.0) * 0.01;

  float smoke = texture(uPerlinTexture, smokeUV).r;
  smoke = smoothstep(0.4, 1.0, smoke);

  // smoke = 1.0;
  smoke *= smoothstep(0.0, 0.1, vUv.x);
  smoke *= smoothstep(1.0, 0.9, vUv.x);
  smoke *= smoothstep(1.0, 0.25, vUv.y);

  // gl_FragColor = vec4(vUv, 1.0, 1.0);
  gl_FragColor = vec4(vec3(smoke), smoke);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
