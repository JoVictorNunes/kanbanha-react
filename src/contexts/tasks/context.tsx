import React from "react";
import { Task } from "../../types";

const TaskContext = React.createContext<Array<Task>>([]);

export default TaskContext;
