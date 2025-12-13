import * as THREE from 'three';
import { SHADOW_CONFIG } from './config';

// ============================================================================
// Shadow System
// ============================================================================

/**
 * Manages custom cube shadow map rendering from a point light position.
 * Uses a CubeCamera to render depth values from the light's perspective.
 */
export class ShadowSystem {
  readonly cubeRenderTarget: THREE.WebGLCubeRenderTarget;
  readonly camera: THREE.CubeCamera;
  readonly depthMaterial: THREE.ShaderMaterial;

  private readonly config = SHADOW_CONFIG;

  constructor() {
    // Create cube render target for shadow map
    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(this.config.mapSize, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    });

    // Camera for rendering shadow cube map
    this.camera = new THREE.CubeCamera(
      this.config.near,
      this.config.far,
      this.cubeRenderTarget
    );

    // Depth material for rendering to shadow map (stores distance from light)
    this.depthMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uLightPos;
        uniform float uShadowFar;
        varying vec3 vWorldPosition;
        void main() {
          float depth = length(vWorldPosition - uLightPos) / uShadowFar;
          gl_FragColor = vec4(vec3(depth), 1.0);
        }
      `,
      uniforms: {
        uLightPos: { value: new THREE.Vector3(0, -1, 0) },
        uShadowFar: { value: this.config.far },
      },
    });
  }

  /**
   * Get the shadow map texture for use in other materials
   */
  get texture(): THREE.CubeTexture {
    return this.cubeRenderTarget.texture;
  }

  /**
   * Render the shadow cube map from the given light position
   * 
   * @param renderer - The WebGL renderer
   * @param scene - The scene to render
   * @param lightPos - Position of the light source
   * @param shadowCasters - Array of meshes that cast shadows
   * @param excludeFromRender - Array of objects to hide during shadow pass
   */
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    lightPos: THREE.Vector3,
    shadowCasters: THREE.Mesh[],
    excludeFromRender: THREE.Object3D[] = []
  ): void {
    // Position shadow camera at light position
    this.camera.position.copy(lightPos);
    this.depthMaterial.uniforms.uLightPos.value.copy(lightPos);

    // Store original state
    const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    const originalBackground = scene.background;
    const originalVisibility = new Map<THREE.Object3D, boolean>();

    // Set background to white (1.0) = max depth = no shadow caster
    scene.background = new THREE.Color(1, 1, 1);

    // Hide objects that shouldn't be in shadow map
    excludeFromRender.forEach(obj => {
      originalVisibility.set(obj, obj.visible);
      obj.visible = false;
    });

    // Swap shadow casters to depth material
    shadowCasters.forEach(obj => {
      originalMaterials.set(obj, obj.material);
      obj.material = this.depthMaterial;
    });

    // Render the 6 faces of the cube shadow map
    this.camera.update(renderer, scene);

    // Restore everything
    scene.background = originalBackground;
    
    excludeFromRender.forEach(obj => {
      obj.visible = originalVisibility.get(obj)!;
    });

    shadowCasters.forEach(obj => {
      obj.material = originalMaterials.get(obj)!;
    });
  }
}
