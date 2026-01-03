
import { Robot } from "../../models/Robot/Robot"

export const Robots = () => {
  return <>
    <Robot position={[0,0,0]} scale={0.5} animationName='walk' />
    <Robot position={[2,0,0]} scale={0.5} animationName='hit' />
    <Robot position={[-2,0,0]} scale={0.5} animationName='idle' />
  </>
}