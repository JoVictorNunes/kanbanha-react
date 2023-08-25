import React, { SyntheticEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import * as Tabs from '@radix-ui/react-tabs';
import Dialog from '@/components/dialog/component';
import Tasks from '@/components/tasks/component';
import MemberCard from '@/components/members/card/component';
import { useLayout, useMembers, useProjects, useSocket, useTasks, useTeams } from '@/hooks';
import clsx from 'clsx';

type SelectValue = MultiValue<{ value: string; label: string }>;

const Team: React.FC = () => {
  const { projectId, teamId } = useParams();

  // Data
  const { layout } = useLayout();
  const { socket, connected } = useSocket();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const tasks = useTasks();

  // State
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  const team = useMemo(() => teams.find((t) => t.id === teamId), [teams, teamId]);
  const teamTasks = useMemo(() => tasks.filter((t) => t.teamId === teamId), [tasks, teamId]);
  const finishedTasks = useMemo(
    () => teamTasks.filter((t) => t.status === 'finished'),
    [teamTasks]
  );
  const finishedTasksPercentual = useMemo(
    () => (finishedTasks.length / (teamTasks.length || 1)) * 100,
    [finishedTasks, teamTasks]
  );

  if (!project || !team) return null;

  const renderAddMembersForm = () => {
    const options = members
      .filter((m) => !team.members.includes(m.id))
      .map((member) => ({
        value: member.id,
        label: member.email,
      }));

    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!connected) return;
      selectedMembers.forEach(({ value }) => {
        socket.emit(
          'teams:addMember',
          {
            teamId: team.id,
            memberId: value,
          },
          (res) => console.log(res)
        );
      });
    };

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="memebers">Members</label>
          <Select
            options={options}
            isMulti
            onChange={(value) => setSelectedMembers(value)}
            name="members"
          />
        </div>
        <button
          type="submit"
          className="self-end text-blue-800 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium"
        >
          Add
        </button>
      </form>
    );
  };

  return (
    <div
      className={`p-5 flex flex-col absolute overflow-hidden`}
      style={{
        width: layout.main.width,
        height: layout.main.height,
        left: layout.main.left,
        top: layout.main.top,
      }}
    >
      <div className="flex pb-6 gap-4 h-20">
        <div className="grow font-medium flex flex-col">
          <div className="text-lg mb-2">
            {project.name} / {team.name}
          </div>
          <div className="w-full bg-gray-300 rounded overflow-hidden">
            <div
              className="h-[4px] bg-blue-600 w-2/4"
              style={{
                width: finishedTasksPercentual + '%',
              }}
            ></div>
          </div>
          <div className="text-center text-xs text-gray-500">
            {finishedTasksPercentual.toFixed(0) + '% complete'}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <Dialog
            open={isAddMemberDialogOpen}
            onOpenChange={setIsAddMemberDialogOpen}
            title="Add New Member"
            description="Select the new member to add in the team."
            trigger={{
              label: 'Add Member',
              className: clsx('bg-blue-600', 'text-white', 'rounded', 'px-4', 'py-2'),
            }}
          >
            {renderAddMembersForm()}
          </Dialog>
        </div>
      </div>
      <Tabs.Root
        defaultValue="tab1"
        className="flex flex-col overflow-hidden"
        style={{ height: layout.main.height - 120 }}
      >
        <Tabs.List style={{ height: 0.1 * (layout.main.height - 120) }}>
          <Tabs.Trigger
            value="tab1"
            className="p-3 border-b-2 border-b-transparent data-[state=active]:border-b-blue-700"
          >
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab2"
            className="p-3 border-b-2 border-b-transparent data-[state=active]:border-b-blue-700"
          >
            Members
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tab3"
            className="p-3 border-b-2 border-b-transparent data-[state=active]:border-b-blue-700"
          >
            Tasks
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Overview</Tabs.Content>
        <Tabs.Content value="tab2" className="bg-gray-50">
          <div className="flex flex-col gap-4 p-4">
            {team.members.map((m) => {
              const member = members.find((n) => n.id === m);
              return <MemberCard memberId={member?.id as string} />;
            })}
          </div>
        </Tabs.Content>
        <Tabs.Content value="tab3" style={{ height: 0.9 * (layout.main.height - 120) }}>
          <Tasks teamId={teamId as string} availableHeight={0.9 * (layout.main.height - 120)} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Team;
