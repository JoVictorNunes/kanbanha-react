import React from 'react';
import initial from './initial';
import type { Action } from './enums';

const context = React.createContext<{
  layout: typeof initial;
  dispatch: React.Dispatch<Action>;
}>({
  layout: initial,
  dispatch: () => {
    return;
  },
});

export default context;
