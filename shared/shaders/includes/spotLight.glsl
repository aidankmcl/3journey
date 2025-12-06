
vec3 spotLight(
  vec3 lightPosition,
  vec3 lightTarget,
  float angle,
  float lightIntensity,
  vec3 lightColor,
  float falloffDist,
  float specularPower,
  vec3 normal,
  vec3 viewDirection,
  vec3 position
) {
  vec3 lightDeltaToFrag = position - lightPosition;
  float lightDistanceToFrag = length(lightDeltaToFrag);
  vec3 lightDirectionToFrag = normalize(lightDeltaToFrag);
  vec3 lightReflectionOffFrag = reflect(-lightDirectionToFrag, normal);

  if (lightDistanceToFrag > falloffDist) return vec3(0.0);

  // Shading
  vec3 lightDirFromFrag = -lightDirectionToFrag;
  float shading = dot(normal, lightDirFromFrag);
  shading = max(0.0, shading);

  // Decay
  float decay = 1.0 - clamp(lightDistanceToFrag / falloffDist, 0.0, 1.0);

  // Cone falloff
  vec3 spotDirection = normalize(lightTarget - lightPosition);
  float angleCos = dot(lightDirectionToFrag, spotDirection);  // dot-ing normalized vectors is proportional to cos(theta)
  float cutOffCos = cos(angle / 2.0);
  // If we are outside the cone, return black
  if (angleCos < cutOffCos) return vec3(0.0);
  float spotEffect = smoothstep(cutOffCos, 1.0, angleCos);

  float coneFalloffRadius = lightDistanceToFrag * atan(angle);
  vec3 coneBaseCenter = lightPosition + spotDirection * lightDistanceToFrag;
  float coneFalloff = max(0.0, coneFalloffRadius - distance(coneBaseCenter, position));

  return lightColor * lightIntensity * decay * shading * spotEffect;
}
