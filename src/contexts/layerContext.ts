import React from 'react';
import { DEFAULT_LAYER_ID } from '../consts';

const defaultValue = DEFAULT_LAYER_ID as LayerContextData;

type LayerContextData = string;

export const LayerContext = React.createContext<LayerContextData>(defaultValue);
