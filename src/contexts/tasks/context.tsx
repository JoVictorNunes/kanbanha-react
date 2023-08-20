import React from 'react';
import type { Task } from '@/contexts/socket/context';

const TaskContext = React.createContext<Array<Task>>([]);

export default TaskContext;
