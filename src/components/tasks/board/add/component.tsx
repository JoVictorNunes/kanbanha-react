import React, { SyntheticEvent, useMemo, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import Dialog from '@/components/dialog/component';
import { useMembers, useSocket, useTeams } from '@/hooks';
import type { TaskStatuses, UUID } from '@/contexts/socket/context';
import PlusSmal from '@/svgs/PlusSmal';

type SelectValue = MultiValue<{ value: string; label: string }> | null;

interface Props {
  status: TaskStatuses;
  teamId: UUID;
}

const Add: React.FC<Props> = (props) => {
  const { teamId, status } = props;

  // Data
  const { socket, connected } = useSocket();
  const teams = useTeams();
  const members = useMembers();
  const team = useMemo(() => teams[teamId], [teams, teamId]);
  const teamMembers = useMemo(() => {
    if (!team) return [];
    return Object.values(members).filter((m) => team.members.includes(m.id));
  }, [members, team]);

  // State
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  function renderForm() {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!connected) return;
      const formData = new FormData(e.target as HTMLFormElement);
      const date = new Date(formData.get('date') as string).getTime();
      const description = (formData.get('description') || '') as string;
      const dueDate = new Date(formData.get('dueDate') as string).getTime();
      socket.emit(
        'tasks:create',
        {
          teamId,
          date,
          description,
          dueDate,
          status,
          assignees: selectedMembers?.map((m) => m.value) || [],
        },
        (res) => {
          console.log(res);
        }
      );
    };
    const options = teamMembers.map((m) => ({
      value: m.id,
      label: m.name,
    }));

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              className="block outline-none border-[1px] border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300"
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={10}
              className="w-full resize-none outline-none border-[1px] border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300"
            />
          </div>
          <div>
            <label htmlFor="dueDate">Due date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              className="block outline-none border-[1px] border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300"
            />
          </div>
          <div>
            <label htmlFor="assignees">Assignees</label>
            <Select
              options={options}
              onChange={(value) => setSelectedMembers(value)}
              name="assignees"
              isMulti
            />
          </div>
        </div>
        <button
          type="submit"
          className="self-end text-blue-800 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium"
        >
          Add
        </button>
      </form>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Add New Task"
      description="Add a new to do task."
      trigger={{
        label: 'Add New Task',
        className:
          'bg-white border-[1px] border-gray-200 text-blue-700 py-2 px-6 rounded w-full flex',
        icon: <PlusSmal />,
      }}
    >
      {renderForm()}
    </Dialog>
  );
};

export default Add;
