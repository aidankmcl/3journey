
import { type InstanceProps } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import hamburgerURL from '~/models/hamburger-draco.glb';


export function Burger(props: InstanceProps) {
  const hamburger = useGLTF(hamburgerURL);

  return <primitive object={hamburger.scene} scale={0.25} {...props} />
}
