varying vec3 vWorldPos;

uniform vec3 uLightPos;
uniform float uRange;

#include "./discoLight.glsl"

void main()
{
  // Soft circular point
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;
  float softEdge = 1.0 - smoothstep(0.3, 0.5, dist);

  // Disco beam color
  vec3 lightDir = normalize(vWorldPos - uLightPos);
  vec3 syntheticNormal = -lightDir;
  vec3 beam = getDiscoLight(vWorldPos, uLightPos, syntheticNormal);

  float beamStrength = max(max(beam.r, beam.g), beam.b);
  if (beamStrength < 0.001) discard;

  // Distance fade
  float lightDist = length(vWorldPos - uLightPos);
  float fade = 1.0 - smoothstep(0.0, uRange, lightDist);

  vec3 color = beam * fade;
  float alpha = beamStrength * fade * softEdge * 0.8;

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
