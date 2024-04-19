export const DEFAULT_LAYER_ID = 'DEFAULT_LAYER';

export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export type Direction = typeof DIRECTION[keyof typeof DIRECTION];

export const KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
};

export type Keys = typeof KEYS;
