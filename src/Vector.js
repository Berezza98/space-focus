class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  substract(v2) {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = v2;

    return new Vector(x2 - x1, y2 - y1);
  }

  static getCenterVector(x, y, width, height) {
    return new Vector(x + width / 2, y + height / 2);
  }

  static getDistance(v1, v2) {
    const { x: x1, y: y1 } = v1;
    const { x: x2, y: y2 } = v2;

    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  static getAngle(v1, v2) {
    const diffVector = v1.substract(v2);
    const angle = Math.atan2(diffVector.y, diffVector.x); // angle in radians
    
    return (180 / Math.PI) * angle; // angle in degrees
  }
}

export default Vector;