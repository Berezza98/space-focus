import Vector from './Vector';
import { DIRECTION, LAYERS, KEYS } from './consts';
import addHandlers from './handlers';

const { DEFAULT_LAYER_ID } = LAYERS;

export class FocusStore {
  elements = [];
  _active = null;
  _activeLayer = DEFAULT_LAYER_ID;
  
  set active(el) {
    this?._active?.setFocused(false);
    
    this._active = el;
    el.setFocused(true);
  }

  get active() {
    return this._active;
  }

  set activeLayer(layerId = DEFAULT_LAYER_ID) {
    this._activeLayer = layerId;

    const layer = this.elements[layerId];

    if (layer) {
      const defaultFocused = layer.find(el => el.defaultFocused);
      this.active = defaultFocused || this.elements[layerId][0];
    }
  }

  get activeLayer() {
    return this._activeLayer;
  }

  get otherElements() {
    return this.elements[this.activeLayer].filter(el => el !== this.active);
  }

  static instance = null;

  static createStore() {
    if (!FocusStore.instance) {
      FocusStore.instance = new FocusStore();
    }

    return FocusStore.instance;
  }

  static addHandlers(keys) {
    const mergedKeys = Object.assign({}, KEYS, keys);
    addHandlers(mergedKeys);
  }

  appendElement(el, setFocus, layer = DEFAULT_LAYER_ID) {
    if (!this.elements[layer]) {
      this.elements[layer] = [];
    }

    if ((setFocus || this.elements[layer].length === 0) && this.activeLayer === layer) {
      this.active = el;
    }

    this.elements[layer].push(el);
  }

  removeElement(el, layer = DEFAULT_LAYER_ID) {
    const index = this.elements[layer].indexOf(el);
    this.elements[layer].splice(index, 1);

    if (this.elements[layer].length === 0) {
      delete this.elements[layer];
    }
  }

  conditions(direction) {
    const { active } = this;

    switch (direction) {
      case DIRECTION.RIGHT:
        return {
          all: el => active.positions.bottomRight.x < el.positions.topLeft.x,
          sameLine: el => active.positions.center.y === el.positions.center.y,
          idealAngle: 0
        }
      case DIRECTION.LEFT:
        return {
          all: el => active.positions.topLeft.x > el.positions.bottomRight.x,
          sameLine: el => active.positions.center.y === el.positions.center.y,
          idealAngle: 180
        }
      case DIRECTION.UP:
        return {
          all: el => active.positions.topLeft.y > el.positions.bottomRight.y,
          sameLine: el => active.positions.center.x === el.positions.center.x,
          idealAngle: -90
        }
      case DIRECTION.DOWN:
        return {
          all: el => active.positions.bottomRight.y < el.positions.topLeft.y,
          sameLine: el => active.positions.center.x === el.positions.center.x,
          idealAngle: 90
        }
      default:
        return null;
    }
  }

  getNextElement(direction) {
    const { active, otherElements } = this;
    const { all, sameLine, idealAngle } = this.conditions(direction);
    const sameLineCandidates = otherElements.filter(el => all(el) && sameLine(el));
    const diffLineCandidates = otherElements.filter(el => all(el));
    const candidates = sameLineCandidates.length > 0 ? sameLineCandidates : diffLineCandidates;
    
    if (candidates.length === 0) {
      if (direction === DIRECTION.RIGHT && this.active.overflowRightHandler) { // RIGHT OVERFLOW
        this.active.overflowRightHandler();
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

  activeAction() {
    this.active.action();
  }
}

export default FocusStore.createStore();