import React from "react";
import initial from "./initial";
import type { Action } from "./enums";

const context = React.createContext<{
  state: typeof initial;
  dispatch: React.Dispatch<Action> | null;
}>({
  state: initial,
  dispatch: null,
});

export default context;
