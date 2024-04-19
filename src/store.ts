import { Vector } from './Vector';
import { DIRECTION, DEFAULT_LAYER_ID, KEYS, Keys, Direction } from './consts';
import { addHandlers } from './handlers';
import { FocusObject } from './interfaces/FocusObject';
import { measure } from './measure';

export interface FocusStoreInitOptions {
  keys: Keys;
  wheelDebounceMs: number;
}

export interface SetActiveLayerOptions {
  useLastFocused: boolean;
}

export class FocusStore {
  elements: Record<string | number, FocusObject[]> = {};

  private _lastFocusedFromLayer: Record<string, FocusObject> = {};

  private _lastFocusedFromContainer: Record<string, FocusObject> = {};

  private _active: FocusObject | undefined;

  private _activeLayer: string = DEFAULT_LAYER_ID;

  set active(el: FocusObject) {
    let elementToFocus = el;

    if (this.active) {
      this.active.setFocused(false);
  
      if (typeof this.active.onBlur === 'function') {
        this.active.onBlur(this.active);
      }
    } 

    elementToFocus = this._handleFocusableContainers(elementToFocus);

    if (elementToFocus.saveLastFocused) {
      this.lastFocusedFromLayer[elementToFocus.layer] = elementToFocus;
    }

    this._active = elementToFocus;
    elementToFocus.setFocused(true);

    if (typeof elementToFocus.onFocus === 'function') {
      elementToFocus.onFocus(elementToFocus);
    }
  }

  get active(): FocusObject | undefined {
    return this._active;
  }

  set activeLayer(layerId) {
    this._activeLayer = layerId;
  }

  get activeLayer() {
    return this._activeLayer;
  }

  get otherElements() {
    return this.elements[this.activeLayer]?.filter(el => el !== this.active);
  }

  get lastFocusedFromLayer() {
    return this._lastFocusedFromLayer;
  }

  set lastFocusedFromLayer(value) {
    this._lastFocusedFromLayer = value;
  }

  get lastFocusedFromContainer() {
    return this._lastFocusedFromContainer;
  }

  set lastFocusedFromContainer(value) {
    this._lastFocusedFromContainer = value;
  }

  get allElements() {
    const layers = Object.values(this.elements);

    return layers.reduce((acc, layer) => acc.concat(layer), []);
  }

  static instance: FocusStore | null = null;

  static createStore() {
    if (!FocusStore.instance) {
      FocusStore.instance = new FocusStore();
    }

    return FocusStore.instance;
  }

  static init(options: Partial<FocusStoreInitOptions>) {
    const mergedKeys = Object.assign(
      {},
      {
        keys: KEYS,
        wheelDebounceMs: 300,
      },
      options
    );

    addHandlers(mergedKeys);
  }

  _handleFocusableContainers(el: FocusObject) {
    if (!el.focusableContainer) return el;

    const sameFocusableContainer = this.active?.focusableContainer === el.focusableContainer;
    const lastFocusedFromContainerExists = this.lastFocusedFromContainer[el.focusableContainer];

    if (!sameFocusableContainer && lastFocusedFromContainerExists) {
      return this.lastFocusedFromContainer[el.focusableContainer];
    }

    if ((!sameFocusableContainer && !lastFocusedFromContainerExists) || el.saveLastFocused) {
      this.lastFocusedFromContainer[el.focusableContainer] = el;
    }

    return el;
  }

  appendElement(el: FocusObject, setFocus: boolean, layer: string) {
    if (!this.elements[layer]) {
      this.elements[layer] = [];
    }

    if ((setFocus || this.elements[layer].length === 0) && this.activeLayer === layer) {
      this.active = el;
    }

    this.elements[layer].push(el);
  }

  removeElement(el: FocusObject, layer: string) {
    if (el.focusableContainer && this.lastFocusedFromContainer[el.focusableContainer] === el) {
      delete this.lastFocusedFromContainer[el.focusableContainer];
    }

    if (this.lastFocusedFromLayer[el.layer] === el) {
      delete this.lastFocusedFromLayer[el.layer];
    }

    const index = this.elements[layer].indexOf(el);
    this.elements[layer].splice(index, 1);

    if (this.elements[layer].length === 0) {
      delete this.elements[layer];
    }
  }

