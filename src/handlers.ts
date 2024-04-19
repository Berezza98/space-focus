import { focusStore } from './store';
import { debounce } from './helpers/debounce';
import { DIRECTION, Keys } from './consts';

const mouseWheelHandler = (e: WheelEvent) => {
  if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
  if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
};

export function addHandlers({ keys, wheelDebounceMs }: { keys: Keys; wheelDebounceMs: number }) {
  window.addEventListener('keydown', e => {
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

  const debouncedMouseWheelHandler = debounce(mouseWheelHandler, wheelDebounceMs);

  window.addEventListener('mousewheel', debouncedMouseWheelHandler);
}
