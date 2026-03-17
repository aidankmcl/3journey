precision mediump float;

varying vec2 vUv;

uniform float uElapsed;

float random(vec2 st)
{
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float pseudoRandom(float flooredVal)
{
  return fract(sin(flooredVal) * 43758.5453123);
}

#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  // float pattern = vUv.x;

  // float pattern = vUv.y;

  // float pattern = 1.0 - vUv.y;

  // float pattern = step(0.8, mod(10.0 * vUv.y, 1.0));

  // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0));

  // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0)) + step(0.8, mod(10.0 * vUv.y, 1.0));

  // float pattern = step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));

  // float pattern = step(0.2, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));

  // float pattern = step(0.5, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));
  // pattern += step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.5, mod(10.0 * vUv.y, 1.0));

  // // Pluses, offset
  // float horizontal = step(0.6, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y, 1.0));
  // horizontal += step(mod(10.0 * vUv.x, 1.0), 0.2) * step(0.8, mod(10.0 * vUv.y, 1.0));
  // float vertical = step(0.8, mod(10.0 * vUv.x, 1.0)) * step(0.6, mod(10.0 * vUv.y, 1.0));
  // vertical += step(0.8, mod(10.0 * vUv.x, 1.0)) * step(mod(10.0 * vUv.y, 1.0), 0.2);
  // float pattern = horizontal + vertical;

  // // Pluses, proper
  // float horizontal = step(0.4, mod(10.0 * vUv.x, 1.0));
  // horizontal *= step(0.8, mod(10.0 * vUv.y + 0.2, 1.0));
  // float vertical = step(0.8, mod(10.0 * vUv.x + 0.2, 1.0));
  // vertical *= step(0.4, mod(10.0 * vUv.y, 1.0));
  // float pattern = horizontal + vertical;

  // // Question mark-ish, random find
  // float horizontal = step(0.6, mod(10.0 * vUv.x, 1.0)) * step(0.8, mod(10.0 * vUv.y + 0.2, 1.0));
  // horizontal += step(mod(10.0 * vUv.x + 0.2, 1.0), 0.2) * step(0.8, mod(10.0 * vUv.y, 1.0));
  // float vertical = step(0.8, mod(10.0 * vUv.x + 0.2, 1.0)) * step(0.6, mod(10.0 * vUv.y + 0.2, 1.0));
  // vertical += step(0.8, mod(10.0 * vUv.x + 0.2, 1.0)) * step(mod(10.0 * vUv.y, 1.0), 0.2);
  // float pattern = horizontal + vertical;

  // // Parting of the sea
  // float pattern = abs(0.5 - vUv.x);

  // // Blinding light
  // float pattern = abs(0.5 - vUv.y) / abs(0.5 - vUv.x);

  // // DNA
  // float pattern = abs(0.5 - abs(0.5 - vUv.x) / abs(0.5 - vUv.y));

  // // City Corner
  // float pattern = min(abs(0.5 - vUv.x), abs(0.5 - vUv.y));

  // // Corridor
  // float pattern = max(abs(0.5 - vUv.x), abs(0.5 - vUv.y));

  // // 1-bit Corridor
  // // float pattern = step(0.2, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
  // // 1-bit Corridor, large blank
  // // float pattern = step(0.4, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
  // // 1-bit Corridor, adjustable inner and outer edges
  // float pattern = 1.0 - step(0.4, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
  // pattern -= 1.0 - step(0.3, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));

  // // Swatch, horizontal
  // float pattern = floor(vUv.x * 10.0) / 10.0;

  // // Swatch, diagonal
  // float pattern = min(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);

  // // Swatch, both axes
  // float pattern = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

  // // Static
  // float pattern = random(vUv);

  // // Big static
  // float pattern = pseudoRandom(floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0);

  // // Big static official
  // vec2 gridUV = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0) / 10.0
  // );
  // float pattern = random(gridUV);

  // // Static rotated
  // vec2 gridUV = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor((vUv.y + vUv.x) * 10.0) / 10.0
  // );
  // float pattern = random(gridUV);

  // // Waves
  // float pattern = floor(vUv.x * vUv.y * 10.0) / 10.0 + 0.1;

  // // Circle gradient
  // float pattern = length(vUv);

  // // Ghostly circle
  // float pattern = length(vUv - 0.5);

  // // Ghostly circle parameterized
  // float pattern = distance(vUv, vec2(0.25, 0.75));

  // !!! Dancing Stars
  vec2 dotLocation = vec2(0.5 + 0.25 * cos(uElapsed), 0.5 + 0.25 * sin(uElapsed));
  float pattern = 0.01 / distance(vUv, dotLocation);
  vec2 dot2Location = vec2(0.5 + 0.25 * cos(uElapsed + 2.0), 0.5 + 0.25 * sin(uElapsed + 6.0));
  pattern += 0.01 / distance(vUv, dot2Location);
  vec2 dot3Location = vec2(0.5 + 0.25 * cos(uElapsed + 5.0), 0.5 + 0.25 * sin(uElapsed + 1.0));
  pattern += 0.01 / distance(vUv, dot3Location);

  // // Stretchy star
  // float xScale = 20.0;
  // float yScale = 4.0;
  // vec2 dotLocation = vec2(0.5 / xScale, 0.5 / yScale);
  // float pattern = 0.01 / distance(vec2(vUv.x / xScale, vUv.y / yScale), dotLocation);

  // // 4-corner Star
  // vec2 lightX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
  // float pattern = 0.01 / distance(lightX, vec2(0.5));
  // vec2 lightY = vec2(vUv.x * 0.5 + 0.25, vUv.y * 0.1 + 0.45);
  // pattern *= 0.01 / distance(lightY, vec2(0.5));

  // // 4-corner Star, rotated
  // vec2 rotUV = rotate(vUv, PI * 0.25, vec2(0.5));
  // vec2 lightX = vec2(rotUV.x * 0.1 + 0.45, rotUV.y * 0.5 + 0.25);
  // float pattern = 0.01 / distance(lightX, vec2(0.5));
  // vec2 lightY = vec2(rotUV.x * 0.5 + 0.25, rotUV.y * 0.1 + 0.45);
  // pattern *= 0.01 / distance(lightY, vec2(0.5));

  // // Circle mask
  // float pattern = 1.0 - (1.0 - step(0.25, distance(vUv, vec2(0.5))));

  // // Ring mask
  // float pattern = step(0.01, abs(0.25 - distance(vUv, vec2(0.5))));

  // // Ring mask, inverted
  // float pattern = 1.0 - step(0.01, abs(0.25 - distance(vUv, vec2(0.5))));

  // // Ring mask, wobbled
  // vec2 wavUV = vec2(vUv.x, vUv.y + cos(vUv.x * 30.0) * 0.1);
  // float pattern = 1.0 - step(0.01, abs(0.25 - distance(wavUV, vec2(0.5))));

  // // Ring mask, blobbed
  // float strength = 30.0;
  // float strength = 100.0;
  // vec2 wavUV = vec2(vUv.x + sin(vUv.y * strength) * 0.1, vUv.y + cos(vUv.x * strength) * 0.1);
  // float pattern = 1.0 - step(0.01, abs(0.25 - distance(wavUV, vec2(0.5))));

  // // Ring mask, blobbed, animated
  // float strength = 100.0;
  // vec2 wavUV = vec2(vUv.x + sin(vUv.y * strength + uElapsed) * 0.1, vUv.y + cos(vUv.x * strength + uElapsed) * 0.1);
  // float pattern = 1.0 - step(0.01, abs(0.25 - distance(wavUV, vec2(0.5))));

  // // Radar
  // vec2 rotUV = rotate(vUv, PI * (0.25 - uElapsed), vec2(0.5));
  // float pattern = atan(rotUV.x - 0.5, rotUV.y - 0.5);
  // pattern /= PI * 2.0;
  // pattern += 0.5;

  // // Radar, many
  // vec2 rotUV = rotate(vUv, PI * (0.25 - uElapsed * 0.1), vec2(0.5));
  // float angle = atan(rotUV.x - 0.5, rotUV.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float pattern = mod(angle * 20.0, 1.0);

  // // Radar, many
  // vec2 rotUV = rotate(vUv, PI * (0.25 - uElapsed * 0.1), vec2(0.5));
  // float angle = atan(rotUV.x - 0.5, rotUV.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float pattern = sin(angle * 100.0);

  // // Ring mask, wavy
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  // float radius = 0.25 + sin(angle * 100.0) * 0.02;
  // float pattern = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  // // Perlin
  // float pattern = cnoise(vUv * 10.0);
  
  // // Perlin, stark
  // float pattern = step(0.2, cnoise(vUv * 10.0));

  // // Perlin, outline
  // vec2 shiftedUV = vec2(vUv.x, vUv.y + uElapsed * 0.1);
  // float pattern = sin(cnoise(shiftedUV * 30.0) * 10.0);
  // // !!! Perlin, outline, stark
  // pattern = step(0.9, pattern);

  // Set special colors
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, clamp(pattern, 0.0, 1.0)); // !!!
  vec3 color = mixedColor;

  gl_FragColor = vec4(color, 1.0);
}
