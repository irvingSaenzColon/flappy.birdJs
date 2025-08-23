function plane(base, height) {
  return [
    0.0, 0.0,
    base, 0.0,
    0.0, height,
    0.0, height,
    base, 0.0,
    base, height
  ];
}


function planeTexCoords() {
  return [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
  ]
}


export { plane, planeTexCoords }