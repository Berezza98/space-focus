import { useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import Vector from '../Vector';
import focusStore from '../store';
import { DEFAULT_LAYER_ID } from '../consts';

const useFocus = (ref, options = {}) => {
  const {
    action, isFocused, layer = DEFAULT_LAYER_ID,
    overflowRightHandler, closest = false, onFocus,
    onBlur, focusable = true, focusableContainer,
    saveLastFocused = true,
  } = options;

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref || !focusable) {
      return;
    }

    const el = findDOMNode(ref.current);
    const { left, top, width, height } = el.getBoundingClientRect();
    const center = Vector.getCenterVector(left, top, width, height);
    const topLeft = new Vector(left, top);
    const bottomRight = new Vector(left + width, top + height);

    const focusObj = {
      layer,
      defaultFocused: isFocused,
      positions: {
        center,
        topLeft,
        bottomRight,
        height,
        width,
      },
      setFocused,
      action,
      overflowRightHandler,
      closest,
      onFocus,
      onBlur,
      el,
      focusableContainer,
      saveLastFocused,
    };
    
    focusStore.appendElement(focusObj, isFocused, layer);
    
    const mouseoverHandler = () => focusStore.active = focusObj;
    const clickHandler = () => {
      if (typeof action === 'function') {
        action();
      }
    }

    el.addEventListener('mouseover', mouseoverHandler);
    el.addEventListener('click', clickHandler);

    return () => {
      focusStore.removeElement(focusObj, layer);
      el.removeEventListener('mouseover', mouseoverHandler);
      el.removeEventListener('click', clickHandler);
    }
  }, [ref, setFocused, action]);

  return {
    focused,
    setActiveLayer: (layerId, options) => {
      focusStore.setActiveLayer(layerId, options);
    }
  };
}

export default useFocus;