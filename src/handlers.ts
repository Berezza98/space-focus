import { debounce } from './helpers/debounce';
import { DIRECTION, KEYS, KeyName, Keys } from './consts';
import { focusStore } from './store';

export interface HandlersInitOptions {
  keys: Keys;
  wheelDebounceMs: number;
  emitActionOnKeyUp: boolean;
  actionStopPropagation: boolean;
  actionPreventDefault: boolean;
}

export function addHandlers(options: Partial<HandlersInitOptions>) {
  const mergedKeys: HandlersInitOptions = Object.assign(
    {},
    {
      keys: KEYS,
      wheelDebounceMs: 300,
      emitActionOnKeyUp: false,
      actionStopPropagation: false,
      actionPreventDefault: false,
    },
    options,
  );

  const isKeyEmitted = (emittedKeyCode: number, checkKeyCode: Keys[KeyName]): boolean => {
    if (Array.isArray(checkKeyCode)) return checkKeyCode.includes(emittedKeyCode);

    return emittedKeyCode === checkKeyCode;
  };

  const { keys, wheelDebounceMs, emitActionOnKeyUp, actionPreventDefault, actionStopPropagation } = mergedKeys;

  window.addEventListener('keydown', (e) => {
    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (isKeyEmitted(e.keyCode, keys.ENTER)) {
      if (emitActionOnKeyUp) return;

      focusStore.activeAction();
    }
    if (isKeyEmitted(e.keyCode, keys.RIGHT)) {
      focusStore.getNextElement(DIRECTION.RIGHT);
    }

    if (isKeyEmitted(e.keyCode, keys.LEFT)) {
      focusStore.getNextElement(DIRECTION.LEFT);
    }

    if (isKeyEmitted(e.keyCode, keys.DOWN)) {
      focusStore.getNextElement(DIRECTION.DOWN);
    }

    if (isKeyEmitted(e.keyCode, keys.UP)) {
      focusStore.getNextElement(DIRECTION.UP);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (isKeyEmitted(e.keyCode, keys.ENTER)) {
      if (emitActionOnKeyUp) focusStore.activeAction();
    }
  });

  const debouncedMouseWheelHandler = debounce((e: WheelEvent) => {
    if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
    if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
  }, wheelDebounceMs);

  window.addEventListener('mousewheel', debouncedMouseWheelHandler);
}
