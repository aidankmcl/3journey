varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform float uRotation;

// Shadow uniforms
uniform samplerCube uShadowMap;

#include "./includes/discoLight.glsl"

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);
  
  // Debug: visualize the shadow map depth
  vec3 lightToFrag = vPosition - uLightPos;
  float closestDepth = textureCube(uShadowMap, lightToFrag).r;
  
  // Apply shadow
  color *= step(0.5, closestDepth);

  // Final color
  gl_FragColor = vec4(vec3(length(color)), smoothstep(0.01, 1.0, length(color)));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
