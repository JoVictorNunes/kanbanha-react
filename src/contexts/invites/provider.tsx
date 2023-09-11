import React, { useEffect, useReducer, useRef } from 'react';
import InvitesContext from './context';
import { useSocket } from '@/hooks';
import { type Invite } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS, SERVER_TO_CLIENT_EVENTS } from '@/contexts/socket/enums';

interface Props {
  children: React.ReactNode;
}

const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

type State = Record<string, Invite>;

type Actions = {
  create: {
    type: typeof ACTIONS.CREATE;
    value: Invite;
  };
  update: {
    type: typeof ACTIONS.UPDATE;
    value: Invite;
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
    default: {
      return state;
    }
  }
};

const InvitesProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [invites, dispatch] = useReducer(reducer, {});
  const isInititalInvitesRead = useRef(false);

  useEffect(() => {
    const onCreate = (invite: Invite) => {
      dispatch({
        type: ACTIONS.CREATE,
        value: invite,
      });
    };
    const onUpdate = (invite: Invite) => {
      dispatch({
        type: ACTIONS.UPDATE,
        value: invite,
      });
    };
    socket.on(SERVER_TO_CLIENT_EVENTS.INVITES.CREATE, onCreate);
    socket.on(SERVER_TO_CLIENT_EVENTS.INVITES.UPDATE, onUpdate);
    return () => {
      socket.off(SERVER_TO_CLIENT_EVENTS.INVITES.CREATE, onCreate);
      socket.off(SERVER_TO_CLIENT_EVENTS.INVITES.UPDATE, onUpdate);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!connected || isInititalInvitesRead.current) return;
    socket.emit(CLIENT_TO_SERVER_EVENTS.INVITES.READ, (invites: Array<Invite>) => {
      invites.forEach((invite) => {
        dispatch({
          type: ACTIONS.CREATE,
          value: invite,
        });
      });
      isInititalInvitesRead.current = true;
    });
  }, [connected, socket]);

  return <InvitesContext.Provider value={invites}>{children}</InvitesContext.Provider>;
};

export default InvitesProvider;
