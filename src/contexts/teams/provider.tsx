import React, { useEffect, useRef, useState } from "react";
import TeamsContext from "./context";
import { useSocket } from "../../hooks";
import { Team } from "@/types";

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
    socket.on("teams:create", onCreate);
    return () => {
      socket.off("teams:create", onCreate);
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
