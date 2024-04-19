import { FC, ReactNode } from 'react';
import { LayerContext } from '../contexts';

interface LayerProps {
  name: string;
  children: ReactNode;
}

export const Layer: FC<LayerProps> = ({ name, children }) => {
  return <LayerContext.Provider value={name}>{children}</LayerContext.Provider>;
};
