import{Dn as e,It as t,Sn as n,U as r,b as i,cn as a,en as o,ln as s,mn as c,n as l,nn as u,tn as d,u as f,vt as p,x as m,yt as h}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as g}from"../OrbitControls-D8EFuDj6.js";/* empty css               */import{t as _}from"../lil-gui.esm-DBlFozw-.js";var v=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}`,y=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    
    float sunOrientation = dot(normal, uSunDirection);
    

    
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    vec3 specularClouds = texture(uSpecularCloudsTexture, vUv).rgb;

    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    color = mix(nightColor, dayColor, dayMix);

    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
    float cloudsMix = smoothstep(0.4, 1.0, specularCloudsColor.g);
    cloudsMix = min(cloudsMix, dayMix);
    color = mix(color, vec3(1.0), cloudsMix);

    
    float fresnel = 1.0 + dot(viewDirection, normal);
    fresnel = pow(fresnel, 4.0);
    

    
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    
    vec3 reflection = reflect(- uSunDirection, normal);
    float specular = - dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 32.0);
    specular *= specularCloudsColor.r;

    vec3 specularColor = vec3(1.0);
    specularColor = mix(specularColor, atmosphereColor, fresnel);
    color += specular * specularColor;

    
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`,b=`/3journey/assets/day-DkcerPt2.jpg`,x=`/3journey/assets/night-BR_DbmEQ.jpg`,S=`/3journey/assets/specularClouds-DpLQ1-js.jpg`,C=`varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}`,w=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    
    float sunOrientation = dot(normal, uSunDirection);

    
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color += atmosphereColor;
    

    
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.025, 0.55, edgeAlpha);
    

    float dayAlpha = smoothstep(- 0.5, 0.0, sunOrientation);

    float alpha = edgeAlpha * dayAlpha;

    
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`,T=new _,E=document.querySelector(`canvas.webgl`);if(!E)throw Error(`Unable to connect to canvas!`);var D=new d,O=new c,k=O.load(b);k.colorSpace=o,k.anisotropy=8;var A=O.load(x);A.colorSpace=o,A.anisotropy=8;var j=O.load(S);j.anisotropy=8;var M={phi:Math.PI*.5,theta:.5,atmosphereDayColor:`#00aaff`,atmosphereTwilightColor:`#ff6600`},N=new s(1,M.phi,M.theta),P=new e,F=new p(new r(.1,2),new h);D.add(F);var I=()=>{P.setFromSpherical(N),F.position.copy(P).multiplyScalar(5)};I();var L=new a(2,64,64),R=new u({vertexShader:v,fragmentShader:y,uniforms:{uDayTexture:new n(k),uNightTexture:new n(A),uSpecularCloudsTexture:new n(j),uSunDirection:new n(P),uAtmosphereDayColor:new n(new m(M.atmosphereDayColor)),uAtmosphereTwilightColor:new n(new m(M.atmosphereTwilightColor))}}),z=new p(L,R);D.add(z);var B=new u({side:1,transparent:!0,vertexShader:C,fragmentShader:w,uniforms:{uSunDirection:new n(P),uAtmosphereDayColor:new n(new m(M.atmosphereDayColor)),uAtmosphereTwilightColor:new n(new m(M.atmosphereTwilightColor))}}),V=new p(L,B);V.scale.set(1.035,1.035,1.035),D.add(V),T.add(M,`phi`).min(0).max(Math.PI*2).onChange(e=>{N.phi=e,I()}),T.add(M,`theta`).min(0).max(Math.PI*2).onChange(e=>{N.theta=e,I()}),T.addColor(M,`atmosphereDayColor`).onChange(e=>{B.uniforms.uAtmosphereDayColor.value=new m(e),R.uniforms.uAtmosphereDayColor.value=new m(e)}),T.addColor(M,`atmosphereTwilightColor`).onChange(e=>{B.uniforms.uAtmosphereTwilightColor.value=new m(e),R.uniforms.uAtmosphereTwilightColor.value=new m(e)});var H={"Planet Texture":`solarsystemscope.com`};T.addFolder(`Credits`).add(H,`Planet Texture`).onChange(()=>{H[`Planet Texture`]=`solarsystemscope.com`});var U={width:window.innerWidth,height:window.innerHeight,pixelRatio:Math.min(window.devicePixelRatio,2)};window.addEventListener(`resize`,()=>{U.width=window.innerWidth,U.height=window.innerHeight,U.pixelRatio=Math.min(window.devicePixelRatio,2),W.aspect=U.width/U.height,W.updateProjectionMatrix(),K.setSize(U.width,U.height),K.setPixelRatio(U.pixelRatio)});var W=new t(25,U.width/U.height,.1,100);W.position.x=12,W.position.y=5,W.position.z=4,D.add(W);var G=new g(W,E);G.enableDamping=!0;var K=new l({canvas:E,antialias:!0});K.setSize(U.width,U.height),K.setPixelRatio(U.pixelRatio),K.setClearColor(`#000011`);var q=new i,J=()=>{let e=q.getElapsedTime();z.rotation.y=e*.1,G.update(),K.render(D,W),window.requestAnimationFrame(J)};J();