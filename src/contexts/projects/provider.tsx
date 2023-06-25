import React, { useEffect, useRef, useState } from "react";
import ProjectsContext from "./context";
import { useSocket } from "../../hooks";
import { Project } from "@/types";

interface Props {
  children: React.ReactNode;
}

const ProjectsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const socket = useSocket();
  const [projects, setProjects] = useState<Array<Project>>([]);
  const isInititalProjectsRead = useRef(false);

  useEffect(() => {
    if (!socket) return;
    const onCreate = (project: Project) => {
      setProjects([...projects, project]);
    };
    socket.on("projects:create", onCreate);
    return () => {
      socket.off("projects:create", onCreate);
    };
  }, [socket, projects]);

  useEffect(() => {
    if (!socket || isInititalProjectsRead.current) return;
    socket.emit("projects:read", (p: Array<Project>) => {
      setProjects(p);
      isInititalProjectsRead.current = true;
    });
  }, [socket]);

  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
