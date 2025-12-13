
uniform sampler2D uImageTexture;

varying vec3 vColor;


void main()
{
  // Set UV
  vec2 uv = gl_PointCoord;
  vec3 color = texture(uImageTexture, gl_FragCoord.xy).rgb;
  color = vec3(smoothstep(0.1, 0.4, length(color)));
  // color *= 1.0 - color;
  // color *= vColor;

  // Set Circle
  float circle = distance(uv, vec2(0.5));
  if (circle > 0.5) discard;

  // Final color
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}