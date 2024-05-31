import { Dispatch } from 'react';
import { Direction } from './consts';
import { ElementPosition } from './interfaces';
import { focusStore } from './store';

export interface FocusObjectConstructorOptions {
  layer: string;
  setFocused: Dispatch<React.SetStateAction<boolean>>;
  el: HTMLElement;
  id?: string;
  defaultFocused?: boolean;
  action?: () => any;
  overflowRightHandler?: () => any;
  overflowLeftHandler?: () => any;
  overflowUpHandler?: () => any;
  overflowDownHandler?: () => any;
  closest?: boolean;
  onFocus?: (element: FocusObject) => any;
  onBlur?: (element: FocusObject) => any;
  onDirectionKeyDown?: (active: FocusObject, direction: Direction) => boolean;
  focusableContainer?: string;
  saveLastFocused?: boolean;
  overwriteControl?: {
    [key in Direction]?: string;
  };
}

export class FocusObject {
  layer: string;

  setFocused: Dispatch<React.SetStateAction<boolean>>;

  el: HTMLElement;

  positions: ElementPosition;

  id?: string;

  defaultFocused?: boolean;

  action?: () => any;

  overflowRightHandler?: () => any;

  overflowLeftHandler?: () => any;

  overflowUpHandler?: () => any;

  overflowDownHandler?: () => any;

  closest?: boolean;

  onFocus?: (element: FocusObject) => any;

  onBlur?: (element: FocusObject) => any;

  onDirectionKeyDown?: (active: FocusObject, direction: Direction) => boolean;

  focusableContainer?: string;

  saveLastFocused?: boolean;

  overwriteControl?: {
    [key in Direction]?: string;
  };

  constructor(options: FocusObjectConstructorOptions) {
    const {
      layer,
      setFocused,
      el,
      id,
      defaultFocused,
      action,
      overflowRightHandler,
      overflowLeftHandler,
      overflowUpHandler,
      overflowDownHandler,
      closest,
      onFocus,
      onBlur,
      onDirectionKeyDown,
      focusableContainer,
      saveLastFocused,
      overwriteControl,
    } = options;

    this.layer = layer;
    this.setFocused = setFocused;
    this.el = el;
    this.positions = focusStore.measure(el);
    this.id = id;
    this.defaultFocused = defaultFocused;
    this.action = action;
    this.overflowRightHandler = overflowRightHandler;
    this.overflowLeftHandler = overflowLeftHandler;
    this.overflowUpHandler = overflowUpHandler;
    this.overflowDownHandler = overflowDownHandler;
    this.closest = closest;
    this.onFocus = onFocus;
    this.onBlur = onBlur;
    this.onDirectionKeyDown = onDirectionKeyDown;
    this.focusableContainer = focusableContainer;
    this.saveLastFocused = saveLastFocused;
    this.overwriteControl = overwriteControl;
  }

  mouseoverHandler = () => {
    focusStore.active = this;
  };

  clickHandler = (e: MouseEvent) => {
    if (typeof this.action === 'function') {
      this.action();
    }

    e.stopPropagation();
  };

  update(options: FocusObjectConstructorOptions) {
    const {
      setFocused,
      el,
      id,
      defaultFocused,
      action,
      overflowRightHandler,
      overflowLeftHandler,
      overflowUpHandler,
      overflowDownHandler,
      closest,
      onFocus,
      onBlur,
      onDirectionKeyDown,
      focusableContainer,
      saveLastFocused,
      overwriteControl,
    } = options;

    this.setFocused = setFocused;
    this.el = el;
    this.positions = focusStore.measure(el);
    this.id = id;
    this.defaultFocused = defaultFocused;
    this.action = action;
    this.overflowRightHandler = overflowRightHandler;
    this.overflowLeftHandler = overflowLeftHandler;
    this.overflowUpHandler = overflowUpHandler;
    this.overflowDownHandler = overflowDownHandler;
    this.closest = closest;
    this.onFocus = onFocus;
    this.onBlur = onBlur;
    this.onDirectionKeyDown = onDirectionKeyDown;
    this.focusableContainer = focusableContainer;
    this.saveLastFocused = saveLastFocused;
    this.overwriteControl = overwriteControl;
  }
}
