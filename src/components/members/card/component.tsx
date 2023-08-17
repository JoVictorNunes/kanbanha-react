import React from "react";
import { useMembers } from "@/hooks";

interface Props {
  memberId: string;
}

const MemberCard: React.FC<Props> = (props) => {
  const { memberId } = props;
  const members = useMembers();
  const member = members.find((m) => m.id === memberId);
  if (!member) return null;

  return (
    <div className="flex gap-2 items-center">
      <div className="p-4 rounded-full text-white bg-blue-600 leading-none">
        {member.name.substring(0, 2)}
      </div>
      <div>
        <div>{member.name}</div>
        <div className="text-sm text-gray-600">{member.role}</div>
        <div
          className={`relative text-xs text-gray-600 pl-2 before:w-1 before:h-1 before:content-[''] before:absolute before:rounded-full ${
            member.online ? "before:bg-green-500" : "before:bg-red-500"
          } before:left-0 before:top-1/2 before:translate-y-[-2px]`}
        >
          {member.online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
