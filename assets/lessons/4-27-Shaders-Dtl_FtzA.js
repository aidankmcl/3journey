import{A as e,Cs as t,Gi as n,H as r,Ja as i,Jr as a,Ui as o,Yo as s,do as c,n as l,nt as u,tt as d}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{t as f}from"../OrbitControls-D9g5_-6h.js";/* empty css               */import{t as p}from"../lil-gui.esm-Bz-JoirA.js";import{t as m}from"../color-C6QewS2x.js";var h=`uniform mat4 projectionMatrix;
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
}`,_=new p,v={width:window.innerWidth,height:window.innerHeight},y=document.querySelector(`canvas.webgl`);if(!y)throw Error(`Unable to connect to canvas!`);var b=new s().load(m),x=new c,S=new n(1,1,32,32),C=S.attributes.position.count,w=new Float32Array(C);for(let e=0;e<C;e++)w[e]=.5-Math.random();S.setAttribute(`aRandom`,new r(w,1));var T=new i({vertexShader:h,fragmentShader:g,uniforms:{uFrequency:{value:new t(10,5)},uTime:{value:0},uColor:{value:new u(`lightblue`)},uTexture:{value:b}}});_.add(T.uniforms.uFrequency.value,`x`).min(0).max(20).step(.01).name(`Freq X`),_.add(T.uniforms.uFrequency.value,`y`).min(0).max(20).step(.01).name(`Freq Y`);var E=new a(S,T);E.scale.y*=2/3,x.add(E);var D=new o(75,v.width/v.height,.1,100);D.position.set(0,0,1),D.lookAt(E.position),x.add(D);var O=new e(2);x.add(O);var k=new f(D,y);k.enableDamping=!0;var A=new l({canvas:y});A.setSize(v.width,v.height),A.setPixelRatio(Math.min(window.devicePixelRatio,2)),A.render(x,D);var j=new d,M=()=>{let e=j.getElapsedTime();T.uniforms.uTime.value=e,k.update(),A.render(x,D),window.requestAnimationFrame(M)};M(),window.addEventListener(`resize`,()=>{v.width=window.innerWidth,v.height=window.innerHeight,D.aspect=v.width/v.height,D.updateProjectionMatrix(),A.setSize(v.width,v.height),A.setPixelRatio(Math.min(window.devicePixelRatio,2))}),window.addEventListener(`dblclick`,()=>{document.fullscreenElement?document.exitFullscreen():y.requestFullscreen()});