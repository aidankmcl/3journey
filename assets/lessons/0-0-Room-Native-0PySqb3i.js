import{At as e,B as t,Jr as n,Ms as r,Oi as i,Ui as a,Vn as o,Wn as s,Yr as c,c as l,do as u,ds as d,fa as f,fo as p,j as m,mn as h,n as g,nt as _,pt as v,tt as ee,ui as y,vn as te,wo as b,ws as x}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import"../OrbitControls-D9g5_-6h.js";/* empty css               */const S={mapSize:1024,near:.5,far:20},C={room:{dimensions:[12,4,10],position:new x(2.5,.5,0)},discoBall:{radius:.25,position:new x(0,-1,0)},volumetric:{coneLength:5,coneRadius:.4},props:{sphere:{radius:1,position:new x(0,2,-2)},box:{size:1,position:new x(0,0,-3)}}},w={rotationSpeed:.4};var T=class{cubeRenderTarget;camera;depthMaterial;config=S;constructor(){this.cubeRenderTarget=new r(this.config.mapSize,{format:f,type:h,minFilter:y,magFilter:y}),this.camera=new v(this.config.near,this.config.far,this.cubeRenderTarget),this.depthMaterial=new p({vertexShader:`
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform vec3 uLightPos;
        uniform float uShadowFar;
        uniform vec3 uColorMask;
        varying vec3 vWorldPosition;
        void main() {
          float depth = length(vWorldPosition - uLightPos) / uShadowFar;
          // RGB = colorMask of shadow caster, A = depth
          gl_FragColor = vec4(uColorMask, depth);
        }
      `,uniforms:{uLightPos:{value:new x(0,-1,0)},uShadowFar:{value:this.config.far},uColorMask:{value:new _(1,1,1)}}})}get texture(){return this.cubeRenderTarget.texture}render(e,t,n,r,i=[]){this.camera.position.copy(n),this.depthMaterial.uniforms.uLightPos.value.copy(n);let a=new Map,o=t.background,s=new Map;t.background=new _(1,1,1),i.forEach(e=>{s.set(e,e.visible),e.visible=!1}),r.forEach(e=>{a.set(e,e.material);let t=this.depthMaterial.clone();t.uniforms.uLightPos=this.depthMaterial.uniforms.uLightPos,t.uniforms.uShadowFar=this.depthMaterial.uniforms.uShadowFar;let n=e.material;n.uniforms?.uColorMask?.value?t.uniforms.uColorMask={value:n.uniforms.uColorMask.value.clone()}:t.uniforms.uColorMask={value:new _(1,1,1)},e.material=t}),this.camera.update(e,t),t.background=o,i.forEach(e=>{e.visible=s.get(e)}),r.forEach(e=>{e.material=a.get(e)})}},E=`varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main()
{
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  
  vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  
  vNormal = modelNormal;
  vPosition = modelPosition.xyz;
  vUv = uv;
}`,D=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uColorMask;
uniform float uRotation;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

vec3 getDiscoLight(vec3 position, vec3 lightPos, vec3 normal, float rotation) {
  vec3 lightDir = normalize(position - lightPos);
  
  
  
  float phi = atan(lightDir.z, lightDir.x) + rotation; 
  float theta = acos(lightDir.y);

  float density = PI; 
  
  float gridX = phi * density * 1.013;
  float gridY = theta * density;

  vec2 cellID = floor(vec2(gridX, gridY));

  
  vec2 uv = fract(vec2(gridX, gridY)) - 0.5;
  float dist = length(uv);

  float radius = 0.45;
  float spot = 1.0 - smoothstep(radius - 0.05, radius, dist);

  vec3 beamColor = vec3(0.0);
  float xMod = mod(cellID.x, 2.0);
  float yMod = mod(cellID.y, 2.0);

  if (yMod == 0.0) {
    float third = 1.0 - mod(cellID.x, 3.0);
    beamColor = vec3(xMod, third, 0.0); 
  } else {
    float third = clamp(1.0 - mod(cellID.x, 4.0), 0.0, 1.0);
    beamColor = vec3(third, 0.0, 1.0); 
  }

  
  if (mod(cellID.x + cellID.y, 2.0) == 0.0) {
    beamColor = vec3(0.0, 0.0, 0.0);
  }

  if (theta > (PI - 0.275) || theta < 0.325) {
    beamColor = vec3(0.0);
  }

  #ifdef FLIP_SIDED
    float intensity = dot(lightDir, normal);
  #else
    float intensity = dot(lightDir, -normal);
  #endif
  beamColor *= max(0.0, intensity);
  

  return beamColor * spot;
}

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);

  float alignment = clamp(dot(color, uColorMask), 0.0, 1.0);

  
  
  gl_FragColor = vec4(vec3(alignment), smoothstep(0.01, 1.0, alignment));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,O=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform float uRotation;
