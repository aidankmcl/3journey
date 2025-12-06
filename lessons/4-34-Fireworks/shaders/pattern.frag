precision mediump float;

uniform float uElapsed;
uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
  vec4 tex = texture(uTexture, gl_PointCoord);
  // Can use r, g, or b channels here is because the texture image is grayscale
  float alpha = tex.r;  // in fact, using tex.a fails because these textures use black for alpha
  gl_FragColor = vec4(uColor, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
