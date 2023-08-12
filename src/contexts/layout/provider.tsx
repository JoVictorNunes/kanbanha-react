import React, { useEffect, useReducer } from "react";
import context from "./contex";
import initial from "./initial";
import { ACTIONS, type Action } from "./enums";

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
    case ACTIONS.SET_MOUSE: {
      return {
        ...state,
        input: {
          ...state.input,
          mouse: action.value,
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

const LayoutProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const calcBounds = () => {
      const width = window.document.documentElement.clientWidth;
      const height = window.document.documentElement.clientHeight;

      const sidebarWidth = 78;
      const panelWidth = state.input.isPanelOpen ? min(max(0.2 * width, 3 * sidebarWidth), 4 * sidebarWidth) : 0;
      const mainWidth = width - sidebarWidth - panelWidth;
      const topbarWidth = mainWidth;

      const sidebarHeight = height;
      const panelHeight = state.input.isPanelOpen ? height : 0;
      const topbarHeight = 0.1 * height;
      const mainHeight = height - topbarHeight;

      dispatch({
        type: "SET_MAIN",
        value: {
          height: mainHeight,
          left: sidebarWidth + panelWidth,
          top: topbarHeight,
          width: mainWidth,
        },
      });

      dispatch({
        type: "SET_PANEL",
        value: {
          height: panelHeight,
          left: sidebarWidth,
          top: 0,
          width: panelWidth,
        },
      });

      dispatch({
        type: "SET_SIDEBAR",
        value: {
          height: sidebarHeight,
          left: 0,
          top: 0,
          width: sidebarWidth,
        },
      });

      dispatch({
        type: "SET_TOPBAR",
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
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", function (e) {
      dispatch({
        type: "SET_MOUSE",
        value: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    });
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [state.input.isPanelOpen]);

  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
};

export default LayoutProvider;
