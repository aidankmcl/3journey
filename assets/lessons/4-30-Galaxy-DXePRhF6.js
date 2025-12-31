import{It as e,Vt as t,a as n,b as r,g as i,h as a,n as o,nn as s,tn as c,x as l}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as u}from"../OrbitControls-D8EFuDj6.js";import{t as d}from"../lil-gui.esm-DBlFozw-.js";var f=`uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.0001;
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vUv = uv;
  vColor = color;
}`,p=`precision mediump float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  
  

  

  
  
  
  
  
  
  
  float dist = distance(gl_PointCoord, vec2(0.5));
  float pattern = 1.0 - dist;
  pattern = pow(pattern, 6.0);

  vec3 color = mix(vec3(0.0), vColor, pattern);

  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}`,m=new d,h=document.querySelector(`canvas.webgl`);if(!h)throw Error(`No canvas available`);var g={width:window.innerWidth,height:window.innerHeight},_=new o({canvas:h});_.setSize(g.width,g.height),_.setPixelRatio(Math.min(window.devicePixelRatio,2));var v=new c,y={particleSize:6,count:2e5,size:.005,radius:5,branches:3,spin:1,randomness:.5,randomnessPower:3,insideColor:`#ff6030`,outsideColor:`#1b3984`},b=null,x=null,S=null,C=()=>{S!==null&&(b&&b.dispose(),x&&x.dispose(),v.remove(S)),b=new i;let e=new Float32Array(y.count*3),n=new Float32Array(y.count*3),r=new Float32Array(y.count*1),o=new Float32Array(y.count*3),c=new l(y.insideColor),u=new l(y.outsideColor);for(let t=0;t<y.count;t++){let i=t*3,a=Math.random()*y.radius,s=t%y.branches/y.branches*Math.PI*2;o[i]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*a,o[i+1]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*a,o[i+2]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*a,e[i]=Math.cos(s)*a,e[i+1]=0,e[i+2]=Math.sin(s)*a;let l=c.clone();l.lerp(u,a/y.radius),r[t]=Math.random(),n[i]=l.r,n[i+1]=l.g,n[i+2]=l.b}b.setAttribute(`position`,new a(e,3)),b.setAttribute(`color`,new a(n,3)),b.setAttribute(`aScale`,new a(r,1)),b.setAttribute(`aRandomness`,new a(o,3)),console.log(y.particleSize),x=new s({vertexShader:f,fragmentShader:p,depthWrite:!1,vertexColors:!0,blending:2,uniforms:{uTime:{value:0},uSize:{value:y.particleSize*_.getPixelRatio()}}}),S=new t(b,x),v.add(S)};C(),m.add(y,`count`).min(100).max(1e6).step(100).onFinishChange(C),m.add(y,`radius`).min(.01).max(20).step(.01).onFinishChange(C),m.add(y,`branches`).min(2).max(20).step(1).onFinishChange(C),m.add(y,`randomness`).min(0).max(2).step(.001).onFinishChange(C),m.add(y,`randomnessPower`).min(1).max(10).step(.001).onFinishChange(C),m.addColor(y,`insideColor`).onFinishChange(C),m.addColor(y,`outsideColor`).onFinishChange(C),m.add(y,`particleSize`).min(1).max(10).step(.05).name(`Size of particles`).onFinishChange(C),window.addEventListener(`resize`,()=>{g.width=window.innerWidth,g.height=window.innerHeight,w.aspect=g.width/g.height,w.updateProjectionMatrix(),_.setSize(g.width,g.height),_.setPixelRatio(Math.min(window.devicePixelRatio,2))});var w=new e(75,g.width/g.height,.1,100);w.position.x=3,w.position.y=3,w.position.z=3,v.add(w);var T=new u(w,h);T.enableDamping=!0;var E=new r,D=()=>{let e=E.getElapsedTime();x&&(x.uniforms.uTime.value+=e),T.update(),_.render(v,w),window.requestAnimationFrame(D)};D();