varying vec3 vWorldPos;

uniform vec3 uLightPos;
uniform float uRange;

#include "./discoLight.glsl"

void main()
{
  vec3 lightDir = normalize(vWorldPos - uLightPos);
  vec3 syntheticNormal = -lightDir;
  vec3 beam = getDiscoLight(vWorldPos, uLightPos, syntheticNormal);

  float beamStrength = max(max(beam.r, beam.g), beam.b);
  if (beamStrength < 0.0001) discard;

  float dist = length(vWorldPos - uLightPos);
  float fade = 1.0 - smoothstep(0.0, uRange, dist);

  vec3 color = beam * fade;
  float alpha = clamp(beamStrength * fade * 1.5, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
