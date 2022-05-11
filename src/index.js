import { FocusStore } from './store';

export { default as FocusElement } from './components/FocusElement';
export { default as useFocus } from './hooks/useFocus';
export { DEFAULT_LAYER_ID, DIRECTION } from './consts';

export default function initFocus({ keys= {} } = {}) {
  FocusStore.addHandlers(keys);
}