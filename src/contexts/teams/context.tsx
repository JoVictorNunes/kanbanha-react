import React from "react";
import type { Team } from "@/contexts/socket/context";

const TeamsContext = React.createContext<Array<Team>>([]);

export default TeamsContext;
