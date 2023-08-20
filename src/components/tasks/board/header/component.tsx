import React from 'react';
import type { TaskStatuses } from '@/contexts/socket/context';

const TITLES = {
  active: 'To Do',
  ongoing: 'In Progress',
  review: 'Need Review',
  finished: 'Done',
};

const COLORS = {
  active: 'before:bg-orange-500',
  ongoing: 'before:bg-blue-500',
  review: 'before:bg-yellow-500',
  finished: 'before:bg-green-500',
};

interface Props {
  status: TaskStatuses;
  quantity: number;
}

const Header: React.FC<Props> = (props) => {
  const { quantity, status } = props;
  return (
    <div className="flex gap-4 items-center">
      <div
        className={`${COLORS[status]} whitespace-nowrap text-ellipsis relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full before:left-0 before:top-1/2 before:translate-y-[-4px]`}
      >
        {TITLES[status]}
      </div>
      <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">{quantity}</div>
    </div>
  );
};

export default Header;
