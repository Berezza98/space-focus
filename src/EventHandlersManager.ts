import { debounce } from './helpers/debounce';
import { DIRECTION, KeyName, Keys, KEYS } from './consts';
import { focusStore } from './store';

export interface HandlersInitOptions {
  keys: Keys;
  wheelDebounceMs: number;
  emitActionOnKeyUp: boolean;
  actionStopPropagation: boolean;
  actionPreventDefault: boolean;
  disableHandlers: boolean;
}

export class EventHandlersManager {
  private options: HandlersInitOptions;

  private debouncedMouseWheelHandler: () => void;

  constructor(options: Partial<HandlersInitOptions>) {
    this.options = {
      keys: KEYS,
      wheelDebounceMs: 300,
      emitActionOnKeyUp: false,
      actionStopPropagation: false,
      actionPreventDefault: false,
      disableHandlers: false,
      ...options,
    };

    this.debouncedMouseWheelHandler = debounce(this.mouseWheelHandler, this.options.wheelDebounceMs);

    this.addHandlers();
  }

  addHandlers() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    window.addEventListener('mousewheel', this.debouncedMouseWheelHandler);
  }

  removeHandlers() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('mousewheel', this.debouncedMouseWheelHandler);
  }

  updateOptions(newOptions: Partial<HandlersInitOptions>) {
    this.options = {
      ...this.options,
      ...newOptions,
    };
  }

  private isKeyEmitted(emittedKeyCode: number, checkKeyCode: Keys[KeyName]): boolean {
    if (Array.isArray(checkKeyCode)) return checkKeyCode.includes(emittedKeyCode);

    return emittedKeyCode === checkKeyCode;
  }

  private keydownHandler = (e: KeyboardEvent) => {
    const { keys, emitActionOnKeyUp, actionPreventDefault, actionStopPropagation, disableHandlers } = this.options;

    if (disableHandlers) return;

    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (this.isKeyEmitted(e.keyCode, keys.ENTER)) {
      if (emitActionOnKeyUp) return;

      focusStore.activeAction();
    }
    if (this.isKeyEmitted(e.keyCode, keys.RIGHT)) {
      focusStore.getNextElement(DIRECTION.RIGHT);
    }

    if (this.isKeyEmitted(e.keyCode, keys.LEFT)) {
      focusStore.getNextElement(DIRECTION.LEFT);
    }

    if (this.isKeyEmitted(e.keyCode, keys.DOWN)) {
      focusStore.getNextElement(DIRECTION.DOWN);
    }

    if (this.isKeyEmitted(e.keyCode, keys.UP)) {
      focusStore.getNextElement(DIRECTION.UP);
    }
  };

  private keyupHandler = (e: KeyboardEvent) => {
    const { keys, emitActionOnKeyUp, actionPreventDefault, actionStopPropagation, disableHandlers } = this.options;

    if (disableHandlers) return;

    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (this.isKeyEmitted(e.keyCode, keys.ENTER)) {
      if (emitActionOnKeyUp) focusStore.activeAction();
    }
  };

  private mouseWheelHandler = (e: WheelEvent) => {
    const { disableHandlers } = this.options;

    if (disableHandlers) return;

    if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
    if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
  };
}
