import { SyntheticEvent, useMemo, useState } from 'react';
import clsx from 'clsx';
import Select, { MultiValue } from 'react-select';
import Dialog from '@/components/dialog/component';
import { Project } from '@/contexts/socket/context';
import { CLIENT_TO_SERVER_EVENTS } from '@/contexts/socket/enums';
import { useMembers, useSocket, useTasks, useTeams } from '@/hooks';

type SelectValue = MultiValue<{ value: string; label: string }>;

interface Props {
  project: Project;
}

const ProjectHeader: React.FC<Props> = (props) => {
  const { project } = props;
  const projectId = project.id;

  // Data
  const { socket, connected } = useSocket();
  const teams = useTeams();
  const members = useMembers();
  const tasks = useTasks();

  // State
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('');

  const projectTeams = useMemo(
    () => Object.values(teams).filter((team) => team.projectId === projectId),
    [projectId, teams]
  );
  const projectMembers = useMemo(
    () =>
      project.members
        .filter((memberId) => memberId !== project.ownerId)
        .map((memberId) => members[memberId]),
    [members, project]
  );
  const projectTasks = useMemo(
    () =>
      Object.values(tasks).filter((task) => projectTeams.some((team) => team.id === task.teamId)),
    [tasks, projectTeams]
  );
  const finishedTasks = useMemo(
    () => projectTasks.filter((task) => task.status === 'finished'),
    [projectTasks]
  );
  const finishedTasksPercentage = useMemo(
    () => (finishedTasks.length / (projectTasks.length || 1)) * 100,
    [finishedTasks.length, projectTasks.length]
  );
  const memberOptions = useMemo(
    () =>
      projectMembers.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    [projectMembers]
  );

  const renderCreateTeamForm = () => {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!connected) return;
      socket.emit(
        CLIENT_TO_SERVER_EVENTS.TEAMS.CREATE,
        {
          projectId: project.id,
          name: teamName,
          members: selectedMembers.map((option) => option.value),
        },
        (response) => console.log(response)
      );
    };

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="outline-none border-[1px] border-gray-300 rounded p-2 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300 focus:border-blue-600"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="members">Members</label>
          <Select
            options={memberOptions}
            isMulti
            onChange={(value) => setSelectedMembers(value)}
            name="members"
            tabIndex={0}
          />
        </div>
        <button
          type="submit"
          className="self-end text-blue-800 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium focus:shadow-[0px_0px_0px_2px] focus:shadow-blue-600 outline-none"
        >
          Create
        </button>
      </form>
    );
  };

  return (
    <div className="flex pb-6 gap-4">
      <div className="grow font-medium flex flex-col">
        <div className="text-lg mb-2">{project.name}</div>
        <div className="w-full">
          <div
            className="h-[4px] bg-blue-600 rounded transition-all"
            style={{
              width: finishedTasksPercentage + '%',
            }}
          />
        </div>
        <div className="text-center text-xs text-gray-500">
          {finishedTasksPercentage.toFixed(0) + '% complete'}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          description={`Create a new team for the ${project.name} project.`}
          title="New Team"
          trigger={{
            label: 'New Team',
            className: clsx('bg-blue-600', 'text-white', 'rounded', 'px-4', 'py-2'),
          }}
        >
          {renderCreateTeamForm()}
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectHeader;
