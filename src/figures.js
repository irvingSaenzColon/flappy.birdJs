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


export { plane }