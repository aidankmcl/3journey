precision mediump float;

uniform float uTime;
uniform vec3 uClearColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;


void main()
{
  // Get vectors for calculating Fresnel
  vec3 viewPosition = normalize(vPosition - cameraPosition);
  vec3 normedNormal = normalize(vNormal);
  if (!gl_FrontFacing) normedNormal *= -1.0;

  // Calculate Fresnel angle
  float angle = dot(viewPosition, normedNormal);
  float fresnel = pow(1.0 + angle, 2.0);

  // Animated stripes
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Falloff
  float falloff = smoothstep(0.8, 0.0, fresnel);

  // Holograph
  float holo = stripes * fresnel;
  holo += fresnel * 1.25;
  holo *= falloff;

  // gl_FragColor = vec4(vUv, 1.0, 1.0);
  gl_FragColor = vec4(uClearColor, holo);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
