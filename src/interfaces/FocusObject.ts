import { Dispatch } from 'react';
import { ElementPosition } from './ElementPosition';
import { Direction } from '../consts';

export interface FocusObject {
  layer: string;
  setFocused: Dispatch<React.SetStateAction<boolean>>;
  el: HTMLElement;
  positions: ElementPosition;
  id?: string;
  defaultFocused?: boolean;
  action?: () => any;
  overflowRightHandler?: () => any;
  closest?: boolean;
  onFocus?: (element: FocusObject) => any;
  onBlur?: (element: FocusObject) => any;
  onDirectionKeyDown?: (active: FocusObject, direction: Direction) => boolean;
  focusableContainer?: any; // TODO
  saveLastFocused?: boolean;
  overwriteControl?: {
    [key in Direction]?: string;
  };
}
