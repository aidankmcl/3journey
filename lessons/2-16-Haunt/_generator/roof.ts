import * as THREE from 'three';

import { getClipperLib } from '~/clipper';


type Point = { x: number; y: number; z: number; };

function getRoofPoints(floorPoints: Point[], height: number = 1) {
  const zVals = floorPoints.map(p => p.y);

  const frontX = (floorPoints[0].x + floorPoints[1].x) / 2;
  const frontZ = (floorPoints[0].z + floorPoints[1].z) / 2;

  const middleX = frontX;
  const middleZ = (Math.max(...zVals) + Math.min(...zVals)) / 2;

  const rightX = (floorPoints[2].x + floorPoints[3].x) / 2;
  const rightZ = middleZ;

  const leftX = (floorPoints[6].x + floorPoints[7].x) / 2;
  const leftZ = middleZ;

  return {
    front: { x: frontX, y: height, z: frontZ },
    middle: { x: middleX, y: height, z: middleZ },
    right: { x: rightX, y: height, z: rightZ },
    left: { x: leftX, y: height, z: leftZ },
  }
}

async function getClipperOffset(
  floorPoints: Point[], 
  offsetDistance: number
): Promise<Point[]> {
  const lib = await getClipperLib();

  // 2. Memory Allocation (The "WASM Tax")
  const paths = new lib.PathsD();
  const path = new lib.PathD();

  // 3. Convert JS Points -> C++ Points
  for (const p of floorPoints) {
    // Note: PointD is a class in WASM, not a plain object
    const pt = new lib.PointD(p.x, p.y, p.z);
    path.push_back(pt);
    pt.delete(); // Important: Delete the temp point immediately after pushing
  }

  // Add the path to the Paths collection
  paths.push_back(path);

  // 4. Execute Offset (Inflate)
  const resultPaths = lib.InflatePathsD(
    paths,
    offsetDistance,
    lib.JoinType.Miter,
    lib.EndType.Polygon,
    2.0, // Miter Limit
    2,   // Precision - standard for floating point
    0.0  // Arc Tolerance
  );

  // 5. Convert C++ Result -> JS Points
  // We assume a simple roof (1 outer loop), so we take resultPaths.get(0)
  const newFloorPlan: { x: number; y: number, z: number }[] = [];
  
  if (resultPaths.size() > 0) {
    const resultPath = resultPaths.get(0);
    for (let i = 0; i < resultPath.size(); i++) {
      const pt = resultPath.get(i);
      newFloorPlan.push({ x: pt.x, y: pt.y, z: Number(pt.z) });
    }
  }

  // 6. CLEANUP (Crucial!)
  // If you don't do this, your app will crash with "Out of Memory" after a few hundred roofs.
  paths.delete();
  path.delete();
  resultPaths.delete();

  return newFloorPlan;
}

const toVector3 = (p: Point, height?: number) => [p.x, height ?? p.z, p.y];

async function createRoofGeometry(originalShape: THREE.Shape, height: number = 1, offsetDistance: number = 0.4) {
  const scale = 1; // Clipper works with integers, so we scale up
  const path: Point[] = [];

  // 1. Convert Three.js Vector2 points to Clipper IntPoints
  const points = originalShape.getPoints();
  points.forEach(v => {
    path.push({ x: Math.round(v.x * scale), y: Math.round(v.y * scale), z: 0 });
  });

  const updatedPath = await getClipperOffset(path, offsetDistance * scale);
  const roofTopPoints = getRoofPoints(path);

  console.log(roofTopPoints);

  const geomVertices = new Float32Array([
    ...toVector3(updatedPath[6]),
    ...toVector3(roofTopPoints.front, height),
    ...toVector3(updatedPath[7]),

    ...toVector3(updatedPath[7]),
    ...toVector3(roofTopPoints.front, height),
    ...toVector3(updatedPath[0]),

    ...toVector3(updatedPath[0]),
    ...toVector3(roofTopPoints.front, height),
    ...toVector3(roofTopPoints.middle, height),

    // ...toVector3(updatedPath[1]),
    // ...toVector3(roofTopPoints.front, height),
    // ...toVector3(updatedPath[2]),

    // ...toVector3(updatedPath[2]),
    // ...toVector3(roofTopPoints.front, height),
    // ...toVector3(roofTopPoints.middle, height),

    // ...toVector3(roofTopPoints.middle, height),
    // ...toVector3(updatedPath[2]),
    // ...toVector3(updatedPath[3]),

    // ...toVector3(updatedPath[3]),
    // ...toVector3(roofTopPoints.middle, height),
    // ...toVector3(roofTopPoints.right, height),

    // ...toVector3(roofTopPoints.right, height),
    // ...toVector3(updatedPath[3]),
    // ...toVector3(updatedPath[4]),

    // ...toVector3(updatedPath[4]),
    // ...toVector3(roofTopPoints.right, height),
    // ...toVector3(updatedPath[5]),

    // ...toVector3(updatedPath[5]),
    // ...toVector3(roofTopPoints.right, height),
    // ...toVector3(roofTopPoints.left, height),

    // ...toVector3(roofTopPoints.left, height),
    // ...toVector3(updatedPath[5]),
    // ...toVector3(updatedPath[6]),

    // ...toVector3(updatedPath[6]),
    // ...toVector3(roofTopPoints.left, height),
    // ...toVector3(updatedPath[7]),

    // ...toVector3(updatedPath[7]),
    // ...toVector3(roofTopPoints.left, height),
    // ...toVector3(roofTopPoints.middle, height),

    // ...toVector3(roofTopPoints.middle, height),
    // ...toVector3(updatedPath[7]),
    // ...toVector3(updatedPath[0]),

    // ...toVector3(updatedPath[0]),
    // ...toVector3(updatedPath[7]),
    // ...toVector3(roofTopPoints.front, height),

    // ...toVector3(roofTopPoints.front, height),
    // ...toVector3(updatedPath[7]),
    // ...toVector3(roofTopPoints.middle, height),
  ]);

  console.log(geomVertices);

  // return new THREE.Shape(updatedPath.map((p) => new THREE.Vector2(p.x / scale, p.y / scale)));
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(geomVertices, 3));
  geom.scale(-1, 1, 1);
  return geom;
}

export const Roof = async (floorPlan: THREE.Shape) => {
  const roofGeom = await createRoofGeometry(floorPlan);

  return new THREE.Mesh(
    roofGeom,
    new THREE.MeshBasicMaterial({ color: 0xaa3300, side: THREE.DoubleSide })
  )
}
