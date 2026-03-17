precision mediump float;

varying vec2 vUv;

uniform float uElapsed;

#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

void main()
{
  // Radar
  vec2 rotUV = rotate(vUv, PI * (0.25 - uElapsed), vec2(0.5));
  float pattern = atan(rotUV.x - 0.5, rotUV.y - 0.5);
  pattern /= PI * 2.0;
  pattern += 0.5;

  // Set special colors
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, clamp(pattern, 0.0, 1.0)); // !!!
  vec3 color = mixedColor;

  gl_FragColor = vec4(color, 1.0);
}
