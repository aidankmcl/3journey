
import { useLoader } from '@react-three/fiber';

// Model imports
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import hamburgerURL from '~/models/hamburger.glb';
// import hamburgerURL from '~/models/hamburger-draco.glb';
import flightHelmetURL from '~/models/FlightHelmet/glTF/FlightHelmet.gltf?url';


export function Helmet() {
  // const model = useLoader(GLTFLoader, hamburgerURL);
  // const hamburger = useLoader(GLTFLoader, hamburgerURL, (loader) => {
  //   const dracoLoader = new DRACOLoader();
  //   dracoLoader.setDecoderPath('/draco/');
  //   loader.setDRACOLoader(dracoLoader);
  // });

  const helmet = useLoader(GLTFLoader, flightHelmetURL, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./3journey/draco/')
    loader.setDRACOLoader(dracoLoader)
  });

  return <>
    {/* <primitive object={hamburger.scene} scale={0.35} /> */}
    <primitive object={helmet.scene} scale={5} />
  </>
}
