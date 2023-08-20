export const ACTIONS = {
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_PANEL: 'SET_PANEL',
  SET_TOPBAR: 'SET_TOPBAR',
  SET_MAIN: 'SET_MAIN',
  SET_BROWSER: 'SET_BROWSER',
  SET_PANEL_IS_OPEN: 'SET_PANEL_IS_OPEN',
} as const;

type ActionValues = {
  SET_SIDEBAR: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  SET_PANEL: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  SET_TOPBAR: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  SET_MAIN: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  SET_BROWSER: {
    width: number;
    height: number;
  };
  SET_PANEL_IS_OPEN: boolean;
};

export type Action = {
  [K in keyof ActionValues]: {
    type: K;
    value: ActionValues[K];
  };
}[keyof ActionValues];
