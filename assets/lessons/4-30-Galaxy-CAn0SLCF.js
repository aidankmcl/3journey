import{H as e,U as t,Ui as n,Yi as r,c as i,do as a,fo as o,n as s,nt as c,tt as l}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{t as u}from"../OrbitControls-D9g5_-6h.js";import{t as d}from"../lil-gui.esm-Bz-JoirA.js";var f=`uniform float uSize;
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
}`,m=new d,h=document.querySelector(`canvas.webgl`);if(!h)throw Error(`No canvas available`);var g={width:window.innerWidth,height:window.innerHeight},_=new s({canvas:h});_.setSize(g.width,g.height),_.setPixelRatio(Math.min(window.devicePixelRatio,2));var v=new a,y={particleSize:6,count:2e5,size:.005,radius:5,branches:3,spin:1,randomness:.5,randomnessPower:3,insideColor:`#ff6030`,outsideColor:`#1b3984`},b=null,x=null,S=null,C=()=>{S!==null&&(b&&b.dispose(),x&&x.dispose(),v.remove(S)),b=new t;let n=new Float32Array(y.count*3),i=new Float32Array(y.count*3),a=new Float32Array(y.count*1),s=new Float32Array(y.count*3),l=new c(y.insideColor),u=new c(y.outsideColor);for(let e=0;e<y.count;e++){let t=e*3,r=Math.random()*y.radius,o=e%y.branches/y.branches*Math.PI*2;s[t]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*r,s[t+1]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*r,s[t+2]=Math.random()**+y.randomnessPower*(Math.random()<.5?1:-1)*y.randomness*r,n[t]=Math.cos(o)*r,n[t+1]=0,n[t+2]=Math.sin(o)*r;let c=l.clone();c.lerp(u,r/y.radius),a[e]=Math.random(),i[t]=c.r,i[t+1]=c.g,i[t+2]=c.b}b.setAttribute(`position`,new e(n,3)),b.setAttribute(`color`,new e(i,3)),b.setAttribute(`aScale`,new e(a,1)),b.setAttribute(`aRandomness`,new e(s,3)),console.log(y.particleSize),x=new o({vertexShader:f,fragmentShader:p,depthWrite:!1,vertexColors:!0,blending:2,uniforms:{uTime:{value:0},uSize:{value:y.particleSize*_.getPixelRatio()}}}),S=new r(b,x),v.add(S)};C(),m.add(y,`count`).min(100).max(1e6).step(100).onFinishChange(C),m.add(y,`radius`).min(.01).max(20).step(.01).onFinishChange(C),m.add(y,`branches`).min(2).max(20).step(1).onFinishChange(C),m.add(y,`randomness`).min(0).max(2).step(.001).onFinishChange(C),m.add(y,`randomnessPower`).min(1).max(10).step(.001).onFinishChange(C),m.addColor(y,`insideColor`).onFinishChange(C),m.addColor(y,`outsideColor`).onFinishChange(C),m.add(y,`particleSize`).min(1).max(10).step(.05).name(`Size of particles`).onFinishChange(C),window.addEventListener(`resize`,()=>{g.width=window.innerWidth,g.height=window.innerHeight,w.aspect=g.width/g.height,w.updateProjectionMatrix(),_.setSize(g.width,g.height),_.setPixelRatio(Math.min(window.devicePixelRatio,2))});var w=new n(75,g.width/g.height,.1,100);w.position.x=3,w.position.y=3,w.position.z=3,v.add(w);var T=new u(w,h);T.enableDamping=!0;var E=new l,D=()=>{let e=E.getElapsedTime();x&&(x.uniforms.uTime.value+=e),T.update(),_.render(v,w),window.requestAnimationFrame(D)};D();