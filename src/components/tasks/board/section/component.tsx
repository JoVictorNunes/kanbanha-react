import React, { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useTasks, useTeams } from '@/hooks';
import Header from '@/components/tasks/board/header/component';
import Add from '@/components/tasks/board/add/component';
import Task from '@/components/tasks/board/task/component';
import Scroll from '@/components/scroll/component';

interface Props {
  teamId: string;
  status: 'active' | 'ongoing' | 'review' | 'finished';
  availableHeight: number;
}

const Section: React.FC<Props> = (props) => {
  const { teamId, status, availableHeight } = props;

  // Data
  const teams = useTeams();
  const tasks = useTasks();

  const team = useMemo(() => teams.find((t) => t.id === teamId), [teams, teamId]);
  const teamTasks = useMemo(() => tasks.filter((t) => t.teamId === teamId), [tasks, teamId]);
  const tasksFiltered = useMemo(
    () => teamTasks.filter((t) => t.status === status).sort((a, b) => a.index - b.index),
    [teamTasks, status]
  );

  if (!team) return null;

  return (
    <div className={`rounded flex flex-col gap-2`} style={{ height: availableHeight }}>
      <Header status={status} quantity={tasksFiltered.length} />
      <Add status={status} teamId={teamId} />
      <Droppable droppableId={status}>
        {(provided) => (
          <Scroll innerRef={provided.innerRef} {...provided.droppableProps}>
            {tasksFiltered.map((t, index) => (
              <Task key={t.id} task={t} index={index} />
            ))}
            {provided.placeholder}
          </Scroll>
        )}
      </Droppable>
    </div>
  );
};

export default Section;
