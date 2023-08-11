import React from "react";
import type { Project } from "@/contexts/socket/context";

const ProjectsContext = React.createContext<Array<Project>>([]);

export default ProjectsContext;
