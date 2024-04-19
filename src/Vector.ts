export class Vector {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  substract(v2: Vector) {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = v2;

    return new Vector(x2 - x1, y2 - y1);
  }

  static getCenterVector(x: number, y: number, width: number, height: number) {
    return new Vector(x + width / 2, y + height / 2);
  }

  static getDistance(v1: Vector, v2: Vector) {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  static getAngle(v1: Vector, v2: Vector) {
    const diffVector = v1.substract(v2);
    const angle = Math.atan2(diffVector.y, diffVector.x); // angle in radians

    return (180 / Math.PI) * angle; // angle in degrees
  }
}
