import { HandlersInitOptions, addHandlers } from './handlers';
import { FocusStoreOptions, focusStore } from './store';
export * from './components';
export * from './hooks';
export * from './consts';
export * from './interfaces';

export function initFocus(storeOptions: Partial<FocusStoreOptions>, handlerOptions: Partial<HandlersInitOptions>) {
  focusStore.configure(storeOptions);
  addHandlers(handlerOptions);
}
