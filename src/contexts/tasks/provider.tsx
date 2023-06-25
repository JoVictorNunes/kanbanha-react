import React, { useEffect, useState } from "react";
import TaskContext from "./context";
import { useSocket } from "../../hooks";
import { Task } from "../../types";

interface Props {
  children: React.ReactNode;
}

const TaskProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const socket = useSocket();
  const [tasks, setTasks] = useState<Array<Task>>([]);

  useEffect(() => {
    if (!socket) return;
    const onCreate = (task: Task) => {
      setTasks([...tasks, task]);
    };
    socket.on("task:create", onCreate);
    return () => {
      socket.off("task:create", onCreate);
    };
  }, [socket, tasks]);

  return <TaskContext.Provider value={tasks}>{children}</TaskContext.Provider>;
};

export default TaskProvider;
