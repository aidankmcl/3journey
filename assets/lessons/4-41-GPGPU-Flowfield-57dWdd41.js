import{Cs as e,Gi as t,H as n,Jr as r,Ns as i,Pt as a,U as o,Ui as s,Yi as c,Yr as l,do as u,ds as d,et as f,fa as p,fo as m,mn as h,n as g,pn as _,tt as v,ui as y,zi as b}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{t as x}from"../OrbitControls-D9g5_-6h.js";/* empty css               */import{t as S}from"../lil-gui.esm-Bz-JoirA.js";import"../BufferGeometryUtils-BxIfED0X.js";import{t as C}from"../DRACOLoader-_yQYS0Xp.js";import{t as w}from"../GLTFLoader-Dl36u2kt.js";var T=new b(-1,1,1,-1,0,1),E=new class extends o{constructor(){super(),this.setAttribute(`position`,new _([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new _([0,2,0,0,2,0],2))}},D=class{constructor(e){this._mesh=new r(E,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,T)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},O=class{constructor(e,t,n){this.variables=[],this.currentTextureIndex=0;let r=h,o={passThruTexture:{value:null}},s=u(f(),o),c=new D(s);this.setDataType=function(e){return r=e,this},this.addVariable=function(e,t,n){let r=this.createShaderMaterial(t),i={name:e,initialValueTexture:n,material:r,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:y,magFilter:y};return this.variables.push(i),i},this.setVariableDependencies=function(e,t){e.dependencies=t},this.init=function(){if(n.capabilities.maxVertexTextures===0)return`No support for vertex shader textures.`;for(let n=0;n<this.variables.length;n++){let r=this.variables[n];r.renderTargets[0]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),r.renderTargets[1]=this.createRenderTarget(e,t,r.wrapS,r.wrapT,r.minFilter,r.magFilter),this.renderTexture(r.initialValueTexture,r.renderTargets[0]),this.renderTexture(r.initialValueTexture,r.renderTargets[1]);let i=r.material,a=i.uniforms;if(r.dependencies!==null)for(let e=0;e<r.dependencies.length;e++){let t=r.dependencies[e];if(t.name!==r.name){let e=!1;for(let n=0;n<this.variables.length;n++)if(t.name===this.variables[n].name){e=!0;break}if(!e)return`Variable dependency not found. Variable=`+r.name+`, dependency=`+t.name}a[t.name]={value:null},i.fragmentShader=`
uniform sampler2D `+t.name+`;
`+i.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){let e=this.currentTextureIndex,t=this.currentTextureIndex===0?1:0;for(let n=0,r=this.variables.length;n<r;n++){let r=this.variables[n];if(r.dependencies!==null){let t=r.material.uniforms;for(let n=0,i=r.dependencies.length;n<i;n++){let i=r.dependencies[n];t[i.name].value=i.renderTargets[e].texture}}this.doRenderTarget(r.material,r.renderTargets[t])}this.currentTextureIndex=t},this.getCurrentRenderTarget=function(e){return e.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(e){return e.renderTargets[this.currentTextureIndex===0?1:0]},this.dispose=function(){c.dispose();let e=this.variables;for(let t=0;t<e.length;t++){let n=e[t];n.initialValueTexture&&n.initialValueTexture.dispose();let r=n.renderTargets;for(let e=0;e<r.length;e++)r[e].dispose()}};function l(n){n.defines.resolution=`vec2( `+e.toFixed(1)+`, `+t.toFixed(1)+` )`}this.addResolutionDefine=l;function u(e,t){t||={};let n=new m({name:`GPUComputationShader`,uniforms:t,vertexShader:d(),fragmentShader:e});return l(n),n}this.createShaderMaterial=u,this.createRenderTarget=function(n,a,o,s,c,l){return n||=e,a||=t,o||=1001,s||=1001,c||=1003,l||=1003,new i(n,a,{wrapS:o,wrapT:s,minFilter:c,magFilter:l,format:p,type:r,depthBuffer:!1})},this.createTexture=function(){let n=new Float32Array(e*t*4),r=new a(n,e,t,p,h);return r.needsUpdate=!0,r},this.renderTexture=function(e,t){o.passThruTexture.value=e,this.doRenderTarget(s,t),o.passThruTexture.value=null},this.doRenderTarget=function(e,t){let r=n.getRenderTarget(),i=n.xr.enabled,a=n.shadowMap.autoUpdate;n.xr.enabled=!1,n.shadowMap.autoUpdate=!1,c.material=e,n.setRenderTarget(t),c.render(n),c.material=s,n.xr.enabled=i,n.shadowMap.autoUpdate=a,n.setRenderTarget(r)};function d(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function f(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}},k=`uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;

attribute vec2 aParticlesUV;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main()
{
  vec4 particle = texture(uParticlesTexture, aParticlesUV);

  
  vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  float sizeIn = smoothstep(0.0, 0.1, particle.a);
  float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
  float size = min(sizeIn, sizeOut);

  
  gl_PointSize = size * aSize * uSize * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = aColor;
}`,A=`varying vec3 vColor;

void main()
{
  vec2 uv = gl_PointCoord;
  float distanceToCenter = length(uv - 0.5);
  if(distanceToCenter > 0.5)
        discard;
  
  
  gl_FragColor = vec4(vec3(vColor), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,j=`uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowfieldInfluence;
uniform float uFlowfieldStrength;
uniform float uFlowfieldFrequency;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 

  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

void main()
{
  float time = uTime * 0.2;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv);
  vec4 base = texture(uBase, uv);

  if (particle.a >= 1.0) {
    particle.a = mod(particle.a, 1.0);
    particle.xyz = base.xyz;
  } else {
    float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
    float influence = (uFlowfieldInfluence - 0.5) * -2.0;
    strength = smoothstep(influence, 1.0, strength);

    vec3 flowfield = vec3(
      simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency + 1.0, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency + 2.0, time))
    );
    flowfield = normalize(flowfield);
    particle.xyz += flowfield * uDeltaTime * strength * uFlowfieldStrength;

    
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle;
}`,M=new S({width:340}),N=document.querySelector(`canvas.webgl`);if(!N)throw Error(`No canvas available`);var P=new u,F=new C;F.setDecoderPath(`/3journey/draco/`);var I=new w;I.setDRACOLoader(F);var L={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)};window.addEventListener(`resize`,()=>{L.width=window.innerWidth,L.height=window.innerHeight,L.pixelRatio=Math.min(window.devicePixelRatio,2),U&&U.uniforms.uResolution.value.set(L.width*L.pixelRatio,L.height*L.pixelRatio),R.aspect=L.width/L.height,R.updateProjectionMatrix(),B.setSize(L.width,L.height),B.setPixelRatio(L.pixelRatio)});var R=new s(35,L.width/L.height,.1,100);R.position.set(10,5,20),P.add(R);var z=new x(R,N);z.enableDamping=!0;var B=new g({canvas:N,antialias:!0});B.setSize(L.width,L.height),B.setPixelRatio(L.pixelRatio);var V={clearColor:`#160920`};M.addColor(V,`clearColor`).onChange(()=>{B.setClearColor(V.clearColor)}),B.setClearColor(V.clearColor);var H=null,U=null,W=null;I.load(`./model.glb`,i=>{let a=i.scene.children[0].geometry;a.setIndex(null);let s=a.attributes.position.count,u=Math.ceil(Math.sqrt(s));H=new O(u,u,B);let f=H.createTexture();for(let e=0;e<s;e++){let t=e*3,n=e*4;if(!f.image.data)break;f.image.data[n+0]=a.attributes.position.array[t+0],f.image.data[n+1]=a.attributes.position.array[t+1],f.image.data[n+2]=a.attributes.position.array[t+2],f.image.data[n+3]=Math.random()}W=H.addVariable(`uParticles`,j,f),H.setVariableDependencies(W,[W]),W.material.uniforms.uTime=new d(0),W.material.uniforms.uDeltaTime=new d(0),W.material.uniforms.uBase=new d(f),W.material.uniforms.uFlowfieldInfluence=new d(.75),W.material.uniforms.uFlowfieldStrength=new d(.75),W.material.uniforms.uFlowfieldFrequency=new d(.75),H.init();let p=new r(new t(3,3),new l({map:H.getCurrentRenderTarget(W).texture}));p.position.x=3,P.add(p),p.visible=!1,U=new m({vertexShader:k,fragmentShader:A,uniforms:{uSize:new d(.15),uResolution:new d(new e(L.width*L.pixelRatio,L.height*L.pixelRatio)),uParticlesTexture:new d(H.getCurrentRenderTarget(W).texture)}});let h={size:u,computation:H,particlesVariable:W,material:U},g=new Float32Array(s*2),_=new Float32Array(s);for(let e=0;e<h.size;e++)for(let t=0;t<h.size;t++){let n=e*h.size+t,r=n*2,i=(t+.5)/h.size,a=(e+.5)/h.size;g[r+0]=i,g[r+1]=a,_[n]=Math.random()}let v=new o;v.setDrawRange(0,s),v.setAttribute(`aParticlesUV`,new n(g,2)),v.setAttribute(`aColor`,a.attributes.color),v.setAttribute(`aSize`,new n(_,1));let y={geometry:v,material:U,points:new c(v,U),maxCount:0,positions:[]};P.add(y.points)});var G=new v,K=0,q=()=>{z.update();let e=G.getElapsedTime(),t=e-K;K=e,H&&U&&W&&(W.material.uniforms.uTime.value=e,W.material.uniforms.uDeltaTime.value=t,H.compute(),U.uniforms.uParticlesTexture.value=H.getCurrentRenderTarget(W).texture),B.render(P,R),window.requestAnimationFrame(q)};q();