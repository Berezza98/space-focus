import { HandlersInitOptions, addHandlers } from './handlers';
import { FocusStoreOptions, focusStore } from './store';
export * from './FocusObject';
export * from './components';
export * from './hooks';
export * from './consts';
export * from './interfaces';

function init() {
  let wasInited = false;

  return (storeOptions: Partial<FocusStoreOptions>, handlerOptions: Partial<HandlersInitOptions>) => {
    if (wasInited) return;

    focusStore.configure(storeOptions);
    addHandlers(handlerOptions);

    wasInited = true;
  };
}

export const initFocus = init();
