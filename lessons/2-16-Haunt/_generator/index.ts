import * as THREE from 'three'
import { Roof } from './roof';

const house = new THREE.Group();

const floorPlan = new THREE.Shape([
  [0, 0],
  [1, 0],
  [1, 1],
  [3, 1],
  [3, 3],
  [-1, 3],
  [-1, 1],
  [0, 1]
].map((p) => new THREE.Vector2(...p)));

const tempFloor = new THREE.Mesh(
  new THREE.ExtrudeGeometry(floorPlan, { depth: 1, bevelEnabled: false }),
  new THREE.MeshBasicMaterial({ color: 0x0033ee })
)
tempFloor.rotation.x = -Math.PI / 2;
tempFloor.geometry.computeVertexNormals();
house.add(tempFloor);

Roof(floorPlan).then((roof) => {
  roof.rotation.y = Math.PI;
  roof.position.y = 1;
  house.add(roof);
});


export { house };
