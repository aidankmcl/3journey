
import {
  mix,
  color,
  time,
  positionLocal,
  mx_noise_float,
  normalLocal,
  smoothstep,
  float,
  instanceIndex
} from "three/tsl";


// // Wavy
export const GRID_SIZE = 50;
export const COUNT = GRID_SIZE * GRID_SIZE;
export const SPACING = 2.5;

export const getWaveNodes = () => {
  const seed = float(instanceIndex).mul(0.5);
  const offsetTime = time.add(seed);

  const noiseInput = positionLocal.mul(2.5).add(offsetTime);
  const noise = mx_noise_float(noiseInput);

  const displacement = normalLocal.mul(noise.mul(0.25));

  return {
    colorNode: mix(color('blue'), color('red'), smoothstep(0, 0.5, noise)),
    positionNode: positionLocal.add(displacement)
  };
};
