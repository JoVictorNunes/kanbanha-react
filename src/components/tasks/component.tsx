import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { DragDropContext } from 'react-beautiful-dnd';
import { useSocket } from '@/hooks';
import Board from './board/component';
import { TaskStatuses } from '@/contexts/socket/context';

interface Props {
  teamId: string;
  availableHeight: number;
}

const Tasks: React.FC<Props> = (props) => {
  const { teamId, availableHeight } = props;
  const { socket, connected } = useSocket();

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!connected || !result.destination) return;

        const { draggableId, destination } = result;
        const taskId = draggableId;
        const status = destination.droppableId as TaskStatuses;

        socket.emit('tasks:move', { status, taskId, index: destination.index }, (res) => {
          console.log(res);
        });
      }}
    >
      <ScrollArea.Root
        style={{ height: availableHeight }}
        className="w-full rounded overflow-hidden bg-white"
      >
        <ScrollArea.Viewport className="w-full h-full rounded">
          <Board availableHeight={availableHeight} teamId={teamId} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-blackA8" />
      </ScrollArea.Root>
    </DragDropContext>
  );
};

export default Tasks;
