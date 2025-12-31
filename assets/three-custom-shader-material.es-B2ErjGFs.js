import{mt as e,t}from"./three.module-LFc9tN89.js";var n=`
    
#ifdef IS_VERTEX
    vec3 csm_Position;
    vec4 csm_PositionRaw;
    vec3 csm_Normal;

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        float csm_PointSize;
    #endif
#else
    vec4 csm_DiffuseColor;
    vec4 csm_FragColor;
    float csm_UnlitFac;

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        vec3 csm_Emissive;
        float csm_Roughness;
        float csm_Metalness;
        float csm_Iridescence;
        
        #if defined IS_MESHPHYSICALMATERIAL
            float csm_Clearcoat;
            float csm_ClearcoatRoughness;
            vec3 csm_ClearcoatNormal;
            float csm_Transmission;
            float csm_Thickness;
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        float csm_AO;
    #endif

    // csm_FragNormal
    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        vec3 csm_FragNormal;
    #endif

    float csm_DepthAlpha;
#endif
`,r=`

#ifdef IS_VERTEX
    // csm_Position & csm_PositionRaw
    #ifdef IS_UNKNOWN
        csm_Position = vec3(0.0);
        csm_PositionRaw = vec4(0.0);
        csm_Normal = vec3(0.0);
    #else
        csm_Position = position;
        csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        csm_Normal = normal;
    #endif

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        csm_PointSize = size;
    #endif
#else
    csm_UnlitFac = 0.0;

    // csm_DiffuseColor & csm_FragColor
    #if defined IS_UNKNOWN || defined IS_SHADERMATERIAL || defined IS_MESHDEPTHMATERIAL || defined IS_MESHDISTANCEMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_SHADOWMATERIAL
        csm_DiffuseColor = vec4(1.0, 0.0, 1.0, 1.0);
        csm_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    #else
        #ifdef USE_MAP
            vec4 _csm_sampledDiffuseColor = texture2D(map, vMapUv);

            #ifdef DECODE_VIDEO_TEXTURE
            // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
            _csm_sampledDiffuseColor = vec4(mix(pow(_csm_sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _csm_sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(_csm_sampledDiffuseColor.rgb, vec3(0.04045)))), _csm_sampledDiffuseColor.w);
            #endif

            csm_DiffuseColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
            csm_FragColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
        #else
            csm_DiffuseColor = vec4(diffuse, opacity);
            csm_FragColor = vec4(diffuse, opacity);
        #endif
    #endif

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        csm_Emissive = emissive;
        csm_Roughness = roughness;
        csm_Metalness = metalness;

        #ifdef USE_IRIDESCENCE
            csm_Iridescence = iridescence;
        #else
            csm_Iridescence = 0.0;
        #endif

        #if defined IS_MESHPHYSICALMATERIAL
            #ifdef USE_CLEARCOAT
                csm_Clearcoat = clearcoat;
                csm_ClearcoatRoughness = clearcoatRoughness;
            #else
                csm_Clearcoat = 0.0;
                csm_ClearcoatRoughness = 0.0;
            #endif

            #ifdef USE_TRANSMISSION
                csm_Transmission = transmission;
                csm_Thickness = thickness;
            #else
                csm_Transmission = 0.0;
                csm_Thickness = 0.0;
            #endif
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        csm_AO = 0.0;
    #endif

    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        #ifdef FLAT_SHADED
            vec3 fdx = dFdx( vViewPosition );
            vec3 fdy = dFdy( vViewPosition );
            csm_FragNormal = normalize( cross( fdx, fdy ) );
        #else
            csm_FragNormal = normalize(vNormal);
            #ifdef DOUBLE_SIDED
                csm_FragNormal *= gl_FrontFacing ? 1.0 : - 1.0;
            #endif
        #endif
    #endif

    csm_DepthAlpha = 1.0;
#endif
`,i=`
    varying mat4 csm_internal_vModelViewMatrix;
`,a=`
    csm_internal_vModelViewMatrix = modelViewMatrix;
`,o=`
    varying mat4 csm_internal_vModelViewMatrix;
`,s=`
    
`,c={diffuse:`csm_DiffuseColor`,roughness:`csm_Roughness`,metalness:`csm_Metalness`,emissive:`csm_Emissive`,ao:`csm_AO`,fragNormal:`csm_FragNormal`,clearcoat:`csm_Clearcoat`,clearcoatRoughness:`csm_ClearcoatRoughness`,clearcoatNormal:`csm_ClearcoatNormal`,transmission:`csm_Transmission`,thickness:`csm_Thickness`,iridescence:`csm_Iridescence`,pointSize:`csm_PointSize`,fragColor:`csm_FragColor`,depthAlpha:`csm_DepthAlpha`,unlitFac:`csm_UnlitFac`,position:`csm_Position`,positionRaw:`csm_PositionRaw`,normal:`csm_Normal`},l={[`${c.position}`]:`*`,[`${c.positionRaw}`]:`*`,[`${c.normal}`]:`*`,[`${c.depthAlpha}`]:`*`,[`${c.pointSize}`]:[`PointsMaterial`],[`${c.diffuse}`]:`*`,[`${c.fragColor}`]:`*`,[`${c.fragNormal}`]:`*`,[`${c.unlitFac}`]:`*`,[`${c.emissive}`]:[`MeshStandardMaterial`,`MeshPhysicalMaterial`],[`${c.roughness}`]:[`MeshStandardMaterial`,`MeshPhysicalMaterial`],[`${c.metalness}`]:[`MeshStandardMaterial`,`MeshPhysicalMaterial`],[`${c.iridescence}`]:[`MeshStandardMaterial`,`MeshPhysicalMaterial`],[`${c.ao}`]:[`MeshStandardMaterial`,`MeshPhysicalMaterial`,`MeshBasicMaterial`,`MeshLambertMaterial`,`MeshPhongMaterial`,`MeshToonMaterial`],[`${c.clearcoat}`]:[`MeshPhysicalMaterial`],[`${c.clearcoatRoughness}`]:[`MeshPhysicalMaterial`],[`${c.clearcoatNormal}`]:[`MeshPhysicalMaterial`],[`${c.transmission}`]:[`MeshPhysicalMaterial`],[`${c.thickness}`]:[`MeshPhysicalMaterial`]},u={"*":{"#include <lights_physical_fragment>":t.lights_physical_fragment,"#include <transmission_fragment>":t.transmission_fragment},[`${c.normal}`]:{"#include <beginnormal_vertex>":`
    vec3 objectNormal = ${c.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `},[`${c.position}`]:{"#include <begin_vertex>":`
    vec3 transformed = ${c.position};
  `},[`${c.positionRaw}`]:{"#include <project_vertex>":`
    #include <project_vertex>
    gl_Position = ${c.positionRaw};
  `},[`${c.pointSize}`]:{"gl_PointSize = size;":`
    gl_PointSize = ${c.pointSize};
    `},[`${c.diffuse}`]:{"#include <color_fragment>":`
    #include <color_fragment>
    diffuseColor = ${c.diffuse};
  `},[`${c.fragColor}`]:{"#include <opaque_fragment>":`
    #include <opaque_fragment>
    gl_FragColor = mix(gl_FragColor, ${c.fragColor}, ${c.unlitFac});
  `},[`${c.emissive}`]:{"vec3 totalEmissiveRadiance = emissive;":`
    vec3 totalEmissiveRadiance = ${c.emissive};
    `},[`${c.roughness}`]:{"#include <roughnessmap_fragment>":`
    #include <roughnessmap_fragment>
    roughnessFactor = ${c.roughness};
    `},[`${c.metalness}`]:{"#include <metalnessmap_fragment>":`
    #include <metalnessmap_fragment>
    metalnessFactor = ${c.metalness};
    `},[`${c.ao}`]:{"#include <aomap_fragment>":`
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${c.ao};
    `},[`${c.fragNormal}`]:{"#include <normal_fragment_maps>":`
      #include <normal_fragment_maps>
      normal = ${c.fragNormal};
    `},[`${c.depthAlpha}`]:{"gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );":`
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * 1.0 - ${c.depthAlpha} );
    `,"gl_FragColor = packDepthToRGBA( fragCoordZ );":`
      if(${c.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,"gl_FragColor = packDepthToRGBA( dist );":`
      if(${c.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `},[`${c.clearcoat}`]:{"material.clearcoat = clearcoat;":`material.clearcoat = ${c.clearcoat};`},[`${c.clearcoatRoughness}`]:{"material.clearcoatRoughness = clearcoatRoughness;":`material.clearcoatRoughness = ${c.clearcoatRoughness};`},[`${c.clearcoatNormal}`]:{"#include <clearcoat_normal_fragment_begin>":`
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `},[`${c.transmission}`]:{"material.transmission = transmission;":`
      material.transmission = ${c.transmission};
    `},[`${c.thickness}`]:{"material.thickness = thickness;":`
      material.thickness = ${c.thickness};
    `},[`${c.iridescence}`]:{"material.iridescence = iridescence;":`
      material.iridescence = ${c.iridescence};
    `}},d={clearcoat:[c.clearcoat,c.clearcoatNormal,c.clearcoatRoughness],transmission:[c.transmission],iridescence:[c.iridescence]};function f(e){let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+(t<<6)+(t<<16)-t;let n=t>>>0;return String(n)}function p(e){try{new e}catch(e){if(e.message.indexOf(`is not a constructor`)>=0)return!1}return!0}function m(e){return e.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,``)}var h=class extends e{constructor({baseMaterial:e,vertexShader:t,fragmentShader:n,uniforms:r,patchMap:i,cacheKey:a,...o}){if(!e)throw Error(`CustomShaderMaterial: baseMaterial is required.`);let s;if(p(e)){let t=Object.keys(o).length===0;s=new e(t?void 0:o)}else s=e,Object.assign(s,o);if([`ShaderMaterial`,`RawShaderMaterial`].includes(s.type))throw Error(`CustomShaderMaterial does not support ${s.type} as a base material.`);super(),this.uniforms={},this.vertexShader=``,this.fragmentShader=``;let c=s;c.name=`CustomShaderMaterial<${s.name||s.type}>`,c.update=this.update,c.__csm={prevOnBeforeCompile:s.onBeforeCompile,baseMaterial:s,vertexShader:t,fragmentShader:n,uniforms:r,patchMap:i,cacheKey:a},c.uniforms=this.uniforms={...c.uniforms||{},...r||{}},c.vertexShader=this.vertexShader=t||``,c.fragmentShader=this.fragmentShader=n||``,c.update({fragmentShader:c.fragmentShader,vertexShader:c.vertexShader,uniforms:c.uniforms,patchMap:i,cacheKey:a}),Object.assign(this,c);let l=Object.getOwnPropertyDescriptors(Object.getPrototypeOf(c));for(let e in l){let t=l[e];(t.get||t.set)&&Object.defineProperty(this,e,t)}return Object.defineProperty(this,`type`,{get(){return s.type},set(e){s.type=e}}),this}update({fragmentShader:e,vertexShader:t,uniforms:p,cacheKey:h,patchMap:g}){let _=m(t||``),v=m(e||``),y=this;p&&(y.uniforms=p),t&&(y.vertexShader=t),e&&(y.fragmentShader=e),Object.entries(d).forEach(([e,t])=>{for(let n in t){let r=t[n];(v&&v.includes(r)||_&&_.includes(r))&&(y[e]||(y[e]=1))}});let b=y.__csm.prevOnBeforeCompile,x=(e,t,l)=>{let u,d=``;if(t){let e=t.search(/void\s+main\s*\(\s*\)\s*{/);if(e!==-1){d=t.slice(0,e);let n=0,r=-1;for(let i=e;i<t.length;i++)if(t[i]===`{`&&n++,t[i]===`}`&&(n--,n===0)){r=i;break}if(r!==-1){let n=t.slice(e,r+1);u=n.slice(n.indexOf(`{`)+1,-1)}}else d=t}if(l&&t&&t.includes(c.fragColor)&&u&&(u=`csm_UnlitFac = 1.0;
`+u),e.includes(`//~CSM_DEFAULTS`)){e=e.replace(`void main() {`,`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${d}
          
          void main() {
          `);let t=e.lastIndexOf(`//~CSM_MAIN_END`);if(t!==-1){let n=`
            ${u?`${u}`:``}
            //~CSM_MAIN_END
          `;e=e.slice(0,t)+n+e.slice(t)}}else e=e.replace(/void\s*main\s*\(\s*\)\s*{/gm,`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          //~CSM_DEFAULTS
          ${l?o:i}
          ${n}
  
          ${d}
          
          void main() {
            {
              ${r}
            }
            ${l?s:a}

            ${u?`${u}`:``}
            //~CSM_MAIN_END
          `);return e};y.onBeforeCompile=(e,t)=>{b?.(e,t);let n=g||{},r=y.type,i=r?`#define IS_${r.toUpperCase()};
`:`#define IS_UNKNOWN;
`;e.vertexShader=i+`#define IS_VERTEX
`+e.vertexShader,e.fragmentShader=i+`#define IS_FRAGMENT
`+e.fragmentShader;let a=t=>{for(let n in t){let i=n===`*`||_&&_.includes(n);if(n===`*`||v&&v.includes(n)||i){let i=l[n];if(i&&i!==`*`&&(Array.isArray(i)?!i.includes(r):i!==r)){console.error(`CustomShaderMaterial: ${n} is not available in ${r}. Shader cannot compile.`);return}let a=t[n];for(let t in a){let n=a[t];if(typeof n==`object`){let r=n.type,i=n.value;r===`fs`?e.fragmentShader=e.fragmentShader.replace(t,i):r===`vs`&&(e.vertexShader=e.vertexShader.replace(t,i))}else n&&(e.vertexShader=e.vertexShader.replace(t,n),e.fragmentShader=e.fragmentShader.replace(t,n))}}}};a(u),a(n),e.vertexShader=x(e.vertexShader,_,!1),e.fragmentShader=x(e.fragmentShader,v,!0),p&&(e.uniforms={...e.uniforms,...y.uniforms}),y.uniforms=e.uniforms};let S=y.customProgramCacheKey;y.customProgramCacheKey=()=>(h?.()||f((_||``)+(v||``)))+S?.call(y),y.needsUpdate=!0}clone(){let e=this;return new e.constructor({baseMaterial:e.__csm.baseMaterial.clone(),vertexShader:e.__csm.vertexShader,fragmentShader:e.__csm.fragmentShader,uniforms:e.__csm.uniforms,patchMap:e.__csm.patchMap,cacheKey:e.__csm.cacheKey})}};export{h as t};