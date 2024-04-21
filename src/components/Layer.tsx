import { FC, ReactNode, useEffect } from 'react';
import { LayerContext } from '../contexts';
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

  return <LayerContext.Provider value={name}>{children}</LayerContext.Provider>;
};
