uniform float uTime;
uniform vec3 uScale; // We can use a uniform if all rain drops are same size

attribute float aDropOffset;

varying float vDropOffset;
varying vec2 vUv;

void main() {
  vUv = uv;

  // 1. Get Instance Position
  // In Three.js instancing, instanceMatrix column 3 is position
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

  // 2. Billboarding (Y-Axis Only)
  // Calculate direction to camera, but flatten Y to 0 to keep upright
  vec3 direction = cameraPosition - instancePos;
  direction.y = 0.0;
  direction = normalize(direction);

  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 right = cross(up, direction);

  // 3. Construct Rotation Matrix (Model View Rotation)
  // This matrix rotates the plane to face the camera
  mat3 billboardRot = mat3(right, up, direction);

  // 4. Apply Scale & Rotation to Local Position
  // We take the standard plane position, scale it (squish X), then rotate it
  vec3 finalPos = billboardRot * (position * uScale);

  // 5. Add Instance Offset and Project
  // We skip multiplying by the full instanceMatrix rotation because we 
  // calculated our own billboard rotation above.
  gl_Position = projectionMatrix * viewMatrix * vec4(finalPos + instancePos, 1.0);

  vDropOffset = aDropOffset;
}