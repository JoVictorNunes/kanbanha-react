import React, { useEffect, useReducer, useRef } from 'react';
import ProjectsContext from './context';
import { useSocket } from '@/hooks';
import type { Project, UUID } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS, SERVER_TO_CLIENT_EVENTS } from '../socket/enums';

interface Props {
  children: React.ReactNode;
}

const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

type State = Record<string, Project>;

type Actions = {
  create: {
    type: typeof ACTIONS.CREATE;
    value: Project;
  };
  update: {
    type: typeof ACTIONS.UPDATE;
    value: Project;
  };
  delete: {
    type: typeof ACTIONS.DELETE;
    value: UUID;
  };
};

type Action = Actions[keyof Actions];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.CREATE: {
      return {
        ...state,
        [action.value.id]: action.value,
      };
    }
    case ACTIONS.UPDATE: {
      return {
        ...state,
        [action.value.id]: action.value,
      };
    }
    case ACTIONS.DELETE: {
      delete state[action.value];
      return { ...state };
    }
    default: {
      return state;
    }
  }
};

const ProjectsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [projects, dispatch] = useReducer(reducer, {});
  const isInititalProjectsRead = useRef(false);

  useEffect(() => {
    const onCreate = (project: Project) => {
      dispatch({
        type: ACTIONS.CREATE,
        value: project,
      });
    };
    const onDelete = (projectId: string) => {
      dispatch({
        type: ACTIONS.DELETE,
        value: projectId,
      });
    };
    const onUpdate = (project: Project) => {
      dispatch({
        type: ACTIONS.UPDATE,
        value: project,
      });
    };
    socket.on(SERVER_TO_CLIENT_EVENTS.PROJECTS.CREATE, onCreate);
    socket.on(SERVER_TO_CLIENT_EVENTS.PROJECTS.DELETE, onDelete);
    socket.on(SERVER_TO_CLIENT_EVENTS.PROJECTS.UPDATE, onUpdate);
    return () => {
      socket.off(SERVER_TO_CLIENT_EVENTS.PROJECTS.CREATE, onCreate);
      socket.off(SERVER_TO_CLIENT_EVENTS.PROJECTS.DELETE, onDelete);
      socket.off(SERVER_TO_CLIENT_EVENTS.PROJECTS.UPDATE, onUpdate);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!connected || isInititalProjectsRead.current) return;
    socket.emit(CLIENT_TO_SERVER_EVENTS.PROJECTS.READ, (projects: Array<Project>) => {
      projects.forEach((project) => {
        dispatch({
          type: ACTIONS.CREATE,
          value: project,
        });
      });
      isInititalProjectsRead.current = true;
    });
  }, [connected, socket]);

  return <ProjectsContext.Provider value={projects}>{children}</ProjectsContext.Provider>;
};

export default ProjectsProvider;
