import React from 'react';
import type { Task } from '@/contexts/socket/context';

const TaskContext = React.createContext<Record<string, Task>>({});

export default TaskContext;
