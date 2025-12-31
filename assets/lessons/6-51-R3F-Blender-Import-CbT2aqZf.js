import{Dn as e,Nn as t,Sn as n,_t as r,a as i,en as a,x as o}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{c as s,d as c,g as l,r as u,t as d,v as f}from"../OrbitControls-C8bTcdOa.js";import{t as p}from"../Gltf-CQ1upqUb.js";import"../BufferGeometryUtils-CXjXNIeq.js";import{t as m}from"../Texture-CgfmiNIH.js";var h=t(l()),g=t(f()),_=`/3journey/assets/portal-keys-DKVQAXsA.glb`,v=`/3journey/assets/baked-5LlsmURY.jpg`,y=`uniform float uTime;
uniform vec3 uDarkColor;
uniform vec3 uLightColor;

varying vec2 vUv;

vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    
    return 2.2 * n_xyz;
}

void main()
{
  float strength = cnoise(vec3(vUv * 5.0, uTime));
  vec3 color = mix(uLightColor, uDarkColor, strength);
  gl_FragColor = vec4(color, 1.0);
}`,b=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = modelPosition.xyz;
}`,x=t(c());function S(){let{nodes:e}=p(_),t=m(v);t.flipY=!1,t.colorSpace=a;let r=(0,g.useMemo)(()=>({uTime:new n(0),uDarkColor:new n(new o(`#4cff4f`)),uLightColor:new n(new o(`#d7ffdf`))}),[]);return s(e=>{r.uTime.value=e.clock.elapsedTime}),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`mesh`,{geometry:e.monitorscreen.geometry,rotation:e.monitorscreen.rotation,position:e.monitorscreen.position,children:(0,x.jsx)(`shaderMaterial`,{vertexShader:b,fragmentShader:y,uniforms:r})}),(0,x.jsx)(`mesh`,{geometry:e.main.geometry,rotation:e.main.rotation,position:e.main.position,children:(0,x.jsx)(`meshBasicMaterial`,{map:t})})]})}var C=`uniform float uTime;
uniform vec3 uScale; 

attribute float aDropOffset;

varying float vDropOffset;
varying vec2 vUv;

void main() {
  vUv = uv;

  
  
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

  
  
  vec3 direction = cameraPosition - instancePos;
  direction.y = 0.0;
  direction = normalize(direction);

  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 right = cross(up, direction);

  
  
  mat3 billboardRot = mat3(right, up, direction);

  
  
  vec3 finalPos = billboardRot * (position * uScale);

  
  
  
  gl_Position = projectionMatrix * viewMatrix * vec4(finalPos + instancePos, 1.0);

  vDropOffset = aDropOffset;
}`,w=`uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uGlyphsTexture;

varying float vDropOffset;
varying vec2 vUv;

float dropDuration = 2.0;

void main() {
  
  
  float shiftedY = mod(vUv.y + (uTime / dropDuration) + vDropOffset, 1.0);
  
  

  float dropPos = pow(1.0 - shiftedY, 4.0);
  float glyphOpacity = texture(uGlyphsTexture, vUv).r;
  
  
  
  
  
  gl_FragColor = vec4(uColor, dropPos * glyphOpacity);
}`,T=`/3journey/assets/glyphs-C34oUSh3.jpg`;function E(){let t=(0,g.useRef)(null),i=m(T),a=(0,g.useMemo)(()=>{let e=new Float32Array(50);for(let t=0;t<50;t++)e[t]=Math.random();return e},[50]),c=(0,g.useMemo)(()=>({uTime:new n(0),uColor:new n(new o(`#00ff00`)),uScale:new n(new e(.075,1.5,1)),uGlyphsTexture:new n(i)}),[i]);return s(e=>{c.uTime.value=e.clock.elapsedTime}),(0,g.useEffect)(()=>{if(t.current)for(let e=0;e<50;e++)t.current.setMatrixAt(e,new r(1,1,1,Math.random()*10-5,1,1,1,Math.random()*5+.75,1,1,1,Math.random()*10-5,1,1,1,1))},[]),(0,x.jsxs)(`instancedMesh`,{ref:t,args:[,,50],children:[(0,x.jsx)(`planeGeometry`,{args:[1,1],children:(0,x.jsx)(`instancedBufferAttribute`,{attach:`attributes-aDropOffset`,args:[a,1]})}),(0,x.jsx)(`shaderMaterial`,{vertexShader:C,fragmentShader:w,transparent:!0,depthWrite:!1,blending:2,uniforms:c})]})}function D(){return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`ambientLight`,{intensity:1}),(0,x.jsx)(`directionalLight`,{position:[1,1,1],intensity:1}),(0,x.jsxs)(g.Suspense,{children:[(0,x.jsx)(E,{}),(0,x.jsx)(S,{})]})]})}function O(){return(0,x.jsxs)(u,{camera:{position:[7,5,6]},children:[(0,x.jsx)(`color`,{attach:`background`,args:[`#090f06`]}),(0,x.jsx)(d,{enableDamping:!0,dampingFactor:.05}),(0,x.jsx)(D,{})]})}var k=O,A=document.getElementById(`root`);if(!A)throw Error(`Root element #root not found`);(0,h.createRoot)(A).render((0,x.jsx)(k,{}));