import{$s as e,At as t,Co as n,Oi as r,Vn as i,c as a,ia as o,j as s,nt as c,vn as l,ws as u}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{b as d,c as f,f as p,r as m,t as h,v as g}from"../OrbitControls-COtklD0Y.js";var _=e(g()),v=e(d()),y=`varying vec3 vNormal;
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
}`,b=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightPos;
uniform vec3 uLightTarget;
uniform float uLightAngle;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

vec3 getDiscoLight(vec3 position, vec3 lightPos, vec3 normal) {
  vec3 lightDir = normalize(position - lightPos);
  
  
  
  float phi = atan(lightDir.z, lightDir.x); 
  float theta = acos(lightDir.y);

  float density = PI * 2.0; 
  float gridX = phi * density * 1.01;
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
  vec3 color = getDiscoLight(vPosition, uLightPos, vNormal);

  
  gl_FragColor = vec4(color, 1.0);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function x(e=[0,0,0]){return{uLightPos:{value:new u(...e)}}}var S=e(p()),C=`attribute vec3 aColor;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
  vUv = uv;
  vColor = aColor;

  
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}`,w=`varying vec2 vUv;
varying vec3 vColor;

void main()
{
  
  
  float tipFade = smoothstep(0.0, 0.05, vUv.y);
  
  
  float lengthFade = 1.0 - vUv.y;
  lengthFade = pow(lengthFade, 2.0);

  float totalFade = tipFade * lengthFade;

  float strength = max(max(vColor.r, vColor.g), vColor.b);
  vec3 color = vColor * totalFade;
  float alpha = strength * totalFade * 0.6;

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,T=Math.PI,E=T*2;function D(){let e=[],t=[],n=Math.ceil(E*3*1.01),r=Math.ceil(E*3);for(let i=0;i<r;i++)for(let r=-n;r<=n;r++){let n=r+.5,a=i+.5,o=n/(E*1.01),s=a/E;if(s>T-.275||s<.325)continue;let l=(r%2+2)%2,d=(i%2+2)%2,f=0,p=0,m=0;if(d===0){let e=1-(r%3+3)%3;f=l,p=Math.max(0,e),m=0}else f=Math.max(0,Math.min(1,1-(r%4+4)%4)),p=0,m=1;if(((r+i)%2+2)%2==0&&(f=0,p=0,m=0),f<.01&&p<.01&&m<.01)continue;let h=Math.sin(s),g=Math.cos(s),_=Math.sin(o),v=new u(h*Math.cos(o),g,h*_);e.push(v),t.push(new c(f,p,m))}return{directions:e,colors:t}}const O=(0,v.forwardRef)(({discoUniforms:e,coneLength:a=10,coneRadius:s=.15},c)=>{let l=(0,v.useRef)(null),d=(0,v.useRef)(null),p=(0,v.useRef)(null),[m,h]=(0,v.useState)(!1),{directions:g,colors:_}=(0,v.useMemo)(()=>D(),[]),y=g.length,b=(0,v.useMemo)(()=>{let e=new Float32Array(y*3);return _.forEach((t,n)=>{e[n*3+0]=t.r,e[n*3+1]=t.g,e[n*3+2]=t.b}),e},[_,y]);f(()=>{d.current&&e&&d.current.position.copy(e.uLightPos.value)});let x=(0,v.useMemo)(()=>{let e=new t(s,0,a,16,1,!0);e.translate(0,a/2,0);let r=new i(b,3);return e.setAttribute(`aColor`,r),e.boundingSphere=new n(new u(0,0,0),a*2),e},[a,s,b,m]);(0,v.useEffect)(()=>{let e=l.current;if(!e)return;let t=new r,n=new u(0,1,0);g.forEach((r,i)=>{t.position.set(0,0,0);let a=new o;a.setFromUnitVectors(n,r),t.quaternion.copy(a),t.updateMatrix(),e.setMatrixAt(i,t.matrix)}),e.instanceMatrix.needsUpdate=!0,h(!0)},[g,x]);let T=(0,v.useMemo)(()=>({}),[]);return(0,S.jsx)(`group`,{ref:e=>{d.current=e,typeof c==`function`?c(e):c&&(c.current=e)},children:(0,S.jsx)(`instancedMesh`,{ref:l,args:[x,void 0,y],frustumCulled:!1,children:(0,S.jsx)(`shaderMaterial`,{ref:p,vertexShader:C,fragmentShader:w,uniforms:T,side:0,transparent:!0,depthWrite:!1,blending:2})})})}),k=(0,v.forwardRef)(({side:e=0,discoUniforms:t,...n},r)=>{let i=(0,v.useRef)(null),a=(0,v.useMemo)(()=>({uLightPos:t?.uLightPos??{value:new u(0,0,0)},uLightTarget:{value:new u(0,0,0)},uLightAngle:{value:Math.PI/16}}),[t]);return(0,S.jsxs)(`mesh`,{...n,ref:r,children:[n.children,(0,S.jsx)(`shaderMaterial`,{ref:i,vertexShader:y,fragmentShader:b,uniforms:a,side:e,transparent:!0})]})});function A(){let e=(0,v.useMemo)(()=>x([0,1,0]),[]);return f(()=>{}),(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(O,{discoUniforms:e,coneLength:5,coneRadius:.2}),(0,S.jsx)(k,{position:[0,0,0],side:1,discoUniforms:e,children:(0,S.jsx)(`boxGeometry`,{args:[8,3,10]})}),(0,S.jsxs)(`mesh`,{children:[(0,S.jsx)(`sphereGeometry`,{args:[.25,16,16]}),(0,S.jsx)(`meshBasicMaterial`,{color:`black`})]}),(0,S.jsx)(k,{position:[-2,2,0],discoUniforms:e,children:(0,S.jsx)(`sphereGeometry`,{args:[1,32,32]})}),(0,S.jsx)(k,{position:[-3,0,0],discoUniforms:e,children:(0,S.jsx)(`boxGeometry`,{args:[1,1,1]})})]})}function j(){return(0,S.jsxs)(m,{children:[(0,S.jsx)(`color`,{attach:`background`,args:[`black`]}),(0,S.jsx)(h,{enableDamping:!0,dampingFactor:.05}),(0,S.jsx)(A,{})]})}var M=j,N=document.getElementById(`root`);if(!N)throw Error(`Root element #root not found`);(0,_.createRoot)(N).render((0,S.jsx)(v.StrictMode,{children:(0,S.jsx)(M,{})}));