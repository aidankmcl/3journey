varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uLightTarget;
uniform float uLightAngle;

#include "includes/spotLight.glsl"
#include "includes/directionalLight.glsl"


void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(1.0);

  vec3 spot = spotLight(
    uLightPos,      // vec3 lightPosition
    uLightTarget,   // vec3 lightTarget
    uLightAngle,    // float angle (radians)
    1.0,            // float lightIntensity
    vec3(1.0),      // vec3 lightColor
    5.0,            // float falloffDist
    20.0,           // float specularPower
    normal,         // vec3 normal
    viewDirection,  // vec3 viewDirection
    vPosition       // vec3 position
  );

  color *= spot;

  // Final color
  gl_FragColor = vec4(color, length(spot));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}