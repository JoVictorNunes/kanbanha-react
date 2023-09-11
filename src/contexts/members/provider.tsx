import React, { useEffect, useReducer, useRef } from 'react';
import MemberContext from './context';
import { useSocket } from '@/hooks';
import type { Member, UUID } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS, SERVER_TO_CLIENT_EVENTS } from '../socket/enums';

interface Props {
  children: React.ReactNode;
}

const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MEMBER_CONNECTED: 'member_connected',
  MEMBER_DISCONNECTED: 'member_disconnected',
} as const;

type State = Record<string, Member>;

type Actions = {
  create: {
    type: typeof ACTIONS.CREATE;
    value: Member;
  };
  update: {
    type: typeof ACTIONS.UPDATE;
    value: Member;
  };
  delete: {
    type: typeof ACTIONS.DELETE;
    value: UUID;
  };
  member_connected: {
    type: typeof ACTIONS.MEMBER_CONNECTED;
    value: UUID;
  };
  member_disconnected: {
    type: typeof ACTIONS.MEMBER_DISCONNECTED;
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
    case ACTIONS.MEMBER_CONNECTED: {
      const member = state[action.value];
      if (!member) return state;
      member.online = true;
      return { ...state };
    }
    case ACTIONS.MEMBER_DISCONNECTED: {
      const member = state[action.value];
      if (!member) return state;
      member.online = false;
      return { ...state };
    }
    default: {
      return state;
    }
  }
};

const MembersProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [members, dispatch] = useReducer(reducer, {});
  const isInititalMembersRead = useRef(false);

  useEffect(() => {
    const onCreate = (member: Member) => {
      dispatch({
        type: ACTIONS.CREATE,
        value: member,
      });
    };
    const onUpdate = (member: Member) => {
      dispatch({
        type: ACTIONS.UPDATE,
        value: member,
      });
    };
    const onDelete = (memberId: string) => {
      dispatch({
        type: ACTIONS.DELETE,
        value: memberId,
      });
    };
    const onDisconnected = (memberId: string) => {
      dispatch({
        type: ACTIONS.MEMBER_DISCONNECTED,
        value: memberId,
      });
    };
    const onConnected = (memberId: string) => {
      dispatch({
        type: ACTIONS.MEMBER_CONNECTED,
        value: memberId,
      });
    };
    socket.on(SERVER_TO_CLIENT_EVENTS.MEMBERS.CREATE, onCreate);
    socket.on(SERVER_TO_CLIENT_EVENTS.MEMBERS.UPDATE, onUpdate);
    socket.on(SERVER_TO_CLIENT_EVENTS.MEMBERS.DELETE, onDelete);
    socket.on(SERVER_TO_CLIENT_EVENTS.MEMBERS.CONNECTED, onConnected);
    socket.on(SERVER_TO_CLIENT_EVENTS.MEMBERS.DISCONNECTED, onDisconnected);
    return () => {
      socket.off(SERVER_TO_CLIENT_EVENTS.MEMBERS.CREATE, onCreate);
      socket.off(SERVER_TO_CLIENT_EVENTS.MEMBERS.UPDATE, onUpdate);
      socket.off(SERVER_TO_CLIENT_EVENTS.MEMBERS.DELETE, onDelete);
      socket.off(SERVER_TO_CLIENT_EVENTS.MEMBERS.CONNECTED, onConnected);
      socket.off(SERVER_TO_CLIENT_EVENTS.MEMBERS.DISCONNECTED, onDisconnected);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!connected || isInititalMembersRead.current) return;
    socket.emit(CLIENT_TO_SERVER_EVENTS.MEMBERS.READ, (members: Array<Member>) => {
      members.forEach((member) => {
        dispatch({
          type: ACTIONS.CREATE,
          value: member,
        });
      });
      isInititalMembersRead.current = true;
    });
  }, [connected, socket]);

  return <MemberContext.Provider value={members}>{children}</MemberContext.Provider>;
};

export default MembersProvider;
