import { useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import measure from '../measure';
import focusStore from '../store';
import { DEFAULT_LAYER_ID } from '../consts';

const useFocus = (ref, options = {}) => {
  const {
    action, isFocused, layer = DEFAULT_LAYER_ID,
    overflowRightHandler, closest = false, onFocus,
    onBlur, onDirectionKeyDown, focusable = true,
    focusableContainer, saveLastFocused = true,
    overwriteControl, id,
  } = options;

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref || !focusable) {
      return;
    }

    const el = findDOMNode(ref.current);
    const positions = measure(el);

    const focusObj = {
      layer,
      defaultFocused: isFocused,
      positions,
      setFocused,
      action,
      overflowRightHandler,
      closest,
      onFocus,
      onBlur,
      onDirectionKeyDown,
      el,
      focusableContainer,
      saveLastFocused,
      overwriteControl,
      id,
    };
    
    focusStore.appendElement(focusObj, isFocused, layer);
    
    const mouseoverHandler = () => focusStore.active = focusObj;
    const clickHandler = (e) => {
      if (typeof action === 'function') {
        action();
      }

      e.stopPropagation();
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
    setActiveLayer: (layerId, options) => focusStore.setActiveLayer(layerId, options),
    remeasureAll: (layers) => focusStore.remeasureAll(layers),
    setFocusById: (id, layer) => focusStore.setFocusById(id, layer),
    isIdFocused: id => focusStore.isIdFocused(id),
  };
}

export default useFocus;