import{C as e,En as t,It as n,N as r,Sn as i,_n as a,b as o,cn as s,n as c,nn as l,tn as u,vt as d,x as f}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as p}from"../OrbitControls-D8EFuDj6.js";/* empty css               */import{t as m}from"../lil-gui.esm-DBlFozw-.js";var h=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = modelPosition.xyz;
}`,g=`precision mediump float;

uniform float uElapsed;
uniform vec3 uBaseColor;
uniform vec3 uShadeColor;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

vec3 ambientLight(vec3 lightColor, float lightIntensity)
{
    return lightColor * lightIntensity;
}
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
vec3 spotLight(
  vec3 lightPosition,
  vec3 lightTarget,
  float lightIntensity,
  vec3 lightColor,
  float falloffDist,
  float specularPower,
  vec3 normal,
  vec3 viewDirection,
  vec3 position
) {
  vec3 lightDeltaToFrag = lightPosition - position;
  float lightDistanceToFrag = length(lightDeltaToFrag);
  vec3 lightDirectionToFrag = normalize(lightDeltaToFrag);
  vec3 lightReflectionOffFrag = reflect(- lightDirectionToFrag, normal);

  
  float shading = dot(normal, lightDirectionToFrag);
  shading = max(0.0, shading);

  
  float specular = - dot(lightReflectionOffFrag, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  
  float decay = 1.0 - min(1.0, abs(lightDistanceToFrag / falloffDist));

  float angle = 3.14 / 16.0;
  float coneFalloffRadius = lightDistanceToFrag * atan(angle);
  vec3 coneBaseCenter = lightPosition + vec3(0.0, -1.0, 0.0) * lightDistanceToFrag;
  float coneFalloff = max(0.0, coneFalloffRadius - distance(coneBaseCenter, position));

  return lightColor * lightIntensity * decay * (shading + specular) * coneFalloff;
}

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
)
{
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    return mix(color, pointColor, point);
}

void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uBaseColor;

  
  vec3 light = vec3(0.0);
  light += ambientLight(
    vec3(1.0), 
    1.0        
  );
  light += directionalLight(
    vec3(1.0, 1.0, 1.0), 
    1.0,                 
    normal,              
    vec3(1.0, 1.0, 0.0), 
    viewDirection,       
    1.0                  
  );
  
  
  
  
  
  
  
  
  
  
  
  

  
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  float repetitions = 150.0;
  uv *= repetitions;
  uv = mod(uv, 1.0);

  vec3 direction = vec3(0.0, -1.0, 0.0);

  color = halftone(
    color,                 
    repetitions,                  
    vec3(0.0, - 1.0, 0.0), 
    - 0.8,                 
    1.5,                   
    vec3(1.0, 0.0, 0.0),   
    normal                 
  );
  color = halftone(
    color,                 
    repetitions,                 
    vec3(1.0,1.0, 0.0), 
    0.1,                   
    1.5,                   
    vec3(0.0, 1.0, 1.0),   
    normal                 
  );

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,_=new m,v={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)},y={clearColor:`#8c3da9`,baseColor:`#e7b172`,shadeColor:`#e7b172`},b=document.querySelector(`canvas.webgl`);if(!b)throw Error(`Unable to connect to canvas!`);var x=new u,S=0,C=new l({vertexShader:h,fragmentShader:g,side:2,uniforms:{uElapsed:new i(S),uBaseColor:new i(new f(y.baseColor)),uShadeColor:new i(new f(y.shadeColor)),uResolution:new i(new t(v.width*v.pixelRatio,v.height*v.pixelRatio))}}),w=new d(new s(.75,32,32),C);x.add(w);var T=new d(new e(1,1,4),C);T.position.x-=2,x.add(T);var E=new d(new a(1),C);E.position.x+=2,E.scale.set(.5,.5,.5),x.add(E);var D=new n(75,v.width/v.height,.1,100);D.position.set(0,0,5),D.lookAt(w.position),x.add(D);var O=new p(D,b);O.enableDamping=!0;var k=new c({canvas:b});k.setClearColor(y.clearColor),k.setSize(v.width,v.height),k.setPixelRatio(v.pixelRatio),k.render(x,D),_.addColor(y,`clearColor`).onChange(()=>k.setClearColor(y.clearColor)),_.addColor(y,`baseColor`).onChange(e=>{C.uniforms.uBaseColor.value=new f(e),C.needsUpdate=!0}),_.addColor(y,`shadeColor`).onChange(e=>{C.uniforms.uShadeColor.value=new f(e),C.needsUpdate=!0});var A=new o,j=()=>{S=A.getElapsedTime(),C.uniforms.uElapsed.value=S,O.update(),k.render(x,D),window.requestAnimationFrame(j)};j(),window.addEventListener(`resize`,()=>{v.width=window.innerWidth,v.height=window.innerHeight,v.pixelRatio=Math.min(window.devicePixelRatio,2),C.uniforms.uResolution.value.set(v.width*v.pixelRatio,v.height*v.pixelRatio),D.aspect=v.width/v.height,D.updateProjectionMatrix(),k.setSize(v.width,v.height),k.setPixelRatio(v.pixelRatio)}),window.addEventListener(`dblclick`,()=>{document.fullscreenElement?document.exitFullscreen():b.requestFullscreen()});