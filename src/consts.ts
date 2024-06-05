export const DEFAULT_LAYER_ID = 'DEFAULT_LAYER';

export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export enum KeyName {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ENTER = 'ENTER',
}

export type Keys = Record<KeyName, number | number[]>;

export const KEYS: Keys = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
} as const;
