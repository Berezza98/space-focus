import { FC, ReactNode, useEffect, useMemo } from 'react';
import { LayerContext, LayerContextData } from '../contexts';
import { Direction } from '../consts';
import { useAddLayerHandler, useSetActiveLayer } from '../hooks';

interface LayerProps {
  name: string;
  layerHandler?: (direction: Direction) => any;
  setActive?: boolean;
  useLastFocused?: boolean;
  children: ReactNode;
}

export const Layer: FC<LayerProps> = ({ name, layerHandler, setActive, useLastFocused, children }) => {
  const addLayerHandler = useAddLayerHandler();
  const setActiveLayer = useSetActiveLayer();

  useEffect(() => {
    if (!layerHandler) return;

    addLayerHandler(name, layerHandler);
  }, [name, layerHandler]);

  useEffect(() => {
    if (!setActive) return;

    setActiveLayer(name, {
      useLastFocused,
    });
  }, [setActive, name, useLastFocused]);

  const contextData = useMemo<LayerContextData>(() => {
    return {
      layerId: name,
      setActive: setActive || false,
    };
  }, [name, setActive]);

  return <LayerContext.Provider value={contextData}>{children}</LayerContext.Provider>;
};
