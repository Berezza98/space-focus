import React from 'react';
import { DEFAULT_LAYER_ID } from '../consts';

const defaultValue = {
  layerId: DEFAULT_LAYER_ID,
  setActive: false,
} as LayerContextData;

export type LayerContextData = {
  layerId: string;
  setActive: boolean;
};

export const LayerContext = React.createContext<LayerContextData>(defaultValue);
