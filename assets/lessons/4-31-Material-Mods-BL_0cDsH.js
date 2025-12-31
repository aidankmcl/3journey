import{E as e,It as t,Pt as n,b as r,bt as i,en as a,i as o,j as s,mn as c,n as l,qt as u,tn as d,vt as f,wt as p}from"../three.module-LFc9tN89.js";import"../modulepreload-polyfill-BnBYtx4y.js";import{t as m}from"../OrbitControls-D8EFuDj6.js";import"../BufferGeometryUtils-B3Y9T7UZ.js";import{t as h}from"../GLTFLoader-BYphv5hi.js";var g=`/3journey/assets/px-B_mJEnHZ.jpg`,_=`/3journey/assets/nx-B2jA2_bj.jpg`,v=`/3journey/assets/py-BAJs89dn.jpg`,y=`/3journey/assets/ny-Cwwt0CJa.jpg`,b=`/3journey/assets/pz-CxN-nNoH.jpg`,x=`/3journey/assets/nz-BR32y5g7.jpg`,S=`/3journey/assets/color-lrtiHrXO.jpg`,C=`/3journey/assets/normal-CeJmrFHk.jpg`,w=`/3journey/assets/LeePerrySmith-BMNXvrc1.glb`,T=document.querySelector(`canvas.webgl`);if(!T)throw Error(`No canvas available to target`);var E=new d,D=new c,O=new h,k=new e,A=()=>{E.traverse(e=>{e instanceof f&&e.material instanceof p&&(e.material.envMapIntensity=1,e.material.needsUpdate=!0,e.castShadow=!0,e.receiveShadow=!0)})},j=k.load([g,_,v,y,b,x]);E.background=j,E.environment=j;var M=D.load(S);M.colorSpace=a;var N=D.load(C),P=new i({depthPacking:u});P.onBeforeCompile=e=>{e.uniforms.uTime=I.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`
    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
    {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    #include <common>
    `),e.vertexShader=e.vertexShader.replace(`#include <beginnormal_vertex>`,`
    #include <beginnormal_vertex>

    float angle = (0.2 * position.y) + uTime;
    mat2 rotateMatrix = get2dRotateMatrix(angle);
    
    transformed.xz = rotateMatrix * transformed.xz;
    `),e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`
    #include <begin_vertex>
    
    transformed.xz = rotateMatrix * transformed.xz;
    `)};var F=new p({map:M,normalMap:N}),I={uTime:{value:0}};F.onBeforeCompile=e=>{e.uniforms.uTime=I.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`
    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
    {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    #include <common>
    `),e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`
    #include <begin_vertex>

    float angle = (0.2 * position.y) + uTime;
    mat2 rotateMatrix = get2dRotateMatrix(angle);
    
    transformed.xz = rotateMatrix * transformed.xz;
    `)},O.load(w,e=>{let t=e.scene.children[0];t.rotation.y=Math.PI*.5,t.material=F,t.customDepthMaterial=P,E.add(t),A()});var L=new s(`#ffffff`,3);L.castShadow=!0,L.shadow.mapSize.set(1024,1024),L.shadow.camera.far=15,L.shadow.normalBias=.05,L.position.set(.25,2,-2.25),E.add(L);var R={width:window.innerWidth,height:window.innerHeight};window.addEventListener(`resize`,()=>{R.width=window.innerWidth,R.height=window.innerHeight,z.aspect=R.width/R.height,z.updateProjectionMatrix(),V.setSize(R.width,R.height),V.setPixelRatio(Math.min(window.devicePixelRatio,2))});var z=new t(75,R.width/R.height,.1,100);z.position.set(4,1,-4),E.add(z);var B=new m(z,T);B.enableDamping=!0;var V=new l({canvas:T,antialias:!0});V.shadowMap.enabled=!0,V.shadowMap.type=1,V.toneMapping=4,V.toneMappingExposure=1,V.setSize(R.width,R.height),V.setPixelRatio(Math.min(window.devicePixelRatio,2));var H=new r,U=()=>{let e=H.getElapsedTime();I.uTime.value=e,B.update(),V.render(E,z),window.requestAnimationFrame(U)};U();