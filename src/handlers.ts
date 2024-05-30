import { debounce } from './helpers/debounce';
import { DIRECTION, KEYS, Keys } from './consts';
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

  const { keys, wheelDebounceMs, emitActionOnKeyUp, actionPreventDefault, actionStopPropagation } = mergedKeys;

  window.addEventListener('keydown', (e) => {
    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (e.keyCode === keys.ENTER) {
      if (emitActionOnKeyUp) return;

      focusStore.activeAction();
    }
    if (e.keyCode === keys.RIGHT) {
      focusStore.getNextElement(DIRECTION.RIGHT);
    }

    if (e.keyCode === keys.LEFT) {
      focusStore.getNextElement(DIRECTION.LEFT);
    }

    if (e.keyCode === keys.DOWN) {
      focusStore.getNextElement(DIRECTION.DOWN);
    }

    if (e.keyCode === keys.UP) {
      focusStore.getNextElement(DIRECTION.UP);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (actionPreventDefault) e.preventDefault();
    if (actionStopPropagation) e.stopPropagation();

    if (e.keyCode === keys.ENTER) {
      if (emitActionOnKeyUp) focusStore.activeAction();
    }
  });

  const debouncedMouseWheelHandler = debounce((e: WheelEvent) => {
    if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
    if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
  }, wheelDebounceMs);

  window.addEventListener('mousewheel', debouncedMouseWheelHandler);
}
