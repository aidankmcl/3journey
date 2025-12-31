import{Dn as e,En as t,It as n,Rt as r,b as i,i as a,n as o,nn as s,tn as c,vt as l,x as u}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as d}from"../OrbitControls-D8EFuDj6.js";/* empty css               */var f=`uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

vec4 permute(vec4 x)
{
  return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float perlinClassic3D(vec3 P)
{
  vec3 Pi0 = floor(P); 
  vec3 Pi1 = Pi0 + vec3(1.0); 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float waveElevation(vec3 position)
{
    
  float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                    sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                    uBigWavesElevation;

  for (float i=1.0; i<4.0; i++) {
    elevation -= abs(perlinClassic3D(vec3(position.xz * 3.0 * i, uTime * 0.3)) * 0.15 / i);
  }

  return elevation;
}

void main()
{
  float shift = 0.01;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, - shift);

  
  

  float elevation = waveElevation(modelPosition.xyz);
  modelPosition.y += elevation;
  modelPositionA.y += waveElevation(modelPositionA);
  modelPositionB.y += waveElevation(modelPositionB);

  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computedNormal = cross(toA, toB);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
  vNormal = computedNormal;
  vPosition = modelPosition.xyz;
}`,p=`precision mediump float;

uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower)
{
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(- lightDirection, normal);

    
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular);
}
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay)
{
  vec3 lightDelta = lightPosition - position;
  float lightDistance = length(lightDelta);
  vec3 lightDirection = normalize(lightDelta);
  vec3 lightReflection = reflect(- lightDirection, normal);

  
  float shading = dot(normal, lightDirection);
  shading = max(0.0, shading);

  
  float specular = - dot(lightReflection, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  
  float decay = 1.0 - lightDistance * lightDecay;
  decay = max(0.0, decay);

  return lightColor * lightIntensity * decay * (shading + specular);
}

void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  
  vec3 light = vec3(0.0);
  
  
  
  
  
  
  
  
  light += pointLight(
    vec3(1.0),            
    10.0,                 
    normal,               
    vec3(0.0, 0.25, 0.0), 
    viewDirection,        
    30.0,                 
    vPosition,            
    0.95                  
  );

  

  
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(0.0, 1.0, mixStrength);  

  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  color *= light;
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,m={width:window.innerWidth,height:window.innerHeight},h=document.querySelector(`canvas.webgl`);if(!h)throw Error(`Unable to connect to canvas!`);var g=new c,_=new r(3,3,512,512);_.deleteAttribute(`normal`);var v=0,y={depthColor:`#042130`,surfaceColor:`#0065a4`},b=new s({vertexShader:f,fragmentShader:p,uniforms:{uTime:{value:0},uBigWavesElevation:{value:.2},uBigWavesFrequency:{value:new t(4,1.5)},uBigWavesSpeed:{value:.75},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallIterations:{value:4},uDepthColor:{value:new u(y.depthColor)},uSurfaceColor:{value:new u(y.surfaceColor)},uColorOffset:{value:.9},uColorMultiplier:{value:1}}}),x=new l(_,b);x.rotateOnAxis(new e(1,0,0),-Math.PI/2),g.add(x);var S=new n(75,m.width/m.height,.1,100);S.position.set(0,1,2),S.lookAt(x.position),g.add(S);var C=new d(S,h),w=new o({canvas:h});w.toneMapping=4,w.setSize(m.width,m.height),w.setPixelRatio(Math.min(window.devicePixelRatio,2)),w.render(g,S);var T=new i,E=()=>{v=T.getElapsedTime(),b.uniforms.uTime.value=v,_.attributes.position.needsUpdate=!0,C.update(),w.render(g,S),window.requestAnimationFrame(E)};E(),window.addEventListener(`resize`,()=>{m.width=window.innerWidth,m.height=window.innerHeight,S.aspect=m.width/m.height,S.updateProjectionMatrix(),w.setSize(m.width,m.height),w.setPixelRatio(Math.min(window.devicePixelRatio,2))}),window.addEventListener(`dblclick`,()=>{document.fullscreenElement?document.exitFullscreen():h.requestFullscreen()});