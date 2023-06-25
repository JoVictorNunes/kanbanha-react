import React from "react";
import { useTasks } from "../../hooks/useTasks";
import { TASK_STATUSES } from "../../utils/enums";
import classes from "./styles.module.css";

const Active: React.FC = () => {
  const tasks = useTasks();
  const active = tasks.filter((task) => task.status === TASK_STATUSES.ACTIVE);

  return (
    <div className={classes.container}>
      {active.map((task) => {
        return (
          <div key={task.id} className={classes.task}>
            <div>{new Date(task.date).toLocaleDateString()}</div>
            <div>{task.description}</div>
            <div>Criada em: {new Date(task.createdAt).toLocaleString()}</div>
            <div>
              Previsão de término:{" "}
              {new Date(task.predictedDate).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Active;
