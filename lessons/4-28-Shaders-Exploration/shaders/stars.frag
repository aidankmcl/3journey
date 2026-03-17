precision mediump float;

varying vec2 vUv;

uniform float uElapsed;

void main()
{
  // !!! Dancing Stars
  vec2 dotLocation = vec2(0.5 + 0.25 * cos(uElapsed), 0.5 + 0.25 * sin(uElapsed));
  float pattern = 0.01 / distance(vUv, dotLocation);
  vec2 dot2Location = vec2(0.5 + 0.25 * cos(uElapsed + 2.0), 0.5 + 0.25 * sin(uElapsed + 6.0));
  pattern += 0.01 / distance(vUv, dot2Location);
  vec2 dot3Location = vec2(0.5 + 0.25 * cos(uElapsed + 5.0), 0.5 + 0.25 * sin(uElapsed + 1.0));
  pattern += 0.01 / distance(vUv, dot3Location);

  // Set special colors
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, clamp(pattern, 0.0, 1.0)); // !!!
  vec3 color = mixedColor;

  gl_FragColor = vec4(color, 1.0);
}
