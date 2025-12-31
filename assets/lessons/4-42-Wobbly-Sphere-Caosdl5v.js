import{Ct as e,F as t,Ft as n,It as r,Rt as i,Sn as a,U as o,b as s,bt as c,i as l,j as u,n as d,qt as f,tn as p,vt as m,wt as h,x as g}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as _}from"../OrbitControls-D8EFuDj6.js";/* empty css               */import{t as v}from"../lil-gui.esm-DBlFozw-.js";import{t as y}from"../HDRLoader-CpVDxRjD.js";import{t as b}from"../BufferGeometryUtils-B3Y9T7UZ.js";import{t as x}from"../three-custom-shader-material.es-B2ErjGFs.js";var S=`/3journey/assets/urban_alley_01_1k-BFAyyd19.hdr`,C=`uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;
varying vec2 vUv;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 

  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

float getWobble(vec3 position)
{
  vec3 warpedPosition = position;
  warpedPosition += simplexNoise4d(vec4(
    position * uWarpPositionFrequency,
    uTime * uWarpTimeFrequency
  )) * uWarpStrength;

  return simplexNoise4d(vec4(
    warpedPosition * uPositionFrequency,
    uTime * uTimeFrequency
  )) * uStrength;
}

void main()
{
  
  
  vec3 biTangent = cross(normal, tangent.xyz);
  float shift = 0.01;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + biTangent * shift;

  float wobble = getWobble(csm_Position);
  csm_Position += wobble * normal;
  positionA += getWobble(positionA) * normal;
  positionB += getWobble(positionB) * normal;

  
  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = cross(toA, toB);

  vWobble = wobble / uStrength;  
  vUv = uv;
}`,w=`uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying float vWobble;

void main()
{
  
  
  
  
  float colorMix = smoothstep(-1.0, 1.0, vWobble);
  csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

  
  

  csm_Roughness = 1.0 - colorMix;
}`,T=new v({width:325}),E=document.querySelector(`canvas.webgl`);if(!E)throw Error(`No canvas available`);var D=new p;new y().load(S,e=>{e.mapping=303,D.background=e,D.environment=e});var O={uTime:new a(0),uPositionFrequency:new a(.5),uTimeFrequency:new a(.4),uStrength:new a(.3),uWarpPositionFrequency:new a(.5),uWarpTimeFrequency:new a(.4),uWarpStrength:new a(.3),uColorA:new a(new g(`red`)),uColorB:new a(new g(`blue`))},k=new x({baseMaterial:e,vertexShader:C,fragmentShader:w,uniforms:O,metalness:0,roughness:.5,color:`#ffffff`,transmission:0,ior:1.5,thickness:1.5,transparent:!0,wireframe:!1}),A=new x({baseMaterial:c,vertexShader:C,uniforms:O,depthPacking:f});T.add(O.uPositionFrequency,`value`,0,1,.001).name(`uPositionFrequency`),T.add(O.uTimeFrequency,`value`,0,1,.001).name(`uTimeFrequency`),T.add(O.uStrength,`value`,0,1,.001).name(`uStrength`),T.add(O.uWarpPositionFrequency,`value`,0,1,.001).name(`uWarpPositionFrequency`),T.add(O.uWarpTimeFrequency,`value`,0,1,.001).name(`uWarpTimeFrequency`),T.add(O.uWarpStrength,`value`,0,1,.001).name(`uWarpStrength`),T.addColor(O.uColorA,`value`).name(`uColorA`),T.addColor(O.uColorB,`value`).name(`uColorB`),T.add(k,`metalness`,0,1,.001),T.add(k,`roughness`,0,1,.001),T.add(k,`transmission`,0,1,.001),T.add(k,`ior`,0,10,.001),T.add(k,`thickness`,0,10,.001),T.addColor(k,`color`);var j=new o(2.5,50);j=b(j),j.computeTangents();var M=new m(j,k);M.customDepthMaterial=A,M.receiveShadow=!0,M.castShadow=!0,D.add(M);var N=new m(new i(15,15,15),new h);N.receiveShadow=!0,N.rotation.y=Math.PI,N.position.y=-5,N.position.z=5,D.add(N);var P=new u(`#ffffff`,3);P.castShadow=!0,P.shadow.mapSize.set(1024,1024),P.shadow.camera.far=15,P.shadow.normalBias=.05,P.position.set(.25,2,-2.25),D.add(P);var F={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)};window.addEventListener(`resize`,()=>{F.width=window.innerWidth,F.height=window.innerHeight,F.pixelRatio=Math.min(window.devicePixelRatio,2),I.aspect=F.width/F.height,I.updateProjectionMatrix(),R.setSize(F.width,F.height),R.setPixelRatio(F.pixelRatio)});var I=new r(35,F.width/F.height,.1,100);I.position.set(13,-3,-5),D.add(I);var L=new _(I,E);L.enableDamping=!0;var R=new d({canvas:E,antialias:!0});R.shadowMap.enabled=!0,R.shadowMap.type=2,R.toneMapping=4,R.toneMappingExposure=1,R.setSize(F.width,F.height),R.setPixelRatio(F.pixelRatio);var z=new s,B=()=>{let e=z.getElapsedTime();O.uTime.value=e,L.update(),R.render(D,I),window.requestAnimationFrame(B)};B();