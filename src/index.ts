import { FocusStore, FocusStoreInitOptions } from './store';

export { FocusElement } from './components/FocusElement';
export { useFocus } from './hooks/useFocus';
export { DEFAULT_LAYER_ID, DIRECTION } from './consts';

export function initFocus(options: Partial<FocusStoreInitOptions>) {
  FocusStore.init(options);
}
