import React, { useEffect, useReducer, useRef } from 'react';
import TaskContext from './context';
import { useSocket } from '@/hooks';
import type { Task, UUID } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS, SERVER_TO_CLIENT_EVENTS } from '../socket/enums';

interface Props {
  children: React.ReactNode;
}

const ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

type State = Record<string, Task>;

type Actions = {
  create: {
    type: typeof ACTIONS.CREATE;
    value: Task;
  };
  update: {
    type: typeof ACTIONS.UPDATE;
    value: Task;
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

const TasksProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [tasks, dispatch] = useReducer(reducer, {});
  const isInititalTasksRead = useRef(false);

  useEffect(() => {
    const onCreate = (task: Task) => {
      dispatch({
        type: ACTIONS.CREATE,
        value: task,
      });
    };
    const onUpdate = (task: Task) => {
      dispatch({
        type: ACTIONS.UPDATE,
        value: task,
      });
    };
    const onDelete = (taskId: string) => {
      dispatch({
        type: ACTIONS.DELETE,
        value: taskId,
      });
    };
    socket.on(SERVER_TO_CLIENT_EVENTS.TASKS.CREATE, onCreate);
    socket.on(SERVER_TO_CLIENT_EVENTS.TASKS.UPDATE, onUpdate);
    socket.on(SERVER_TO_CLIENT_EVENTS.TASKS.DELETE, onDelete);
    return () => {
      socket.off(SERVER_TO_CLIENT_EVENTS.TASKS.CREATE, onCreate);
      socket.off(SERVER_TO_CLIENT_EVENTS.TASKS.UPDATE, onUpdate);
      socket.off(SERVER_TO_CLIENT_EVENTS.TASKS.DELETE, onDelete);
    };
  }, [socket, tasks]);

  useEffect(() => {
    if (!connected || isInititalTasksRead.current) return;
    socket.emit(CLIENT_TO_SERVER_EVENTS.TASKS.READ, (tasks: Array<Task>) => {
      tasks.forEach((task) => {
        dispatch({
          type: ACTIONS.CREATE,
          value: task,
        });
      });
      isInititalTasksRead.current = true;
    });
  }, [connected, socket]);

  return <TaskContext.Provider value={tasks}>{children}</TaskContext.Provider>;
};

export default TasksProvider;
