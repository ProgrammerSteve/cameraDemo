type BoundingBox = [number, number, number, number];
export const rectPointsToTriangles = ([xmin, ymin, width, height]: BoundingBox, d: number) => {
  let t = d / 2.0; //half the thickness
  let a1 = xmin;
  let b1 = ymin + height;
  let a2 = xmin;
  let b2 = ymin;
  let a3 = xmin + width;
  let b3 = ymin + height;
  let a4 = xmin + width;
  let b4 = ymin;

  return [
    a1 - t, b1 + t,
    a1 + t, b1 + t,
    a2 - t, b2 - t,
    a1 + t, b1 + t,
    a2 - t, b2 - t,
    a2 + t, b2 - t,

    a1 + t, b1 + t,
    a3 - t, b3 + t,
    a1 + t, b1 - t,
    a3 - t, b3 + t,
    a1 + t, b1 - t,
    a3 - t, b3 - t,

    a2 + t, b2 + t,
    a4 - t, b4 + t,
    a2 + t, b2 - t,
    a4 - t, b4 + t,
    a2 + t, b2 - t,
    a4 - t, b4 - t,

    a3 - t, b3 + t,
    a3 + t, b3 + t,
    a4 - t, b4 - t,
    a3 + t, b3 + t,
    a4 - t, b4 - t,
    a4 + t, b4 - t,
  ]
}
