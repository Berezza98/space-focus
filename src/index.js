import { FocusStore } from './store';
export { default as FocusElement } from './components/FocusElement';
export { default as useFocus } from './hooks/useFocus';

export default function initFocus({ keys= {} } = {}) {
  FocusStore.addHandlers(keys);
}