import{It as e,N as t,Rt as n,Yt as r,b as i,n as a,tn as o,vt as s}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as c}from"../OrbitControls-D8EFuDj6.js";/* empty css               */var l=`uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
}`,u=`precision mediump float;

varying vec2 vUv;

uniform float uElapsed;

float random(vec2 st)
{
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float pseudoRandom(float flooredVal)
{
  return fract(sin(flooredVal) * 43758.5453123);
}

#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); 
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; 
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  

  

  

  

  

  

  

  

  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  

  
  

  
  

  
  

  
  

  
  
  
  
  
  
  

  
  

  
  

  
  

  
  

  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  

  
  

  
  

  
  

  
  vec2 dotLocation = vec2(0.5 + 0.25 * cos(uElapsed), 0.5 + 0.25 * sin(uElapsed));
  float pattern = 0.01 / distance(vUv, dotLocation);
  vec2 dot2Location = vec2(0.5 + 0.25 * cos(uElapsed + 2.0), 0.5 + 0.25 * sin(uElapsed + 6.0));
  pattern += 0.01 / distance(vUv, dot2Location);
  vec2 dot3Location = vec2(0.5 + 0.25 * cos(uElapsed + 5.0), 0.5 + 0.25 * sin(uElapsed + 1.0));
  pattern += 0.01 / distance(vUv, dot3Location);

  
  
  
  
  

  
  
  
  
  

  
  
  
  
  
  

  
  

  
  

  
  

  
  
  

  
  
  
  
  

  
  
  
  

  
  
  
  
  

  
  
  
  
  
  

  
  
  
  
  
  

  
  
  
  

  
  
  
  
  

  
  
  
  
  

  
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, clamp(pattern, 0.0, 1.0)); 
  vec3 color = mixedColor;

  gl_FragColor = vec4(color, 1.0);
}`,d={width:window.innerWidth,height:window.innerHeight},f=document.querySelector(`canvas.webgl`);if(!f)throw Error(`Unable to connect to canvas!`);var p=new o,m=new n(1,1,32,32),h=0,g=new r({vertexShader:l,fragmentShader:u,side:2,uniforms:{uElapsed:{value:h}}}),_=new s(m,g);p.add(_);var v=new e(75,d.width/d.height,.1,100);v.position.set(0,0,1),v.lookAt(_.position),p.add(v);var y=new c(v,f),b=new a({canvas:f});b.setSize(d.width,d.height),b.setPixelRatio(Math.min(window.devicePixelRatio,2)),b.render(p,v);var x=new i,S=()=>{h=x.getElapsedTime(),g.uniforms.uElapsed.value=h,y.update(),b.render(p,v),window.requestAnimationFrame(S)};S(),window.addEventListener(`resize`,()=>{d.width=window.innerWidth,d.height=window.innerHeight,v.aspect=d.width/d.height,v.updateProjectionMatrix(),b.setSize(d.width,d.height),b.setPixelRatio(Math.min(window.devicePixelRatio,2))}),window.addEventListener(`dblclick`,()=>{document.fullscreenElement?document.exitFullscreen():f.requestFullscreen()});