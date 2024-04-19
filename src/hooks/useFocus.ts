import { useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { measure } from '../measure';
import { SetActiveLayerOptions, focusStore } from '../store';
import { DEFAULT_LAYER_ID } from '../consts';
import { FocusObject } from '../interfaces/FocusObject';

interface UseFocusValue {
  focused: boolean;
  setActiveLayer: (layerId: string, options: Partial<SetActiveLayerOptions>) => void;
  remeasureAll: (layers: string[]) => void;
  setFocusById: (id: string, layer: string) => void;
  isIdFocused: (id: string) => boolean;
}

interface UseFocusOptions {
  isFocused: boolean;
  focusable: boolean;
  saveLastFocused: boolean;
  action: FocusObject['action'];
  layer: FocusObject['layer'];
  closest: FocusObject['closest'];
  overflowRightHandler: FocusObject['overflowRightHandler'];
  onFocus: FocusObject['onFocus'];
  onBlur: FocusObject['onBlur'];
  onDirectionKeyDown: FocusObject['onDirectionKeyDown'];
  focusableContainer: FocusObject['focusableContainer'];
  overwriteControl: FocusObject['overwriteControl'];
  id: FocusObject['id'];
}

export const useFocus = (ref: React.RefObject<HTMLElement>, options: Partial<UseFocusOptions> = {}): UseFocusValue => {
  const {
    action,
    isFocused,
    layer = DEFAULT_LAYER_ID,
    overflowRightHandler,
    closest = false,
    onFocus,
    onBlur,
    onDirectionKeyDown,
    focusable = true,
    focusableContainer,
    saveLastFocused = true,
    overwriteControl,
    id,
  } = options;

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!ref || !focusable) return;

    const el = findDOMNode(ref.current) as HTMLElement;

    if (!el) return;

    const positions = measure(el);

    const focusObj: FocusObject = {
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

    focusStore.appendElement(focusObj, isFocused || false, layer);

    const mouseoverHandler = () => (focusStore.active = focusObj);
    const clickHandler = (e: MouseEvent) => {
      if (typeof action === 'function') {
        action();
      }

      e.stopPropagation();
    };

    el.addEventListener('mouseover', mouseoverHandler);
    el.addEventListener('click', clickHandler);

    return () => {
      focusStore.removeElement(focusObj, layer);
      el.removeEventListener('mouseover', mouseoverHandler);
      el.removeEventListener('click', clickHandler);
    };
  }, [
    ref,
    setFocused,
    action,
    focusable,
    layer,
    isFocused,
    overflowRightHandler,
    closest,
    onFocus,
    onBlur,
    onDirectionKeyDown,
    focusableContainer,
    saveLastFocused,
    overwriteControl,
    id,
  ]);

  return {
    focused,
    setActiveLayer: (layerId, options) => focusStore.setActiveLayer(layerId, options),
    remeasureAll: layers => focusStore.remeasureAll(layers),
    setFocusById: (id, layer) => focusStore.setFocusById(id, layer),
    isIdFocused: id => focusStore.isIdFocused(id),
  };
};
