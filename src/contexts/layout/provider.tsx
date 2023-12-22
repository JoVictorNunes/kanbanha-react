import React, { useReducer } from 'react';
import context from './context';
import initial from './initial';
import { ACTIONS, type Action } from './enums';
import CleanLayoutEngine from './cleanLayout';
import DefaultLayoutEngine from './defaultLayout';

interface Props {
  children: React.ReactNode;
}

const reducer = (state: typeof initial, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_SIDEBAR: {
      return {
        ...state,
        sidebar: {
          ...action.value,
        },
      };
    }
    case ACTIONS.SET_BROWSER: {
      return {
        ...state,
        input: {
          ...state.input,
          browser: {
            ...action.value,
          },
        },
      };
    }
    case ACTIONS.SET_MAIN: {
      return {
        ...state,
        main: {
          ...action.value,
        },
      };
    }
    case ACTIONS.SET_PANEL: {
      return {
        ...state,
        panel: {
          ...action.value,
        },
      };
    }
    case ACTIONS.SET_PANEL_IS_OPEN: {
      return {
        ...state,
        input: {
          ...state.input,
          isPanelOpen: action.value,
        },
      };
    }
    case ACTIONS.SET_TOPBAR: {
      return {
        ...state,
        topbar: {
          ...action.value,
        },
      };
    }
    default: {
      return state;
    }
  }
};

const LayoutProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initial);

  const layouts = {
    "defaultLayout": DefaultLayoutEngine,
    "cleanLayout": CleanLayoutEngine
  }
  const currentLayout = "defaultLayout"
  const SelectedLayout = layouts[currentLayout]

  return (
    <context.Provider value={{ layout: state, dispatch }}>
      <SelectedLayout />
      {children}
    </context.Provider>
  );
};

export default LayoutProvider;
