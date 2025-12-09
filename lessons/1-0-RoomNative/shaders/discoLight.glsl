
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

vec3 getDiscoLight(vec3 position, vec3 lightPos, vec3 normal, float rotation) {
  vec3 lightDir = normalize(position - lightPos);
  
  // phi: -PI to PI (around the equator)
  // theta: 0 to PI (top to bottom)
  float phi = atan(lightDir.z, lightDir.x) + rotation; 
  float theta = acos(lightDir.y);

  float density = PI; // How many dots around
  // float density = PI * 2.0; // How many dots around
  float gridX = phi * density * 1.01;
  float gridY = theta * density;

  vec2 cellID = floor(vec2(gridX, gridY));

  // Cell UV
  vec2 uv = fract(vec2(gridX, gridY)) - 0.5;
  float dist = length(uv);

  float radius = 0.45;
  float spot = 1.0 - smoothstep(radius - 0.05, radius, dist);

  vec3 beamColor = vec3(0.0);
  float xMod = mod(cellID.x, 2.0);
  float yMod = mod(cellID.y, 2.0);

  if (yMod == 0.0) {
    float third = 1.0 - mod(cellID.x, 3.0);
    beamColor = vec3(xMod, third, 0.0); // Red, Yellow, Green Row
  } else {
    float third = clamp(1.0 - mod(cellID.x, 4.0), 0.0, 1.0);
    beamColor = vec3(third, 0.0, 1.0); // Blue, magenta Row
  }

  // Black out diagonals
  if (mod(cellID.x + cellID.y, 2.0) == 0.0) {
    beamColor = vec3(0.0, 0.0, 0.0);
  }

  if (theta > (PI - 0.275) || theta < 0.325) {
    beamColor = vec3(0.0);
  }

  #ifdef FLIP_SIDED
    float intensity = dot(lightDir, normal);
  #else
    float intensity = dot(lightDir, -normal);
  #endif
  beamColor *= max(0.0, intensity);
  // beamColor = vec3(length(beamColor));

  return beamColor * spot;
}
