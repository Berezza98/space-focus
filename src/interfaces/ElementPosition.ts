import { Vector } from '../Vector';

export interface ElementPosition {
  center: Vector;
  topLeft: Vector;
  bottomRight: Vector;
  height: number;
  width: number;
}
