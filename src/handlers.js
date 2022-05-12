import focusStore from './store';
import debounce from './helpers/debounce';
import { DIRECTION } from './consts';

const mouseWheelHandler = (e) => {
  if (e.deltaY < 0) focusStore.getNextElement(DIRECTION.UP);
  if (e.deltaY > 0) focusStore.getNextElement(DIRECTION.DOWN);
};

export default function addHandlers({ keys, wheelDebounceMs }) {
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

  const debouncedMouseWheelHandler = debounce(mouseWheelHandler, wheelDebounceMs);

  window.addEventListener('mousewheel', debouncedMouseWheelHandler);
}