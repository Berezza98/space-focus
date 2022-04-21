import focusStore from './store';
import { DIRECTION } from './consts';

export default function addHandlers(keys) {
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
}