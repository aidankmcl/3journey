// Bakes disco pattern to equirectangular texture
// UV.x = phi mapped to 0-1, UV.y = theta mapped to 0-1

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

varying vec2 vUv;

void main() {
  // Convert UV to phi/theta
  float phi = (vUv.x - 0.5) * 2.0 * PI;  // -PI to PI
  float theta = vUv.y * PI;               // 0 to PI

  float density = PI * 2.0;
  float gridX = phi * density * 1.01;
  float gridY = theta * density;

  vec2 cellID = floor(vec2(gridX, gridY));

  // Cell UV for spot mask
  vec2 uv = fract(vec2(gridX, gridY)) - 0.5;
  float dist = length(uv);

  float radius = 0.45;
  float spot = 1.0 - smoothstep(radius - 0.05, radius, dist);

  vec3 beamColor = vec3(0.0);
  float xMod = mod(cellID.x, 2.0);
  float yMod = mod(cellID.y, 2.0);

  if (yMod == 0.0) {
    float third = 1.0 - mod(cellID.x, 3.0);
    beamColor = vec3(xMod, third, 0.0);
  } else {
    float third = clamp(1.0 - mod(cellID.x, 4.0), 0.0, 1.0);
    beamColor = vec3(third, 0.0, 1.0);
  }

  // Black out diagonals
  if (mod(cellID.x + cellID.y, 2.0) == 0.0) {
    beamColor = vec3(0.0);
  }

  // Black out poles
  if (theta > (PI - 0.275) || theta < 0.325) {
    beamColor = vec3(0.0);
  }

  gl_FragColor = vec4(beamColor * spot, 1.0);
}
