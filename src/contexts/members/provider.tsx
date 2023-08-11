import React, { useEffect, useRef, useState } from "react";
import MemberContext from "./context";
import { useSocket } from "../../hooks";
import type { Member } from "@/contexts/socket/context";

interface Props {
  children: React.ReactNode;
}

const MembersProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const { socket, connected } = useSocket();
  const [members, setMembers] = useState<Array<Member>>([]);
  const isInititalMembersRead = useRef(false);

  useEffect(() => {
    if (!connected || !socket) return;
    const onCreate = (member: Member) => {
      setMembers([...members, member]);
    };
    const onUpdate = (member: Member) => {
      const membersFiltered = members.filter((m) => m.id !== member.id);
      setMembers([...membersFiltered, member]);
    };
    const onDelete = (memberId: string) => {
      setMembers(members.filter((m) => m.id !== memberId));
    };
    const onDisconnected = (memberId: string) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;
      member.online = false;
      setMembers([...members]);
    };
    const onConnected = (memberId: string) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;
      member.online = true;
      setMembers([...members]);
    };
    socket.on("members:create", onCreate);
    socket.on("members:update", onUpdate);
    socket.on("members:delete", onDelete);
    socket.on("members:member_connected", onConnected);
    socket.on("members:member_disconnected", onDisconnected);
    return () => {
      socket.off("members:create", onCreate);
      socket.off("members:update", onUpdate);
      socket.off("members:delete", onDelete);
      socket.off("members:member_connected", onConnected);
      socket.off("members:member_disconnected", onDisconnected);
    };
  }, [connected, socket, members]);

  useEffect(() => {
    if (!connected || !socket || isInititalMembersRead.current) return;
    socket.emit("members:read", (members: Array<Member>) => {
      setMembers(members);
      isInititalMembersRead.current = true;
    });
  }, [connected, socket]);

  return (
    <MemberContext.Provider value={members}>{children}</MemberContext.Provider>
  );
};

export default MembersProvider;
