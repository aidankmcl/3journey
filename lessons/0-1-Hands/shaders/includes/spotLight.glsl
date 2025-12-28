
vec3 spotLight(
  vec3 lightPosition,
  vec3 lightTarget,
  float lightIntensity,
  vec3 lightColor,
  float falloffDist,
  float specularPower,
  vec3 normal,
  vec3 viewDirection,
  vec3 position
) {
  vec3 lightDeltaToFrag = lightPosition - position;
  float lightDistanceToFrag = length(lightDeltaToFrag);
  vec3 lightDirectionToFrag = normalize(lightDeltaToFrag);
  vec3 lightReflectionOffFrag = reflect(- lightDirectionToFrag, normal);

  // Shading
  float shading = dot(normal, lightDirectionToFrag);
  shading = max(0.0, shading);

  // Specular
  float specular = - dot(lightReflectionOffFrag, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  // Decay
  float decay = 1.0 - min(1.0, abs(lightDistanceToFrag / falloffDist));

  float angle = 3.14 / 16.0;
  float coneFalloffRadius = lightDistanceToFrag * atan(angle);
  vec3 coneBaseCenter = lightPosition + vec3(0.0, -1.0, 0.0) * lightDistanceToFrag;
  float coneFalloff = max(0.0, coneFalloffRadius - distance(coneBaseCenter, position));

  return lightColor * lightIntensity * decay * (shading + specular) * coneFalloff;
}
