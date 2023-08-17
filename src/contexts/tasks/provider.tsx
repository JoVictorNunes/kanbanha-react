import React, { useEffect, useRef, useState } from "react";
import TaskContext from "./context";
import { useSocket } from "@/hooks";
import type { Task } from "@/contexts/socket/context";

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
    const onUpdate = (task: Task) => {
      const filteredTasks = tasks.filter((t) => t.id !== task.id);
      setTasks([...filteredTasks, task]);
    };
    const onDelete = (taskId: string) => {
      setTasks(tasks.filter((t) => t.id !== taskId))
    }
    socket.on("tasks:create", onCreate);
    socket.on("tasks:update", onUpdate);
    socket.on("tasks:delete", onDelete);
    return () => {
      socket.off("tasks:create", onCreate);
      socket.off("tasks:update", onUpdate);
      socket.off("tasks:delete", onDelete);
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
