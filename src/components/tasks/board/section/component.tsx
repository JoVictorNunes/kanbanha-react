import React, { useMemo } from "react";
import { useTasks, useTeams } from "../../../../hooks";
import Header from "../header/component";
import List from "../list/component";
import Add from "../add/component";

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
      <List status={status} teamId={teamId} />
    </div>
  );
};

export default Section;
