import { FC, ReactNode, useEffect } from 'react';
import { LayerContext } from '../contexts';
import { useAddLayerHandler } from '../hooks/useAddLayerHandler';
import { Direction } from '../consts';

interface LayerProps {
  name: string;
  layerHandler?: (direction: Direction) => any;
  children: ReactNode;
}

export const Layer: FC<LayerProps> = ({ name, layerHandler, children }) => {
  const addLayerHandler = useAddLayerHandler();

  useEffect(() => {
    if (!layerHandler) return;

    addLayerHandler(name, layerHandler);
  }, []);

  return <LayerContext.Provider value={name}>{children}</LayerContext.Provider>;
};
