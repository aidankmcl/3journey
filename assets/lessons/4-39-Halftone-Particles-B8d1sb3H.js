import{En as e,It as t,N as n,Rt as r,Sn as i,Vt as a,Zt as o,h as s,mn as c,n as l,nn as u,tn as d,v as f,vt as p,yt as m}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as h}from"../OrbitControls-D8EFuDj6.js";/* empty css               */var g=`/3journey/assets/glow-UcE5q2Bs.png`,_=`uniform vec2 uResolution;
uniform sampler2D uImageTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
  vec4 textureColor = texture(uImageTexture, uv);
  
  vec3 newPosition = position;
  float displacementIntensity = texture(uDisplacementTexture, uv).r;
  vec3 displacement = vec3(cos(aAngle), sin(aAngle), 1.0);
  displacement = normalize(displacement);
  displacement *= smoothstep(0.1, 0.5, displacementIntensity);
  newPosition += displacement * 1.0 * aIntensity;

  
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  
  float intensity = 1.0 - length(textureColor - 0.5);

  
  gl_PointSize = 0.15 * intensity * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = textureColor.rgb;
}`,v=`uniform sampler2D uImageTexture;

varying vec3 vColor;

void main()
{
  
  vec2 uv = gl_PointCoord;
  vec3 color = texture(uImageTexture, gl_FragCoord.xy).rgb;
  color = vec3(smoothstep(0.1, 0.4, length(color)));
  
  

  
  float circle = distance(uv, vec2(0.5));
  if (circle > 0.5) discard;

  
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,y=`/3journey/assets/hand-VN3Sy566.png`,b=document.querySelector(`canvas.webgl`);if(!b)throw Error(`No canvas available`);var x=new d,S=new c,C={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)};window.addEventListener(`resize`,()=>{C.width=window.innerWidth,C.height=window.innerHeight,C.pixelRatio=Math.min(window.devicePixelRatio,2),F.uniforms.uResolution.value.set(C.width*C.pixelRatio,C.height*C.pixelRatio),w.aspect=C.width/C.height,w.updateProjectionMatrix(),E.setSize(C.width,C.height),E.setPixelRatio(C.pixelRatio)});var w=new t(35,C.width/C.height,.1,100);w.position.set(0,0,18),x.add(w);var T=new h(w,b);T.enableDamping=!0;var E=new l({canvas:b,antialias:!0});E.setClearColor(`#181818`),E.setSize(C.width,C.height),E.setPixelRatio(C.pixelRatio);var D=128,O=document.createElement(`canvas`),k={canvas:O,context:O.getContext(`2d`),glowImage:new Image,interactivePlane:new p(new r(10,10),new m({color:`red`,side:2})),raycaster:new o,screenCursor:new e(9999,9999),canvasCursor:new e(9999,9999),canvasCursorPrev:new e(9999,9999),texture:new f(O)};if(!k.context)throw Error(`Displacement canvas context not available`);k.canvas.width=D,k.canvas.height=D,k.canvas.style.position=`fixed`;var A=`${Math.min(C.width/5,C.height/3)}px`;k.canvas.style.width=A,k.canvas.style.height=A,k.canvas.style.top=`0`,k.canvas.style.left=`0`,k.canvas.style.zIndex=`0`,document.body.append(k.canvas),k.context.fillRect(0,0,k.canvas.width,k.canvas.height),k.glowImage.src=g,k.glowImage.onload=()=>{k.context&&k.context.drawImage(k.glowImage,0,0,32,32)},k.interactivePlane.visible=!1,x.add(k.interactivePlane),window.addEventListener(`pointermove`,e=>{k.screenCursor.x=e.clientX/C.width*2-1,k.screenCursor.y=-(e.clientY/C.height*2)+1});var j=new r(10,10,D,D);j.setIndex(null),j.deleteAttribute(`normal`);var M=S.load(y),N=new Float32Array(j.attributes.position.count),P=new Float32Array(j.attributes.position.count);for(let e=0;e<N.length;e++)N[e]=Math.random(),P[e]=Math.random()*Math.PI*2;j.setAttribute(`aIntensity`,new s(N,1)),j.setAttribute(`aAngle`,new s(P,1));var F=new u({vertexShader:_,fragmentShader:v,uniforms:{uResolution:new i(new e(C.width*C.pixelRatio,C.height*C.pixelRatio)),uImageTexture:new i(M),uDisplacementTexture:new i(k.texture)}}),I=new a(j,F);x.add(I);var L=()=>{T.update(),k.raycaster.setFromCamera(k.screenCursor,w);let e=k.raycaster.intersectObject(k.interactivePlane);if(e.length){let t=e[0].uv;t&&(k.canvasCursor.x=t.x*k.canvas.width,k.canvasCursor.y=k.canvas.height-t.y*k.canvas.height)}if(k.context){k.context.globalCompositeOperation=`source-over`,k.context.globalAlpha=.025,k.context.fillRect(0,0,k.canvas.width,k.canvas.height);let e=k.canvasCursorPrev.distanceTo(k.canvasCursor);k.canvasCursorPrev.copy(k.canvasCursor);let t=e*.1,n=k.canvas.width*.25;k.context.globalAlpha=Math.min(t,1),k.context.globalCompositeOperation=`lighten`,k.context.drawImage(k.glowImage,k.canvasCursor.x-n*.5,k.canvasCursor.y-n*.5,n,n),k.texture.needsUpdate=!0}E.render(x,w),window.requestAnimationFrame(L)};L();