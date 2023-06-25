import React from "react";
import { Team } from "@/types";

const TeamsContext = React.createContext<Array<Team>>([]);

export default TeamsContext;
