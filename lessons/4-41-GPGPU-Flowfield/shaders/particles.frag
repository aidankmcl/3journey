varying vec3 vColor;

void main()
{
  vec2 uv = gl_PointCoord;
  float distanceToCenter = length(uv - 0.5);
  if(distanceToCenter > 0.5)
        discard;
  // float alpha = 0.05 / distanceToCenter - 0.1;
  
  gl_FragColor = vec4(vec3(vColor), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}