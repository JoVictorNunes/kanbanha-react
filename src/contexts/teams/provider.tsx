import React, { useEffect, useReducer, useRef } from 'react';
import TeamsContext from './context';
import { useSocket } from '@/hooks';
import type { Team, UUID } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS, SERVER_TO_CLIENT_EVENTS } from '@/contexts/socket/enums';

interface Props {
  children: React.ReactNode;
}

const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

type State = Record<string, Team>;

type Actions = {
  create: {
    type: typeof ACTIONS.CREATE;
    value: Team;
  };
  update: {
    type: typeof ACTIONS.UPDATE;
    value: Team;
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

const TeamsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [teams, dispatch] = useReducer(reducer, {});
  const isInititalTeamsRead = useRef(false);

  useEffect(() => {
    const onCreate = (team: Team) => {
      dispatch({
        type: ACTIONS.CREATE,
        value: team,
      });
    };
    const onUpdate = (team: Team) => {
      dispatch({
        type: ACTIONS.UPDATE,
        value: team,
      });
    };
    const onDelete = (teamId: string) => {
      dispatch({
        type: ACTIONS.DELETE,
        value: teamId,
      });
    };
    socket.on(SERVER_TO_CLIENT_EVENTS.TEAMS.CREATE, onCreate);
    socket.on(SERVER_TO_CLIENT_EVENTS.TEAMS.UPDATE, onUpdate);
    socket.on(SERVER_TO_CLIENT_EVENTS.TEAMS.DELETE, onDelete);
    return () => {
      socket.off(SERVER_TO_CLIENT_EVENTS.TEAMS.CREATE, onCreate);
      socket.off(SERVER_TO_CLIENT_EVENTS.TEAMS.UPDATE, onUpdate);
      socket.off(SERVER_TO_CLIENT_EVENTS.TEAMS.DELETE, onDelete);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!connected || isInititalTeamsRead.current) return;
    socket.emit(CLIENT_TO_SERVER_EVENTS.TEAMS.READ, (teams: Array<Team>) => {
      teams.forEach((team) => {
        dispatch({
          type: ACTIONS.CREATE,
          value: team,
        });
      });
      isInititalTeamsRead.current = true;
    });
  }, [connected, socket]);

  return <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>;
};

export default TeamsProvider;