uniform vec3 uColorMask;

uniform samplerCube uShadowMap;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

vec3 getDiscoLight(vec3 position, vec3 lightPos, vec3 normal, float rotation) {
  vec3 lightDir = normalize(position - lightPos);
  
  
  
  float phi = atan(lightDir.z, lightDir.x) + rotation; 
  float theta = acos(lightDir.y);

  float density = PI; 
  
  float gridX = phi * density * 1.013;
  float gridY = theta * density;

  vec2 cellID = floor(vec2(gridX, gridY));

  
  vec2 uv = fract(vec2(gridX, gridY)) - 0.5;
  float dist = length(uv);

  float radius = 0.45;
  float spot = 1.0 - smoothstep(radius - 0.05, radius, dist);

  vec3 beamColor = vec3(0.0);
  float xMod = mod(cellID.x, 2.0);
  float yMod = mod(cellID.y, 2.0);

  if (yMod == 0.0) {
    float third = 1.0 - mod(cellID.x, 3.0);
    beamColor = vec3(xMod, third, 0.0); 
  } else {
    float third = clamp(1.0 - mod(cellID.x, 4.0), 0.0, 1.0);
    beamColor = vec3(third, 0.0, 1.0); 
  }

  
  if (mod(cellID.x + cellID.y, 2.0) == 0.0) {
    beamColor = vec3(0.0, 0.0, 0.0);
  }

  if (theta > (PI - 0.275) || theta < 0.325) {
    beamColor = vec3(0.0);
  }

  #ifdef FLIP_SIDED
    float intensity = dot(lightDir, normal);
  #else
    float intensity = dot(lightDir, -normal);
  #endif
  beamColor *= max(0.0, intensity);
  

  return beamColor * spot;
}

