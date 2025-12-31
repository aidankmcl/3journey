import{$t as e,It as t,N as n,Rt as r,Sn as i,b as a,mn as o,n as s,nn as c,tn as l,vt as u}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as d}from"../OrbitControls-D8EFuDj6.js";import"../BufferGeometryUtils-B3Y9T7UZ.js";import{t as f}from"../GLTFLoader-BYphv5hi.js";var p=`/3journey/assets/perlin-CqwIJTvm.png`,m=`precision mediump float;

uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

precision mediump float;

vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main()
{
  vec2 smokeUV = vUv;

  float timeVariance = uv.y * 0.2 + uTime * 0.01;

  vec3 newPosition = position;
  float twistPerlin = texture(
    uPerlinTexture,
    vec2(0.5, timeVariance)
  ).r;
  float angle = twistPerlin * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  vec2 windOffset = vec2(
    texture(uPerlinTexture, vec2(0.25, timeVariance)).r - 0.5,
    texture(uPerlinTexture, vec2(0.75, timeVariance)).g - 0.5
  );
  windOffset *= pow(uv.y, 2.0) * 10.0;
  newPosition.xz += windOffset;

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
}`,h=`precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;

void main()
{
  vec2 smokeUV = vUv;
  smokeUV.x *= 0.5;
  smokeUV.y *= 0.3;
  smokeUV.y -= uTime * 0.05;
  

  float smoke = texture(uPerlinTexture, smokeUV).r;
  smoke = smoothstep(0.4, 1.0, smoke);

  
  smoke *= smoothstep(0.0, 0.1, vUv.x);
  smoke *= smoothstep(1.0, 0.9, vUv.x);
  smoke *= smoothstep(1.0, 0.25, vUv.y);

  
  gl_FragColor = vec4(vec3(smoke), smoke);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,g=document.querySelector(`canvas.webgl`);if(!g)throw Error(`Unable to connect to canvas!`);var _=new l,v=new o,y=new f,b={width:window.innerWidth,height:window.innerHeight};window.addEventListener(`resize`,()=>{b.width=window.innerWidth,b.height=window.innerHeight,x.aspect=b.width/b.height,x.updateProjectionMatrix(),C.setSize(b.width,b.height),C.setPixelRatio(Math.min(window.devicePixelRatio,2))});var x=new t(25,b.width/b.height,.1,100);x.position.x=8,x.position.y=10,x.position.z=12,_.add(x);var S=new d(x,g);S.target.y=3,S.enableDamping=!0;var C=new s({canvas:g,antialias:!0});C.setSize(b.width,b.height),C.setPixelRatio(Math.min(window.devicePixelRatio,2)),y.load(`./resources/bakedModel.glb`,e=>{let t=e.scene.getObjectByName(`baked`);t?.material?.map&&(t.material.map.anisotropy=8,_.add(e.scene))});var w=new r(1,1,16,64);w.translate(0,.5,0),w.scale(1.5,6,1.5);var T=v.load(p);T.wrapS=e,T.wrapT=e;var E=new c({side:2,transparent:!0,depthWrite:!1,vertexShader:m,fragmentShader:h,uniforms:{uPerlinTexture:new i(T),uTime:new i(0)}}),D=new u(w,E);D.position.y=1.83,_.add(D);var O=new a,k=()=>{let e=O.getDelta();E.uniforms.uTime.value+=e,S.update(),C.render(_,x),window.requestAnimationFrame(k)};k();