  remeasureAll(neededLayers: string[]) {
    const layers = Array.isArray(neededLayers) ? neededLayers : Object.keys(this.elements);

    layers.forEach(layerName => {
      this.elements[layerName].forEach((focusableElement, index) => {
        this.elements[layerName][index].positions = measure(focusableElement.el);
      });
    });
  }

  conditions(direction: Direction, active: FocusObject) {
    switch (direction) {
      case DIRECTION.RIGHT:
        return {
          all: (el: FocusObject) => active.positions.bottomRight.x < el.positions.topLeft.x,
          sameLine: (el: FocusObject) => active.positions.center.y === el.positions.center.y,
          idealAngle: 0,
        };
      case DIRECTION.LEFT:
        return {
          all: (el: FocusObject) => active.positions.topLeft.x > el.positions.bottomRight.x,
          sameLine: (el: FocusObject) => active.positions.center.y === el.positions.center.y,
          idealAngle: 180,
        };
      case DIRECTION.UP:
        return {
          all: (el: FocusObject) => active.positions.topLeft.y > el.positions.bottomRight.y,
          sameLine: (el: FocusObject) => active.positions.center.x === el.positions.center.x,
          idealAngle: -90,
        };
      case DIRECTION.DOWN:
        return {
          all: (el: FocusObject) => active.positions.bottomRight.y < el.positions.topLeft.y,
          sameLine: (el: FocusObject) => active.positions.center.x === el.positions.center.x,
          idealAngle: 90,
        };
    }
  }

  getNextElement(direction: Direction) {
    const { active, otherElements } = this;

    if (!active) return;

    if (typeof active.onDirectionKeyDown === 'function') {
      const continueHandlerExecution = active.onDirectionKeyDown(active, direction);

      if (!continueHandlerExecution) return;
    }

    // CHECK IF CURRENT ACTIVE HAS OVERWRITES
    const overwriteID = active.overwriteControl?.[direction];
    const nextEl = overwriteID ? this.getElementById(overwriteID) : false;

    if (overwriteID && nextEl) {
      this.active = nextEl;
      return;
    }

    const { all, sameLine } = this.conditions(direction, active);
    const sameLineCandidates = otherElements?.filter(el => all(el) && sameLine(el));
    const diffLineCandidates = otherElements?.filter(el => all(el));

    if (!sameLineCandidates || !diffLineCandidates) return;

    const candidates = sameLineCandidates.length > 0 && !active.closest ? sameLineCandidates : diffLineCandidates;

    if (candidates.length === 0) {
      if (direction === DIRECTION.RIGHT && active.overflowRightHandler) {
        // RIGHT OVERFLOW
        active.overflowRightHandler();
      }

      return;
    }

    const distances = candidates.map(el => Vector.getDistance(active.positions.center, el.positions.center));
    // const angles = candidates.map(el => Math.abs(idealAngle - Vector.getAngle(active.positions.center, el.positions.center)));
    // console.log('Dist: ', distances);
    // console.log('Angl: ', angles);
    const minIndex = distances.indexOf(Math.min(...distances));
    const closestEl = candidates[minIndex];

    this.active = closestEl;
  }

  getElementById(id: string) {
    if (!id) return;

    return this.allElements.find(el => el.id === id);
  }

  activeAction() {
    if (typeof this.active?.action === 'function') {
      this.active.action();
    }
  }

  isIdFocused(id: string) {
    return this.active?.id === id;
  }

  setActiveLayer(layerId = DEFAULT_LAYER_ID, options?: Partial<SetActiveLayerOptions>) {
    const config = Object.assign(
      {},
      {
        useLastFocused: false,
      },
      options
    );

    const layer = this.elements[layerId];

    if (!layer || this.activeLayer === layerId) return;

    this.activeLayer = layerId;

    const lastFocusedFromLayer = this.lastFocusedFromLayer[layerId];

    if (config.useLastFocused && lastFocusedFromLayer) {
      this.active = lastFocusedFromLayer;
      return;
    }

    const defaultFocused = layer.find(el => el.defaultFocused);
    this.active = defaultFocused || this.elements[layerId][0];
  }

  setFocusById(id: string, layer: string = DEFAULT_LAYER_ID) {
    const element = this.elements[layer].find(el => el.id === id);

    if (!element || this.active?.id === id) return;

    this.setActiveLayer(layer);

    this.active = element;
  }
}

export const focusStore = FocusStore.createStore();
