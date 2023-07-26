import React from "react";
import Section from "./board/section/component";

interface Props {
  teamId: string;
}

const Tasks: React.FC<Props> = (props) => {
  const { teamId } = props;

  return (
    <div className={`p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4 grow h-full`}>
      <Section status="active" teamId={teamId} />
      <Section status="ongoing" teamId={teamId} />
      <Section status="review" teamId={teamId} />
      <Section status="finished" teamId={teamId} />
    </div>
  );
};

export default Tasks;
