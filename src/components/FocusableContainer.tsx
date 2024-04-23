import { FC, ReactNode } from 'react';
import { FocusableContainerContext } from '../contexts';

interface FocusableContainerProps {
  name: string;
  children: ReactNode;
}

export const FocusableContainer: FC<FocusableContainerProps> = ({ name, children }) => {
  return <FocusableContainerContext.Provider value={name}>{children}</FocusableContainerContext.Provider>;
};
