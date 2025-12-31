import{It as e,N as t,Sn as n,_n as r,a as i,b as a,cn as o,n as s,nn as c,tn as l,vt as u,x as d}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as f}from"../OrbitControls-D8EFuDj6.js";import{t as p}from"../lil-gui.esm-DBlFozw-.js";import"../BufferGeometryUtils-B3Y9T7UZ.js";import{t as m}from"../GLTFLoader-BYphv5hi.js";var h=`precision mediump float;

uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

precision mediump float;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  
  float glitchTime = uTime + modelPosition.y;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
  glitchStrength /= 3.0; 
  glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
  glitchStrength *= 0.2;
  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  gl_Position = projectedPosition;

  vUv = uv;
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}`,g=`precision mediump float;

uniform float uTime;
uniform vec3 uClearColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  
  vec3 viewPosition = normalize(vPosition - cameraPosition);
  vec3 normedNormal = normalize(vNormal);
  if (!gl_FrontFacing) normedNormal *= -1.0;

  
  float angle = dot(viewPosition, normedNormal);
  float fresnel = pow(1.0 + angle, 2.0);

  
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  
  float falloff = smoothstep(0.8, 0.0, fresnel);

  
  float holo = stripes * fresnel;
  holo += fresnel * 1.25;
  holo *= falloff;

  
  gl_FragColor = vec4(uClearColor, holo);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,_=new p,v=document.querySelector(`canvas.webgl`);if(!v)throw Error(`Unable to connect to canvas!`);var y=new l,b=new m,x={width:window.innerWidth,height:window.innerHeight};window.addEventListener(`resize`,()=>{x.width=window.innerWidth,x.height=window.innerHeight,S.aspect=x.width/x.height,S.updateProjectionMatrix(),T.setSize(x.width,x.height),T.setPixelRatio(Math.min(window.devicePixelRatio,2))});var S=new e(25,x.width/x.height,.1,100);S.position.set(7,7,7),y.add(S);var C=new f(S,v);C.enableDamping=!0;var w={clearColor:`#1d1f2a`},T=new s({canvas:v,antialias:!0});T.setClearColor(w.clearColor),T.setSize(x.width,x.height),T.setPixelRatio(Math.min(window.devicePixelRatio,2)),_.addColor(w,`clearColor`).onChange(()=>{T.setClearColor(w.clearColor)});var E=new c({blending:2,side:2,transparent:!0,depthWrite:!1,vertexShader:h,fragmentShader:g,uniforms:{uTime:new n(0),uClearColor:new n(new d(0,20,120))}}),D=new u(new r(.6,.25,128,32),E);D.position.x=3,y.add(D);var O=new u(new o,E);O.position.x=-3,y.add(O);var k=null;b.load(`./resources/suzanne.glb`,e=>{k=e.scene,k.traverse(e=>{let t=e;t.isMesh&&(t.material=E)}),y.add(k)});var A=new a,j=()=>{let e=A.getDelta();E.uniforms.uTime.value=A.getElapsedTime(),k&&(k.rotation.x-=e*.1,k.rotation.y+=e*.2),O.rotation.x-=e*.2,O.rotation.y+=e*.3,D.rotation.x-=e*.1,D.rotation.y+=e*.2,C.update(),T.render(y,S),window.requestAnimationFrame(j)};j();