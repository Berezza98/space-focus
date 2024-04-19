import { useCallback } from 'react';
import { SetActiveLayerOptions, focusStore } from '../store';

export const useSetActiveLayer = () => {
  const setActiveLayer = useCallback((layerId: string, options: Partial<SetActiveLayerOptions>) => {
    focusStore.setActiveLayer(layerId, options);
  }, []);

  return setActiveLayer;
};
