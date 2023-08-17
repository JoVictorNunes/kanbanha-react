import React, { useMemo } from "react";
import { Droppable } from "react-beautiful-dnd";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useTasks, useTeams } from "../../../../hooks";
import Header from "../header/component";
import Add from "../add/component";
import Task from "../task/component";

interface Props {
  teamId: string;
  status: "active" | "ongoing" | "review" | "finished";
  availableHeight: number;
}

const Section: React.FC<Props> = (props) => {
  const { teamId, status, availableHeight } = props;

  // Data
  const teams = useTeams();
  const tasks = useTasks();

  const team = useMemo(
    () => teams.find((t) => t.id === teamId),
    [teams, teamId]
  );
  const teamTasks = useMemo(
    () => tasks.filter((t) => t.teamId === teamId),
    [tasks, teamId]
  );
  const tasksFiltered = useMemo(
    () => teamTasks.filter((t) => t.status === status),
    [teamTasks, status]
  );

  if (!team) return null;

  return (
    <div
      className={`rounded flex flex-col gap-2`}
      style={{ height: availableHeight }}
    >
      <Header status={status} quantity={tasksFiltered.length} />
      <Add status={status} teamId={teamId} />
      <Droppable droppableId={status}>
        {(provided) => (
          <ScrollArea.Root
            className={`w-full h-full rounded overflow-hidden border-2 border-dashed border-transparent`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <ScrollArea.Viewport className={`w-full h-full`}>
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
              className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="horizontal"
            >
              <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-blackA8" />
          </ScrollArea.Root>
        )}
      </Droppable>
    </div>
  );
};

export default Section;
