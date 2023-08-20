import React, { useEffect, useReducer } from 'react';
import context from './contex';
import initial from './initial';
import { ACTIONS, type Action } from './enums';

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

const min = (a: number, b: number) => (a < b ? a : b);
const max = (a: number, b: number) => (a > b ? a : b);

const SIDEBAR_WIDTH = 78;
const MAX_PANEL_WIDTH = SIDEBAR_WIDTH * 4;
const MIN_PANEL_WIDTH = SIDEBAR_WIDTH * 3;
const PANEL_WIDTH_PERCENTAGE = 0.2;
const TOPBAR_HEIGHT_PERCENTAGE = 0.1;

const isMobile = (width: number) => width < 480;

const LayoutProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const calcBounds = () => {
      const width = window.document.documentElement.clientWidth;
      const height = window.document.documentElement.clientHeight;
      const mobile = isMobile(width);

      const sidebarWidth = SIDEBAR_WIDTH;
      const panelWidth = state.input.isPanelOpen
        ? mobile
          ? width - sidebarWidth
          : min(max(PANEL_WIDTH_PERCENTAGE * width, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH)
        : 0;
      const mainWidth = width - sidebarWidth - panelWidth;
      const topbarWidth = mainWidth;

      const sidebarHeight = height;
      const panelHeight = state.input.isPanelOpen ? height : 0;
      const topbarHeight = TOPBAR_HEIGHT_PERCENTAGE * height;
      const mainHeight = height - topbarHeight;

      dispatch({
        type: 'SET_MAIN',
        value: {
          height: mainHeight,
          left: sidebarWidth + panelWidth,
          top: topbarHeight,
          width: mainWidth,
        },
      });

      dispatch({
        type: 'SET_PANEL',
        value: {
          height: panelHeight,
          left: sidebarWidth,
          top: 0,
          width: panelWidth,
        },
      });

      dispatch({
        type: 'SET_SIDEBAR',
        value: {
          height: sidebarHeight,
          left: 0,
          top: 0,
          width: sidebarWidth,
        },
      });

      dispatch({
        type: 'SET_TOPBAR',
        value: {
          height: topbarHeight,
          left: sidebarWidth + panelWidth,
          top: 0,
          width: topbarWidth,
        },
      });
    };
    calcBounds();
    const onResize = () => {
      calcBounds();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [state.input.isPanelOpen]);

  return <context.Provider value={{ layout: state, dispatch }}>{children}</context.Provider>;
};

export default LayoutProvider;
