import React from 'react';
import Section from './section/component';

interface Props {
  teamId: string;
  availableHeight: number;
}

const Board: React.FC<Props> = (props) => {
  const { availableHeight, teamId } = props;
  return (
    <div
      className={`bg-gray-50 grid grid-cols-[repeat(4,minmax(300px,1fr))] gap-4`}
      style={{ height: availableHeight }}
    >
      <Section status="active" teamId={teamId} availableHeight={availableHeight} />
      <Section status="ongoing" teamId={teamId} availableHeight={availableHeight} />
      <Section status="review" teamId={teamId} availableHeight={availableHeight} />
      <Section status="finished" teamId={teamId} availableHeight={availableHeight} />
    </div>
  );
};

export default Board;
