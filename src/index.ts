import { HandlersInitOptions, EventHandlersManager } from './EventHandlersManager';
import { FocusStoreOptions, focusStore } from './store';
export * from './FocusObject';
export * from './components';
export * from './hooks';
export * from './consts';
export * from './interfaces';

type InitConfig = {
  storeOptions: Partial<FocusStoreOptions>;
  handlerOptions: Partial<HandlersInitOptions>;
};

class SpaceFocus {
  private wasInitialized = false;

  private eventHandlerManager: EventHandlersManager | null = null;

  init(initConfig: InitConfig) {
    if (this.wasInitialized) return;

    const { handlerOptions, storeOptions } = initConfig;

    focusStore.configure(storeOptions);

    this.eventHandlerManager = new EventHandlersManager(handlerOptions);
    this.wasInitialized = true;
  }

  disableHandlers() {
    if (!this.eventHandlerManager) return;

    this.eventHandlerManager.updateOptions({
      disableHandlers: true,
    });
  }

  enableHandlers() {
    if (!this.eventHandlerManager) return;

    this.eventHandlerManager.updateOptions({
      disableHandlers: false,
    });
  }
}

export const spaceFocus = new SpaceFocus();
