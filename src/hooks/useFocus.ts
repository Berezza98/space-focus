import { useContext, useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { SetActiveLayerOptions, focusStore } from '../store';
import { FocusObject } from '../interfaces/FocusObject';
import { useSetActiveLayer } from './useSetActiveLayer';
import { LayerContext } from '../contexts';

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
  overflowLeftHandler: FocusObject['overflowLeftHandler'];
  overflowUpHandler: FocusObject['overflowUpHandler'];
  overflowDownHandler: FocusObject['overflowDownHandler'];
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
    layer,
    overflowRightHandler,
    overflowLeftHandler,
    overflowUpHandler,
    overflowDownHandler,
    closest = true,
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

  const layerFromContext = useContext(LayerContext);

  const setActiveLayer = useSetActiveLayer();

  useEffect(() => {
    if (!ref || !focusable) return;

    const el = findDOMNode(ref.current) as HTMLElement;

    if (!el) return;

    const positions = focusStore.measure(el);
    const selectedLayer = layer || layerFromContext;

    const focusObj: FocusObject = {
      layer: selectedLayer,
      defaultFocused: isFocused,
      positions,
      setFocused,
      action,
      overflowRightHandler,
      overflowLeftHandler,
      overflowUpHandler,
      overflowDownHandler,
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

    focusStore.appendElement(focusObj, isFocused || false, selectedLayer);

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
      focusStore.removeElement(focusObj, selectedLayer);
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
    overflowLeftHandler,
    overflowUpHandler,
    overflowDownHandler,
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
    setActiveLayer,
    remeasureAll: (layers) => focusStore.remeasureAll(layers),
    setFocusById: (id, layer) => focusStore.setFocusById(id, layer),
    isIdFocused: (id) => focusStore.isIdFocused(id),
  };
};
