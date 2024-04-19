import { FocusStore, FocusStoreInitOptions } from './store';
export * from './components/FocusElement';
export * from './hooks/useFocus';
export * from './consts';
export * from './interfaces';

export function initFocus(options: Partial<FocusStoreInitOptions>) {
  FocusStore.init(options);
}
