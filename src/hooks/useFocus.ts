import { useContext, useEffect, useRef, useState } from 'react';
import { SetActiveLayerOptions, focusStore } from '../store';
import { FocusObject, FocusObjectConstructorOptions } from '../FocusObject';
import { useSetActiveLayer } from './useSetActiveLayer';
import { FocusableContainerContext, LayerContext } from '../contexts';

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
  action: FocusObjectConstructorOptions['action'];
  layer: FocusObjectConstructorOptions['layer'];
  closest: FocusObjectConstructorOptions['closest'];
  overflowRightHandler: FocusObjectConstructorOptions['overflowRightHandler'];
  overflowLeftHandler: FocusObjectConstructorOptions['overflowLeftHandler'];
  overflowUpHandler: FocusObjectConstructorOptions['overflowUpHandler'];
  overflowDownHandler: FocusObjectConstructorOptions['overflowDownHandler'];
  onFocus: FocusObjectConstructorOptions['onFocus'];
  onBlur: FocusObjectConstructorOptions['onBlur'];
  onDirectionKeyDown: FocusObjectConstructorOptions['onDirectionKeyDown'];
  focusableContainer: FocusObjectConstructorOptions['focusableContainer'];
  overwriteControl: FocusObjectConstructorOptions['overwriteControl'];
  id: FocusObjectConstructorOptions['id'];
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
  const currentFocusObjectRef = useRef<FocusObject | null>(null);

  const { layerId: layerFromContext, setActive: isActiveFromContext } = useContext(LayerContext);
  const focusableContainerFromContext = useContext(FocusableContainerContext);

  const setActiveLayer = useSetActiveLayer();

  useEffect(() => {
    if (!ref || !focusable) return;

    const el = ref.current;

    if (!el) return;

    const selectedLayer = layer || layerFromContext;
    const selectedFocusableContainer = focusableContainer || focusableContainerFromContext;

    const currentLayerIsSelected = focusStore.activeLayer === selectedLayer;
    const selectedIsFocused = !isFocused ? (currentLayerIsSelected ? false : isActiveFromContext) : isFocused;

    const focusObjOptions: FocusObjectConstructorOptions = {
      layer: selectedLayer,
      defaultFocused: selectedIsFocused,
      focusableContainer: selectedFocusableContainer,
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
      saveLastFocused,
      overwriteControl,
      id,
    };

    const focusObj = new FocusObject(focusObjOptions);
    currentFocusObjectRef.current = focusObj;

    focusStore.appendElement(focusObj);

    return () => {
      focusStore.removeElement(focusObj);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // UPDATE
    const el = ref.current;

    if (!el || !focusable) {
      if (currentFocusObjectRef.current) focusStore.removeElement(currentFocusObjectRef.current);

      return;
    }

    const selectedLayer = layer || layerFromContext;
    const selectedFocusableContainer = focusableContainer || focusableContainerFromContext;

    const currentLayerIsSelected = focusStore.activeLayer === selectedLayer;
    const selectedIsFocused = !isFocused ? (currentLayerIsSelected ? false : isActiveFromContext) : isFocused;

    const focusObjOptions: FocusObjectConstructorOptions = {
      layer: selectedLayer,
      defaultFocused: selectedIsFocused,
      focusableContainer: selectedFocusableContainer,
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
      saveLastFocused,
      overwriteControl,
      id,
    };

    if (currentFocusObjectRef.current) {
      currentFocusObjectRef.current.update(focusObjOptions);
    } else {
      const focusObj = new FocusObject(focusObjOptions);
      currentFocusObjectRef.current = focusObj;

      focusStore.appendElement(focusObj);
    }
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
    layerFromContext,
    focusableContainerFromContext,
    isActiveFromContext,
  ]);

  return {
    focused,
    setActiveLayer,
    remeasureAll: (layers) => focusStore.remeasureAll(layers),
    setFocusById: (id, layer) => focusStore.setFocusById(id, layer),
    isIdFocused: (id) => focusStore.isIdFocused(id),
  };
};
