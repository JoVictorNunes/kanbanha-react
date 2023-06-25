import React from "react";
import { Project } from "@/types";

const ProjectsContext = React.createContext<Array<Project>>([]);

export default ProjectsContext;
