import{Cs as e,U as t,Ui as n,Yi as r,c as i,do as a,ds as o,fo as s,n as c,pn as l,wo as u}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{t as d}from"../OrbitControls-D9g5_-6h.js";/* empty css               */import{t as f}from"../lil-gui.esm-Bz-JoirA.js";import{t as p}from"../gsap-DcInoLLg.js";import"../BufferGeometryUtils-BxIfED0X.js";import{t as m}from"../DRACOLoader-_yQYS0Xp.js";import{t as h}from"../GLTFLoader-Dl36u2kt.js";var g=`uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;

attribute vec3 aPositionTarget;

varying vec3 vColor;

vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float simplexNoise3d(vec3 v)
{
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 1.0/7.0; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main()
{
  float startNoise = simplexNoise3d(position);
  float endNoise = simplexNoise3d(aPositionTarget);
  float noise = mix(startNoise, endNoise, uProgress);
  noise = smoothstep(-1.0, 1.0, noise);

  float duration = 0.6;
  float delay = (1.0 - duration) * noise;
  float end = delay + duration;

  float progress = smoothstep(delay, end, uProgress);
  vec3 mixedPosition = mix(position, aPositionTarget, progress);

  
  vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  
  gl_PointSize = uSize * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = vec3(noise);
}`,_=`varying vec3 vColor;

void main()
{
  vec2 uv = gl_PointCoord;
  float distanceToCenter = length(uv - 0.5);
  float alpha = 0.05 / distanceToCenter - 0.1;
  
  gl_FragColor = vec4(vColor, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,v=new f({width:340}),y=document.querySelector(`canvas.webgl`);if(!y)throw Error(`No canvas available`);var b=new a,x=new m;x.setDecoderPath(`/3journey/draco/`);var S=new h;S.setDRACOLoader(x);var C={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)};window.addEventListener(`resize`,()=>{C.width=window.innerWidth,C.height=window.innerHeight,C.pixelRatio=Math.min(window.devicePixelRatio,2),j.material.uniforms.uResolution.value.set(C.width*C.pixelRatio,C.height*C.pixelRatio),w.aspect=C.width/C.height,w.updateProjectionMatrix(),E.setSize(C.width,C.height),E.setPixelRatio(C.pixelRatio)});var w=new n(35,C.width/C.height,.1,100);w.position.set(0,0,16),b.add(w);var T=new d(w,y);T.enableDamping=!0;var E=new c({canvas:y,antialias:!0});E.setSize(C.width,C.height),E.setPixelRatio(C.pixelRatio);var D={clearColor:`#160920`};v.addColor(D,`clearColor`).onChange(()=>{E.setClearColor(D.clearColor)}),E.setClearColor(D.clearColor);var O=new u(3);O.setIndex(null);var k=new s({vertexShader:g,fragmentShader:_,blending:2,depthWrite:!1,uniforms:{uSize:new o(.4),uResolution:new o(new e(C.width*C.pixelRatio,C.height*C.pixelRatio))}}),A=0,j={geometry:O,material:k,points:new r(O,k),maxCount:0,positions:[]};S.load(`./models.glb`,n=>{let i=n.scene.children.map(e=>e.geometry.attributes.position);for(let e of i)j.maxCount=e.count>j.maxCount?e.count:j.maxCount;for(let e of i){let t=e.array,n=new Float32Array(j.maxCount*3);for(let r=0;r<j.maxCount;r++){let i=r*3;if(i<t.length)n[i+0]=t[i+0],n[i+1]=t[i+1],n[i+2]=t[i+2];else{let r=Math.floor(e.count*Math.random())*3;n[i+0]=t[r+0],n[i+1]=t[r+1],n[i+2]=t[r+2]}}j.positions.push(new l(n,3))}j.geometry.dispose(),j.geometry=new t,j.geometry.setIndex(null),j.geometry.setAttribute(`position`,j.positions[0]),j.geometry.setAttribute(`aPositionTarget`,j.positions[1]),j.material.dispose(),j.material=new s({vertexShader:g,fragmentShader:_,blending:2,depthWrite:!1,uniforms:{uProgress:new o(0),uSize:new o(.4),uResolution:new o(new e(C.width*C.pixelRatio,C.height*C.pixelRatio))}}),j.points=new r(j.geometry,j.material),j.points.frustumCulled=!1,b.add(j.points),v.add(j.material.uniforms.uProgress,`value`).min(0).max(1).step(.01).name(`Progress`);let a=e=>()=>{j.geometry.attributes.position=j.positions[A],j.geometry.attributes.aPositionTarget=j.positions[e],A=e,p.fromTo(j.material.uniforms.uProgress,{value:0},{value:1,duration:2})},c={setTarget0:a(0),setTarget1:a(1),setTarget2:a(2),setTarget3:a(3)};v.add(c,`setTarget0`),v.add(c,`setTarget1`),v.add(c,`setTarget2`),v.add(c,`setTarget3`)});var M=()=>{T.update(),E.render(b,w),window.requestAnimationFrame(M)};M();