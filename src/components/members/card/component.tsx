import React from 'react';
import { useMembers } from '@/hooks';
import clsx from 'clsx';

interface Props {
  memberId: string;
}

const statusStaticStyles = clsx(
  'relative',
  'text-xs',
  'text-gray-600',
  'pl-2',
  'before:w-1',
  'before:h-1',
  'before:content-[""]',
  'before:absolute',
  'before:rounded-full',
  'before:left-0',
  'before:top-1/2',
  'before:translate-y-[-2px]'
);

const nameStaticStyles = clsx('p-4', 'rounded-full', 'text-white', 'bg-blue-600', 'leading-none');
const roleStaticStatus = clsx('text-s', 'text-gray-600');

const MemberCard: React.FC<Props> = (props) => {
  const { memberId } = props;
  const members = useMembers();
  const member = members.find((m) => m.id === memberId);

  const statusStyles = clsx({
    'before:bg-green-500': member && member.online,
    'before:bg-red-500': !member || !member.online,
  });

  return (
    <div className="flex gap-2 items-center">
      <div className={`${nameStaticStyles}`}>{member ? member.name.substring(0, 2) : '??'}</div>
      <div>
        <div>{member ? member.name : 'Unknown'}</div>
        <div className={`${roleStaticStatus}`}>{member ? member.role : ''}</div>
        <div className={`${statusStyles} ${statusStaticStyles}`}>
          {member && member.online ? 'Online' : 'Offline'}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
