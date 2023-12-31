import React from 'react';
import type { Project } from '@/contexts/socket/context';

const ProjectsContext = React.createContext<Record<string, Project | null>>({});

export default ProjectsContext;
