
import { type InstanceProps } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import hamburgerURL from '~/models/hamburger-draco.glb';


export function Burger(props: InstanceProps) {
  const hamburger = useGLTF(hamburgerURL);

  return <primitive object={hamburger.scene} position={[3.5, 0, 1]} scale={0.25} {...props} />
}
