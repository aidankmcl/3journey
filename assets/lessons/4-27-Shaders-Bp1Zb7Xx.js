import{En as e,It as t,Rt as n,Yt as r,b as i,h as a,l as o,mn as s,n as c,tn as l,vt as u,x as d}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as f}from"../OrbitControls-D8EFuDj6.js";/* empty css               */import{t as p}from"../lil-gui.esm-DBlFozw-.js";import{t as m}from"../color-C0MrY192.js";var h=`uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
}`,g=`precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main()
{
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation + 0.5;
  gl_FragColor = textureColor;
}`,_=new p,v={width:window.innerWidth,height:window.innerHeight},y=document.querySelector(`canvas.webgl`);if(!y)throw Error(`Unable to connect to canvas!`);var b=new s().load(m),x=new l,S=new n(1,1,32,32),C=S.attributes.position.count,w=new Float32Array(C);for(let e=0;e<C;e++)w[e]=.5-Math.random();S.setAttribute(`aRandom`,new a(w,1));var T=new r({vertexShader:h,fragmentShader:g,uniforms:{uFrequency:{value:new e(10,5)},uTime:{value:0},uColor:{value:new d(`lightblue`)},uTexture:{value:b}}});_.add(T.uniforms.uFrequency.value,`x`).min(0).max(20).step(.01).name(`Freq X`),_.add(T.uniforms.uFrequency.value,`y`).min(0).max(20).step(.01).name(`Freq Y`);var E=new u(S,T);E.scale.y*=2/3,x.add(E);var D=new t(75,v.width/v.height,.1,100);D.position.set(0,0,1),D.lookAt(E.position),x.add(D);var O=new o(2);x.add(O);var k=new f(D,y);k.enableDamping=!0;var A=new c({canvas:y});A.setSize(v.width,v.height),A.setPixelRatio(Math.min(window.devicePixelRatio,2)),A.render(x,D);var j=new i,M=()=>{let e=j.getElapsedTime();T.uniforms.uTime.value=e,k.update(),A.render(x,D),window.requestAnimationFrame(M)};M(),window.addEventListener(`resize`,()=>{v.width=window.innerWidth,v.height=window.innerHeight,D.aspect=v.width/v.height,D.updateProjectionMatrix(),A.setSize(v.width,v.height),A.setPixelRatio(Math.min(window.devicePixelRatio,2))}),window.addEventListener(`dblclick`,()=>{document.fullscreenElement?document.exitFullscreen():y.requestFullscreen()});