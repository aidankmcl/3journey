varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform float uRotation;
uniform vec3 uColorMask;

// Shadow uniforms
uniform samplerCube uShadowMap;

#include "./includes/discoLight.glsl"

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);
  vec4 rgba = vec4(color, 1.0);
  
  // Sample shadow map: RGB = shadow caster's colorMask, A = depth
  vec3 lightToFrag = vPosition - uLightPos;
  vec4 shadowSample = textureCube(uShadowMap, lightToFrag);
  vec3 shadowColorMask = 1.0 - shadowSample.rgb;
  float closestDepth = shadowSample.a;
  
  vec3 combinedColor = shadowColorMask + color;
  float shouldShowShadow = clamp(length(combinedColor), 0.0, 1.0);

  // Apply shadow - multiply by shadowColorMask to tint shadow based on caster
  // Note: changing step changes shadow color or whether it appears at all
  float inShadow = 1.0 - step(0.2, closestDepth);
  rgba = mix(rgba, vec4(0.0), inShadow);

  // Final color
  // gl_FragColor = vec4(color, 1.0);
  gl_FragColor = rgba;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
