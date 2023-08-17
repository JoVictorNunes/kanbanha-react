import React, { useEffect, useRef, useState } from "react";
import TeamsContext from "./context";
import { useSocket } from "@/hooks";
import type { Team } from "@/contexts/socket/context";

interface Props {
  children: React.ReactNode;
}

const TeamsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [teams, setTeams] = useState<Array<Team>>([]);
  const isInititalTeamsRead = useRef(false);

  useEffect(() => {
    if (!connected || !socket) return;
    const onCreate = (team: Team) => {
      setTeams([...teams, team]);
    };
    const onUpdate = (team: Team) => {
      const filteredTeams = teams.filter((t) => t.id !== team.id);
      setTeams([...filteredTeams, team]);
    };
    const onDelete = (teamId: string) => {
      setTeams(teams.filter((t) => t.id !== teamId));
    };
    socket.on("teams:create", onCreate);
    socket.on("teams:update", onUpdate);
    socket.on("teams:delete", onDelete);
    return () => {
      socket.off("teams:create", onCreate);
      socket.off("teams:update", onUpdate);
      socket.off("teams:delete", onDelete);
    };
  }, [connected, socket, teams]);

  useEffect(() => {
    if (!connected || !socket || isInititalTeamsRead.current) return;
    socket.emit("teams:read", (teams: Array<Team>) => {
      setTeams(teams);
      isInititalTeamsRead.current = true;
    });
  }, [connected, socket]);

  return (
    <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>
  );
};

export default TeamsProvider;
