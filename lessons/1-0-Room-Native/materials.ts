import * as THREE from 'three';

import cookieVert from './shaders/cookie.vert';
import cookieFrag from './shaders/cookie.frag';
import cookieWithShadowFrag from './shaders/cookieWithShadow.frag';

// ============================================================================
// Shared Uniforms
// ============================================================================

export interface CookieUniforms {
  [uniform: string]: THREE.IUniform;
  uLightPos: { value: THREE.Vector3 };
  uRotation: { value: number };
}

export interface ShadowCookieUniforms extends CookieUniforms {
  uShadowMap: { value: THREE.CubeTexture };
}

/**
 * Create shared uniforms for cookie materials
 */
export function createCookieUniforms(lightPos: THREE.Vector3): CookieUniforms {
  return {
    uLightPos: { value: lightPos.clone() },
    uRotation: { value: 0 },
  };
}

/**
 * Create uniforms for shadow-enabled cookie materials
 */
export function createShadowCookieUniforms(
  baseUniforms: CookieUniforms,
  shadowMapTexture: THREE.CubeTexture
): ShadowCookieUniforms {
  return {
    ...baseUniforms,
    uShadowMap: { value: shadowMapTexture },
  };
}

// ============================================================================
// Material Factories
// ============================================================================

export interface CookieMaterialOptions {
  side?: THREE.Side;
  transparent?: boolean;
  depthWrite?: boolean;
}

/**
 * Create a cookie-pattern material (no shadows)
 */
export function createCookieMaterial(
  uniforms: CookieUniforms,
  options: CookieMaterialOptions = {}
): THREE.ShaderMaterial {
  const {
    side = THREE.FrontSide,
    transparent = false,
    depthWrite = true,
  } = options;

  return new THREE.ShaderMaterial({
    vertexShader: cookieVert,
    fragmentShader: cookieFrag,
    uniforms,
    side,
    transparent,
    depthWrite,
  });
}

/**
 * Create a cookie-pattern material with shadow support
 */
export function createShadowCookieMaterial(
  uniforms: ShadowCookieUniforms,
  options: Omit<CookieMaterialOptions, 'transparent' | 'depthWrite'> = {}
): THREE.ShaderMaterial {
  const { side = THREE.FrontSide } = options;

  return new THREE.ShaderMaterial({
    vertexShader: cookieVert,
    fragmentShader: cookieWithShadowFrag,
    uniforms,
    side,
  });
}
