uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uGlyphsTexture;

varying float vDropOffset;
varying vec2 vUv;

float dropDuration = 2.0;

void main() {
  // --- YOUR CUSTOM LOGIC HERE ---
  
  float shiftedY = mod(vUv.y + (uTime / dropDuration) + vDropOffset, 1.0);
  // shiftedY = mod(shiftedY * dropDuration, dropDuration);
  // shiftedY /= dropDuration;

  float dropPos = pow(1.0 - shiftedY, 4.0);
  float glyphOpacity = texture(uGlyphsTexture, vUv).r;
  
  // Simple fade at edges
  // float alpha = 1.0 - distance(vUv.y, 0.5) * 2.0;
  
  // gl_FragColor = vec4(uColor, alpha);
  gl_FragColor = vec4(uColor, dropPos * glyphOpacity);
}