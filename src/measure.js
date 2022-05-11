import Vector from './Vector';

export default function measure(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const center = Vector.getCenterVector(left, top, width, height);
  const topLeft = new Vector(left, top);
  const bottomRight = new Vector(left + width, top + height);

  return {
    center,
    topLeft,
    bottomRight,
    height,
    width,
  };
}