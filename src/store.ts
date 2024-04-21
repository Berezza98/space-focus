import { Vector } from './Vector';
import { DIRECTION, DEFAULT_LAYER_ID, Direction } from './consts';
import { ElementPosition, GetElementSizeFunction } from './interfaces';
import { FocusObject } from './interfaces/FocusObject';

export interface SetActiveLayerOptions {
  useLastFocused: boolean;
}

export interface FocusStoreOptions {
  getElementSizeFn: GetElementSizeFunction;
}

class FocusStore {
  elements: Record<string | number, FocusObject[]> = {};

  private _lastFocusedFromLayer: Record<string, FocusObject> = {};

  private _lastFocusedFromContainer: Record<string, FocusObject> = {};

  private _active: FocusObject | undefined;

  private _activeLayer: string = DEFAULT_LAYER_ID;

  private _getElementSizeFn: GetElementSizeFunction = (el: HTMLElement) => el.getBoundingClientRect();

  private _layerHandlers: Record<string, (direction: Direction) => any> = {};

  set getElementSizeFn(value: GetElementSizeFunction) {
    this._getElementSizeFn = value;
  }

  set active(el: FocusObject | undefined) {
    let elementToFocus = el;

    if (this.active) {
      this.active.setFocused(false);

      if (typeof this.active.onBlur === 'function') {
        this.active.onBlur(this.active);
      }
    }

    if (!elementToFocus) {
      this._active = elementToFocus;
      return;
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
    return this.elements[this.activeLayer]?.filter((el) => el !== this.active);
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

  configure(options: Partial<FocusStoreOptions>) {
    const { getElementSizeFn } = options;

    if (getElementSizeFn) this.getElementSizeFn = getElementSizeFn;
  }

  measure(el: HTMLElement): ElementPosition {
    const { left, top, width, height } = this._getElementSizeFn(el);
    const center = Vector.getCenterVector(left, top, width, height);
    const topLeft = new Vector(left, top);
    const bottomRight = new Vector(left + width, top + height);

    return {
      center,
      topLeft,
      bottomRight,
      height,
      width,
    };
  }

  private _handleFocusableContainers(el: FocusObject) {
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

  addLayerHandler(layerId: string, handler: (direction: Direction) => any) {
    this._layerHandlers[layerId] = handler;
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
    if (this.active === el) {
      this.active = undefined;
    }

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

    layers.forEach((layerName) => {
      this.elements[layerName].forEach((focusableElement, index) => {
        this.elements[layerName][index].positions = this.measure(focusableElement.el);
      });
    });
  }

  conditions(direction: Direction, active: FocusObject) {
    switch (direction) {
      case DIRECTION.RIGHT:
        return {
          all: (el: FocusObject) => active.positions.bottomRight.x <= el.positions.topLeft.x,
          sameLine: (el: FocusObject) => active.positions.center.y === el.positions.center.y,
          idealAngle: 0,
        };
      case DIRECTION.LEFT:
        return {
          all: (el: FocusObject) => active.positions.topLeft.x >= el.positions.bottomRight.x,
          sameLine: (el: FocusObject) => active.positions.center.y === el.positions.center.y,
          idealAngle: 180,
        };
      case DIRECTION.UP:
        return {
          all: (el: FocusObject) => active.positions.topLeft.y >= el.positions.bottomRight.y,
          sameLine: (el: FocusObject) => active.positions.center.x === el.positions.center.x,
          idealAngle: -90,
        };
      case DIRECTION.DOWN:
        return {
          all: (el: FocusObject) => active.positions.bottomRight.y <= el.positions.topLeft.y,
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
    const sameLineCandidates = otherElements?.filter((el) => all(el) && sameLine(el));
    const diffLineCandidates = otherElements?.filter((el) => all(el));

    if (!sameLineCandidates || !diffLineCandidates) return;

    const candidates = Array.from(
      new Set(active.closest ? [...diffLineCandidates] : [...sameLineCandidates, ...diffLineCandidates]),
    );

    if (candidates.length === 0) {
      // Handle Layer overflow handler
      if (this._layerHandlers[this.activeLayer]) this._layerHandlers[this.activeLayer](direction);

      if (direction === DIRECTION.RIGHT) {
        // RIGHT OVERFLOW
        active.overflowRightHandler?.();
      }

      if (direction === DIRECTION.LEFT) {
        // LEFT OVERFLOW
        active.overflowLeftHandler?.();
      }

      if (direction === DIRECTION.UP) {
        // UP OVERFLOW
        active.overflowUpHandler?.();
      }

      if (direction === DIRECTION.DOWN) {
        // RIGHT DOWN
        active.overflowDownHandler?.();
      }

      return;
    }

    const distances = candidates.map((el) => Vector.getDistance(active.positions.center, el.positions.center));
    // const angles = candidates.map(el => Math.abs(idealAngle - Vector.getAngle(active.positions.center, el.positions.center)));
    // console.log('Dist: ', distances);
    // console.log('Angl: ', angles);
    const minIndex = distances.indexOf(Math.min(...distances));
    const closestEl = candidates[minIndex];

    this.active = closestEl;
  }

  getElementById(id: string) {
    if (!id) return;

    return this.allElements.find((el) => el.id === id);
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
      options,
    );

    const layer = this.elements[layerId];

    if (!layer || this.activeLayer === layerId) return;

    this.activeLayer = layerId;

    const lastFocusedFromLayer = this.lastFocusedFromLayer[layerId];

    if (config.useLastFocused && lastFocusedFromLayer) {
      this.active = lastFocusedFromLayer;
      return;
    }

    const defaultFocused = layer.find((el) => el.defaultFocused);
    this.active = defaultFocused || this.elements[layerId][0];
  }

  setFocusById(id: string, layer: string = DEFAULT_LAYER_ID) {
    const element = this.elements[layer].find((el) => el.id === id);

    if (!element || this.active?.id === id) return;

    this.setActiveLayer(layer);

    this.active = element;
  }
}

export const focusStore = new FocusStore();

export type IFocusStore = FocusStore;
