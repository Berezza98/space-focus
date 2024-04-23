import React from 'react';

const defaultValue = undefined;

type FocusableContainerContextData = string | undefined;

export const FocusableContainerContext = React.createContext<FocusableContainerContextData>(defaultValue);
