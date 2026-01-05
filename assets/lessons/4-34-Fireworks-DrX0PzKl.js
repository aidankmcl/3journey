import{B as e,Cs as t,Jr as n,To as r,U as i,Ui as a,Ur as o,Yi as s,Yo as c,c as l,do as u,ds as d,fo as f,j as p,n as m,nt as h,pn as g,ps as _,tt as v,ws as y}from"../three.module-BgH6z1r2.js";import"../modulepreload-polyfill-Dxig7UG6.js";import{t as b}from"../OrbitControls-D9g5_-6h.js";/* empty css               */import{t as x}from"../lil-gui.esm-Bz-JoirA.js";import{t as S}from"../gsap-DcInoLLg.js";var C=class t extends n{constructor(){let n=t.SkyShader,r=new f({name:n.name,uniforms:_.clone(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,depthWrite:!1});super(new e(1,1,1),r),this.isSky=!0}};C.SkyShader={name:`SkyShader`,uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new y},up:{value:new y(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var w=`precision mediump float;

attribute float aSize;
attribute float aTimingMultiplier;

uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

varying vec2 vUv;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
  vec3 newPos = position;

  float progress = uProgress * aTimingMultiplier;

  
  float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
  newPos *= explodingProgress;

  
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingProgress = clamp(fallingProgress, 0.0, 1.0);
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  newPos.y -= fallingProgress * 0.2;

  
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);

  
  float twinklingProgress = remap(progress, 0.5, 0.8, 0.0, 1.0);
  twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 50.0) * 0.5 + 0.5;
  sizeTwinkling = 1.0 - (sizeTwinkling * twinklingProgress);

  vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
  gl_PointSize *= 1.0 / - viewPosition.z;

  if (gl_PointSize < 1.0) gl_Position = vec4(9999);

  vUv = uv;
}`,T=`precision mediump float;

uniform float uElapsed;
uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
  vec4 tex = texture(uTexture, gl_PointCoord);
  
  float alpha = tex.r;  
  gl_FragColor = vec4(uColor, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,E=new x,D=window.innerWidth,O=window.innerHeight,k=Math.min(window.devicePixelRatio,2),A={width:D,height:O,pixelRatio:k,resolution:new t(D*k,O*k)},j=document.querySelector(`canvas.webgl`);if(!j)throw Error(`Unable to connect to canvas!`);var M=new u,N=new c,P=[N.load(`./particles/1.png`),N.load(`./particles/2.png`),N.load(`./particles/3.png`),N.load(`./particles/4.png`),N.load(`./particles/5.png`),N.load(`./particles/6.png`),N.load(`./particles/7.png`),N.load(`./particles/8.png`)],F=0,I=(e=100,t=new y,n=.05,a=P[7],o=1,c=new h(.1,.4,.8))=>{let l=new Float32Array(e),u=new Float32Array(e),p=new Float32Array(e*3);for(let t=0;t<e;t++){l[t]=1+Math.random(),u[t]=Math.random();let e=new r(o*(.75+Math.random()*.25),Math.random()*Math.PI,Math.random()*Math.PI*2),n=new y;n.setFromSpherical(e);let i=t*3;p[i]=n.x,p[i+1]=n.y,p[i+2]=n.z}let m=new i;m.setAttribute(`position`,new g(p,3)),m.setAttribute(`aSize`,new g(u,1)),m.setAttribute(`aTimingMultiplier`,new g(l,1)),a.flipY=!1;let _=new f({vertexShader:w,fragmentShader:T,transparent:!0,depthWrite:!1,blending:2,uniforms:{uElapsed:new d(F),uSize:new d(n),uResolution:new d(A.resolution),uTexture:new d(a),uColor:new d(c),uProgress:new d(0)}}),v=new s(m,_);v.position.copy(t),M.add(v),S.to(_.uniforms.uProgress,{value:1,duration:3,ease:`linear`,onComplete:()=>{M.remove(v),m.dispose(),_.dispose()}})},L=new a(75,A.width/A.height,.1,100);L.position.set(0,0,1),M.add(L);var R=new b(L,j),z=new m({canvas:j});z.setSize(A.width,A.height),z.setPixelRatio(A.pixelRatio),z.render(M,L);var B=(e=5)=>e/2-Math.random()*e,V=()=>{let e=new y(B(5),B(5),B(5)),t=P[Math.floor(Math.random()*P.length)],n=new h;n.setHSL(Math.random(),1,.7),I(500,e,.1,t,2,n)};V();var H=new C;H.scale.setScalar(45e4),M.add(H);var U=new y,W={turbidity:20,rayleigh:1.75,mieCoefficient:.015,mieDirectionalG:.7,elevation:-2,azimuth:180,exposure:z.toneMappingExposure};function G(){let e=H.material.uniforms;e.turbidity.value=W.turbidity,e.rayleigh.value=W.rayleigh,e.mieCoefficient.value=W.mieCoefficient,e.mieDirectionalG.value=W.mieDirectionalG;let t=o.degToRad(90-W.elevation),n=o.degToRad(W.azimuth);U.setFromSphericalCoords(1,t,n),e.sunPosition.value.copy(U),z.toneMappingExposure=W.exposure,z.render(M,L)}E.add(W,`turbidity`,0,20,.1).onChange(G),E.add(W,`rayleigh`,0,4,.001).onChange(G),E.add(W,`mieCoefficient`,0,.1,.001).onChange(G),E.add(W,`mieDirectionalG`,0,1,.001).onChange(G),E.add(W,`elevation`,-45,90,.1).onChange(G),E.add(W,`azimuth`,-180,180,.1).onChange(G),E.add(W,`exposure`,0,1,1e-4).onChange(G),G();var K=new v,q=()=>{F=K.getElapsedTime(),R.update(),z.render(M,L),window.requestAnimationFrame(q)};q(),window.addEventListener(`click`,V),window.addEventListener(`resize`,()=>{A.width=window.innerWidth,A.height=window.innerHeight,A.pixelRatio=Math.min(window.devicePixelRatio,2),A.resolution.set(A.width*A.pixelRatio,A.height*A.pixelRatio),L.aspect=A.width/A.height,L.updateProjectionMatrix(),z.setSize(A.width,A.height),z.setPixelRatio(A.pixelRatio)});