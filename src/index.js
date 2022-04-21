import store, { FocusStore } from './store';
import FocusElement from './components/FocusElement';
import useFocus from './hooks/useFocus';

export default function initFocus({ keys= {} } = {}) {
  FocusStore.addHandlers(keys);

  return {
    store,
    FocusElement,
    useFocus,
  };
}