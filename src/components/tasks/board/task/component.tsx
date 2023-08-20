import React, { useMemo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useMembers, useSocket } from '@/hooks';
import Dropdown from '@/components/dropdown/component';
import type { Member, Task } from '@/contexts/socket/context';

interface Props {
  task: Task;
  index: number;
}

const Task: React.FC<Props> = (props) => {
  const { task, index } = props;

  // Data
  const members = useMembers();
  const { socket, connected } = useSocket();

  const assignees = useMemo(() => {
    const assignees: Member[] = [];
    task.assignees.forEach((assigneeId) => {
      const assignee = members.find((member) => member.id === assigneeId);
      if (assignee) {
        assignees.push(assignee);
      }
    });
    return assignees;
  }, [task, members]);

  const options = [
    {
      label: 'Delete',
      onSelect: () => {
        if (!connected) return;
        socket.emit('tasks:delete', task.id, (res) => console.log(res));
      },
      disabled: !connected,
    },
    {
      label: 'Edit',
      onSelect: () => {
        console.log('Edit');
      },
    },
  ];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={`border-[1px] border-gray-200 rounded p-2 bg-white mb-2`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="flex justify-end">
            <Dropdown options={options} />
          </div>
          <div>Title</div>
          <div className="text-sm text-gray-500 h-[42px] overflow-hidden whitespace-nowrap text-ellipsis leading-none">
            {task.description}
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex">
              <div>Created at:</div>&nbsp;
              <div>{new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex">
              <div>Date:</div>&nbsp;
              <div>{new Date(task.date).toLocaleDateString()}</div>
            </div>
            <div className="flex">
              <div>Due:</div>&nbsp;
              <div>{new Date(task.dueDate).toLocaleDateString()}</div>
            </div>
            {['ongoing', 'review', 'finished'].includes(task.status) && (
              <div className="flex">
                <div>In development at:</div>&nbsp;
                <div>{new Date(task.inDevelopmentAt!).toLocaleDateString()}</div>
              </div>
            )}
            {['review', 'finished'].includes(task.status) && (
              <div className="flex">
                <div>In review at:</div>&nbsp;
                <div>{new Date(task.inReviewAt!).toLocaleDateString()}</div>
              </div>
            )}
            {['finished'].includes(task.status) && (
              <div className="flex">
                <div>Finished at:</div>&nbsp;
                <div>{new Date(task.finishedAt!).toLocaleDateString()}</div>
              </div>
            )}
          </div>
          <div className="flex pt-4">
            {assignees.map((assignee, index) => (
              <div
                key={assignee?.id}
                className={`h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white border-[1px] border-white ${
                  index > 0 ? '-translate-x-2' : ''
                }`}
              >
                <div className="leading-none">{assignee?.name.substring(0, 2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
