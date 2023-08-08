import React, { useEffect, useRef, useState } from "react";
import ProjectsContext from "./context";
import { useSocket } from "../../hooks";
import { Project } from "@/types";

interface Props {
  children: React.ReactNode;
}

const ProjectsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [projects, setProjects] = useState<Array<Project>>([]);
  const isInititalProjectsRead = useRef(false);

  useEffect(() => {
    if (!connected || !socket) return;
    const onCreate = (project: Project) => {
      setProjects([...projects, project]);
    };
    const onDelete = (projectId: string) => {
      const projectsFiltered = projects.filter(
        (project) => project.id !== projectId
      );
      setProjects(projectsFiltered);
    };
    const onUpdate = (project: Project) => {
      const filteredProjects = projects.filter((p) => p.id !== project.id);
      setProjects([...filteredProjects, project]);
    };
    socket.on("projects:create", onCreate);
    socket.on("projects:delete", onDelete);
    socket.on("projects:update", onUpdate);
    return () => {
      socket.off("projects:create", onCreate);
      socket.off("projects:delete", onDelete);
      socket.off("projects:update", onUpdate);
    };
  }, [connected, socket, projects]);

  useEffect(() => {
    if (!connected || !socket || isInititalProjectsRead.current) return;
    socket.emit("projects:read", (projects: Array<Project>) => {
      setProjects(projects);
      isInititalProjectsRead.current = true;
    });
  }, [connected, socket]);

  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