void main()
{
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal, uRotation);
  vec4 rgba = vec4(color, 1.0);
  
  
  vec3 lightToFrag = vPosition - uLightPos;
  vec4 shadowSample = textureCube(uShadowMap, lightToFrag);
  vec3 shadowColorMask = 1.0 - shadowSample.rgb;
  float closestDepth = shadowSample.a;
  
  vec3 combinedColor = shadowColorMask + color;
  float shouldShowShadow = clamp(length(combinedColor), 0.0, 1.0);

  
  
  float inShadow = 1.0 - step(0.2, closestDepth);
  rgba = mix(rgba, vec4(0.0), inShadow);

  
  
  gl_FragColor = rgba;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function k(e,t=[1,1,1]){return{uLightPos:{value:e.clone()},uRotation:{value:0},uColorMask:{value:new _(...t)}}}function A(e,t){return{...e,uShadowMap:{value:t}}}function j(e,t={}){let{side:n=0,transparent:r=!1,depthWrite:i=!0}=t;return new p({vertexShader:E,fragmentShader:D,uniforms:e,side:n,transparent:r,depthWrite:i})}function ne(e,t={}){let{side:n=0}=t;return new p({vertexShader:E,fragmentShader:O,uniforms:e,side:n})}var re=`attribute vec3 aColor;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  vUv = uv;
  vColor = aColor;

  
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}`,ie=`varying vec2 vUv;
varying vec3 vColor;

void main()
{
  
  
  float tipFade = smoothstep(0.0, 0.05, vUv.y);
  
  
  float lengthFade = 1.0 - vUv.y;
  lengthFade = pow(lengthFade, 5.0);

  float totalFade = tipFade * lengthFade;

  float strength = max(max(vColor.r, vColor.g), vColor.b);
  vec3 color = vColor * totalFade;
  float alpha = strength * totalFade * 0.6;

  color = vec3(1.0) * totalFade;
  gl_FragColor = vec4(color, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,M=Math.PI,N=M;function P(t=5,n=1){let r=[],a=[],c=Math.ceil(N*3*1.01),l=Math.ceil(N*3);for(let e=0;e<l;e++)for(let t=-c;t<=c;t++){let n=t+.5,i=e+.5,o=n/(N*1.013),s=i/N;if(s>M-.275||s<.325)continue;let c=(t%2+2)%2,l=(e%2+2)%2,u=0,d=0,f=0;if(l===0){let e=1-(t%3+3)%3;u=c,d=Math.max(0,e)}else u=Math.max(0,Math.min(1,1-(t%4+4)%4)),f=1;if(((t+e)%2+2)%2==0&&(u=0,d=0,f=0),u<.01&&d<.01&&f<.01)continue;let p=Math.sin(s);r.push(new x(p*Math.cos(o),Math.cos(s),p*Math.sin(o))),a.push(new _(u,d,f))}let u=r.length,d=new e(n,0,t,16,1,!0);d.translate(0,t/2,0);let f=new Float32Array(u*3);a.forEach((e,t)=>{f[t*3]=e.r,f[t*3+1]=e.g,f[t*3+2]=e.b}),d.setAttribute(`aColor`,new o(f,3));let m=new p({vertexShader:re,fragmentShader:ie,transparent:!0,depthWrite:!1,depthTest:!0,side:0,blending:2}),h=new s(d,m,u);h.castShadow=!1,h.receiveShadow=!1,h.frustumCulled=!1;let g=new i,v=new x(0,1,0);return r.forEach((e,t)=>{g.position.set(0,0,0),g.quaternion.setFromUnitVectors(v,e),g.updateMatrix(),h.setMatrixAt(t,g.matrix)}),h.instanceMatrix.needsUpdate=!0,h.layers.set(1),h}function F(e,r){let i=C,a=P(i.volumetric.coneLength,i.volumetric.coneRadius);a.position.copy(e.uLightPos.value);let o=new n(new t(...i.room.dimensions),ne(r,{side:1}));o.position.copy(i.room.position);let s=new n(new b(i.discoBall.radius,16,16),new c({color:`black`}));s.position.copy(e.uLightPos.value);let l=new n(new b(i.props.sphere.radius,32,32),j({...e,uColorMask:new d(new _(1,0,0))},{side:0,transparent:!0,depthWrite:!1}));l.position.copy(i.props.sphere.position);let u=new n(new t(i.props.box.size,i.props.box.size,i.props.box.size),j({...e,uColorMask:new d(new _(0,1,0))},{side:0,transparent:!0,depthWrite:!1}));return u.position.copy(i.props.box.position),{volumetricMesh:a,room:o,discoBall:s,sphere:l,box:u,shadowCasters:[l,u,s],excludeFromShadow:[a,o]}}function I(e,t){e.add(t.room),e.add(t.discoBall),e.add(t.sphere),e.add(t.box)}const L=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2;var R=class{camera;shots;options;currentShotIndex=0;shotStartTime=0;transition=null;isPlaying=!0;currentLookAt=new x;constructor(e,t,n={}){if(this.camera=e,this.shots=t,this.options={autoAdvance:n.autoAdvance??!0,loop:n.loop??!0,enableKeyboard:n.enableKeyboard??!0},t.length===0)throw Error(`CameraDirector requires at least one shot`);this.applyShot(this.shots[0]),this.currentLookAt.copy(this.shots[0].lookAt),this.options.enableKeyboard&&this.setupKeyboardControls()}update(e){if(this.isPlaying){if(this.transition){this.updateTransition(e);return}if(this.options.autoAdvance){let t=this.shots[this.currentShotIndex];e-this.shotStartTime>=t.duration&&this.advanceToNextShot(e)}}}goToShot(e,t){e<0||e>=this.shots.length||this.startTransition(e,t)}goToShotByName(e,t){let n=this.shots.findIndex(t=>t.name===e);n!==-1&&this.goToShot(n,t)}nextShot(e){this.advanceToNextShot(e)}previousShot(e){let t=this.currentShotIndex-1;t<0&&(t=this.options.loop?this.shots.length-1:0),this.startTransition(t,e)}pause(){this.isPlaying=!1}play(){this.isPlaying=!0}getCurrentShot(){return this.shots[this.currentShotIndex]}isTransitioning(){return this.transition!==null}advanceToNextShot(e){let t=this.currentShotIndex+1;if(t>=this.shots.length)if(this.options.loop)t=0;else return;this.startTransition(t,e)}startTransition(e,t){let n=this.shots[e],r=n.transitionIn??1.5;this.transition={fromPosition:this.camera.position.clone(),fromLookAt:this.currentLookAt.clone(),toShot:n,startTime:t,duration:r,easing:n.easing??L},this.currentShotIndex=e}updateTransition(e){if(!this.transition)return;let{fromPosition:t,fromLookAt:n,toShot:r,startTime:i,duration:a,easing:o}=this.transition,s=e-i,c=Math.min(s/a,1),l=o(c);this.camera.position.lerpVectors(t,r.position,l),this.currentLookAt.lerpVectors(n,r.lookAt,l),this.camera.lookAt(this.currentLookAt),c>=1&&(this.transition=null,this.shotStartTime=e,this.applyShot(r))}applyShot(e){this.camera.position.copy(e.position),this.camera.lookAt(e.lookAt),this.currentLookAt.copy(e.lookAt)}setupKeyboardControls(){window.addEventListener(`keydown`,e=>{let t=performance.now()/1e3;switch(e.key){case`ArrowRight`:case`n`:this.nextShot(t);break;case`ArrowLeft`:case`p`:this.previousShot(t);break;case` `:e.preventDefault(),this.isPlaying?(this.pause(),console.log(`[CameraDirector] Paused on: ${this.getCurrentShot().name}`)):(this.play(),console.log(`[CameraDirector] Playing`));break;case`1`:case`2`:case`3`:case`4`:case`5`:case`6`:case`7`:case`8`:case`9`:let n=parseInt(e.key)-1;n<this.shots.length&&this.goToShot(n,t);break}}),console.log(`[CameraDirector] Keyboard controls enabled:`),console.log(`  Arrow Right / N: Next shot`),console.log(`  Arrow Left / P: Previous shot`),console.log(`  Space: Pause/Play`),console.log(`  1-9: Jump to shot by number`)}};const z=[{name:`close-up`,position:new x(-1,-1,0),lookAt:new x(0,-1,0),duration:8,transitionIn:2},{name:`wide-front`,position:new x(-4,0,0),lookAt:new x(0,-1,0),duration:8,transitionIn:2},{name:`corner-high`,position:new x(-3,2,3),lookAt:new x(0,-1,0),duration:6,transitionIn:1.5},{name:`low-angle`,position:new x(-2,-1,2),lookAt:new x(0,0,0),duration:6,transitionIn:1.5},{name:`side-profile`,position:new x(0,0,5),lookAt:new x(0,-1,0),duration:6,transitionIn:2},{name:`overhead`,position:new x(0,3,.1),lookAt:new x(0,-1,0),duration:5,transitionIn:2}];var B=new T,V=k(C.discoBall.position),H=A(V,B.texture),U=document.querySelector(`canvas.webgl`),W=new u;W.background=new _(`black`);var G=F(V,H);I(W,G);var{volumetricMesh:K,discoBall:q,box:J,shadowCasters:ae,excludeFromShadow:oe}=G,Y={width:window.innerWidth,height:window.innerHeight},X=new a(75,Y.width/Y.height,.1,100);X.position.set(-5,0,0),X.lookAt(q.position),X.layers.enable(1),W.add(X);var Z=new R(X,z,{autoAdvance:!0,loop:!0}),Q=new g({canvas:U});Q.setSize(Y.width,Y.height),Q.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,()=>{Y.width=window.innerWidth,Y.height=window.innerHeight,X.aspect=Y.width/Y.height,X.updateProjectionMatrix(),Q.setSize(Y.width,Y.height),Q.setPixelRatio(Math.min(window.devicePixelRatio,2))});var se=new ee;function $(){let e=se.getElapsedTime();V.uRotation.value=e*w.rotationSpeed,K.rotation.y=V.uRotation.value,J.rotation.y=V.uRotation.value,J.position.y=Math.sin(e)*.5,B.render(Q,W,V.uLightPos.value,ae,oe),Z&&Z.update(e),Q.render(W,X),requestAnimationFrame($)}$();