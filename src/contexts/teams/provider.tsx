import React, { useEffect, useRef, useState } from "react";
import TeamsContext from "./context";
import { useSocket } from "../../hooks";
import { Team } from "@/types";

interface Props {
  children: React.ReactNode;
}

const TeamsProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const socket = useSocket();
  const [teams, setTeams] = useState<Array<Team>>([]);
  const isInititalTeamsRead = useRef(false);

  useEffect(() => {
    if (!socket) return;
    const onCreate = (team: Team) => {
      setTeams([...teams, team]);
    };
    socket.on("teams:create", onCreate);
    return () => {
      socket.off("teams:create", onCreate);
    };
  }, [socket, teams]);

  useEffect(() => {
    if (!socket || isInititalTeamsRead.current) return;
    socket.emit("teams:read", (t: Array<Team>) => {
      setTeams(t);
      isInititalTeamsRead.current = true;
    });
  }, [socket]);

  return (
    <TeamsContext.Provider value={teams}>{children}</TeamsContext.Provider>
  );
};

export default TeamsProvider;
