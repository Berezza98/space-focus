import { debounce } from './helpers/debounce';
import { DIRECTION, KEYS, Keys } from './consts';
import { focusStore } from './store';

export interface HandlersInitOptions {
  keys: Keys;
  wheelDebounceMs: number;
}

export function addHandlers(options: Partial<HandlersInitOptions>) {
  const mergedKeys: HandlersInitOptions = Object.assign(
    {},
    {
      keys: KEYS,
      wheelDebounceMs: 300,
    },
    options,
  );

  const { keys, wheelDebounceMs } = mergedKeys;

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === keys.ENTER) {
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

  const debouncedMouseWheelHandler = debounce((e: WheelEvent) => {
    if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
    if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
  }, wheelDebounceMs);

  window.addEventListener('mousewheel', debouncedMouseWheelHandler);
}
