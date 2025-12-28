varying vec2 vUv;
varying vec3 vColor;

void main()
{
  // vUv.y: 0 at tip, 1 at base
  // Fade out near tip to avoid bright center where all cones meet
  float tipFade = smoothstep(0.0, 0.05, vUv.y);
  
  // Fade along cone length (dimmer toward base)
  float lengthFade = 1.0 - vUv.y;
  lengthFade = pow(lengthFade, 2.0);

  float totalFade = tipFade * lengthFade;

  float strength = max(max(vColor.r, vColor.g), vColor.b);
  vec3 color = vColor * totalFade;
  float alpha = strength * totalFade * 0.6;

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
