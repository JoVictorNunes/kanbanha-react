import React, { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useTasks } from "../../../../hooks";
import Task from "../task/component";
import type { TaskStatuses, UUID } from "@/contexts/socket/context";

interface Props {
  status: TaskStatuses;
  teamId: UUID;
}

const List: React.FC<Props> = (props) => {
  const { status, teamId } = props;

  // Data
  const tasks = useTasks();
  const teamTasks = useMemo(
    () => tasks.filter((t) => t.teamId === teamId),
    [tasks, teamId]
  );
  const tasksFiltered = useMemo(
    () => teamTasks.filter((t) => t.status === status),
    [teamTasks, status]
  );

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <ScrollArea.Root
          className={`w-full h-full rounded overflow-hidden border-2 border-dashed border-transparent`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <ScrollArea.Viewport className={`w-full h-full flex flex-col gap-4`}>
            {tasksFiltered.map((t, index) => (
              <Task key={t.id} task={t} index={index} />
            ))}
            {provided.placeholder}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="horizontal"
          >
            <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="bg-blackA8" />
        </ScrollArea.Root>
      )}
    </Droppable>
  );
};

export default List;
