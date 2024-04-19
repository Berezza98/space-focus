import { useCallback } from 'react';
import { focusStore } from '../store';
import { Direction } from '../consts';

export const useAddLayerHandler = () => {
  const addLayerHandler = useCallback((layerId: string, handler: (direction: Direction) => any) => {
    focusStore.addLayerHandler(layerId, handler);
  }, []);

  return addLayerHandler;
};
