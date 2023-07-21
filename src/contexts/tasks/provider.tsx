import React, { useEffect, useRef, useState } from "react";
import TaskContext from "./context";
import { useSocket } from "../../hooks";
import { Task } from "../../types";

interface Props {
  children: React.ReactNode;
}

const TasksProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const isInititalTasksRead = useRef(false);

  useEffect(() => {
    if (!connected || !socket) return;
    const onCreate = (task: Task) => {
      setTasks([...tasks, task]);
    };
    socket.on("tasks:create", onCreate);
    return () => {
      socket.off("tasks:create", onCreate);
    };
  }, [connected, socket, tasks]);

  useEffect(() => {
    if (!connected || !socket || isInititalTasksRead.current) return;
    socket.emit("tasks:read", (tasks: Array<Task>) => {
      setTasks(tasks);
      isInititalTasksRead.current = true;
    });
  }, [connected, socket]);

  return <TaskContext.Provider value={tasks}>{children}</TaskContext.Provider>;
};

export default TasksProvider;
