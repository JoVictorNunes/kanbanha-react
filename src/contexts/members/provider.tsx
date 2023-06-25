import React, { useEffect, useRef, useState } from "react";
import MemberContext from "./context";
import { useSocket } from "../../hooks";
import { Member } from "../../types";

interface Props {
  children: React.ReactNode;
}

const MemberProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const socket = useSocket();
  const [members, setMembers] = useState<Array<Member>>([]);
  const isInititalMembersRead = useRef(false);

  useEffect(() => {
    if (!socket) return;
    const onCreate = (member: Member) => {
      setMembers([...members, member]);
    };
    socket.on("members:create", onCreate);
    return () => {
      socket.off("members:create", onCreate);
    };
  }, [socket, members]);

  useEffect(() => {
    if (!socket || isInititalMembersRead.current) return;
    socket.emit("members:read", (m: Array<Member>) => {
      setMembers(m);
      isInititalMembersRead.current = true;
    });
  }, [socket]);

  return (
    <MemberContext.Provider value={members}>{children}</MemberContext.Provider>
  );
};

export default MemberProvider;
