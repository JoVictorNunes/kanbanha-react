import React, { SyntheticEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Select, { MultiValue } from "react-select";
import * as Tabs from "@radix-ui/react-tabs";
import Dialog from "../dialog/component";
import Tasks from "../tasks/component";
import { useMembers, useProjects, useSocket, useTasks, useTeams } from "../../hooks";
import MemberCard from "../members/member-card/component";
import styles from './styles.module.css'

type SelectValue = MultiValue<{ value: string; label: string }>;

const Team: React.FC = () => {
  const { projectId, teamId } = useParams();
  const { socket } = useSocket();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const tasks = useTasks();
  const project = projects.find((p) => p.id === projectId);
  const team = teams.find((t) => t.id === teamId);
  const tasksOnTheTeam = tasks.filter((t) => t.teamId === teamId)
  const finishedTasks = tasksOnTheTeam.filter((t) => t.status === 'finished')

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!nameRef.current || !socket) return;
    socket.emit("teams:create", {
      projectId,
      team: {
        name: nameRef.current.value,
      },
      members: selectedMembers.map((m) => m.value),
    });
  };

  const renderAddMembersForm = () => {
    const options = members
      .filter((m) => !team?.members.includes(m.id))
      .map((member) => ({
        value: member.id,
        label: member.email,
      }));
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
          className="self-end text-green-800 bg-green-100 hover:bg-green-200 py-1 px-6 rounded font-medium"
        >
          Add
        </button>
      </form>
    );
  };

  return (
    <div className={`w-full flex flex-col p-6 ${styles.root}`}>
      <div className="flex pb-6 gap-4">
        <div className="grow font-medium flex flex-col">
          <div className="text-lg mb-2">{project?.name} / {team?.name}</div>
          <div className="w-full bg-gray-300 rounded overflow-hidden">
            <div className="h-[4px] bg-blue-600 w-2/4" style={{
              width: finishedTasks.length / (tasksOnTheTeam.length || 1) * 100 + '%'
            }}></div>
          </div>
          <div className="text-center text-xs text-gray-500">{(finishedTasks.length / (tasksOnTheTeam.length || 1) * 100).toFixed(0) + '%'} complete</div>
        </div>
        <div className="flex flex-col justify-center">
        <Dialog
            open={isAddMemberDialogOpen}
            onOpenChange={setIsAddMemberDialogOpen}
            title="Add New Member"
            description="Select the new member to add in the team."
            triggerText="Add Member"
            triggerClassName="bg-blue-600 text-white rounded px-4 py-2"
          >
            {renderAddMembersForm()}
          </Dialog>
        </div>
      </div>
      <Tabs.Root defaultValue="tab1" className="grow flex flex-col">
        <Tabs.List>
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
            {team?.members.map((m) => {
              const member = members.find((n) => n.id === m);
              return (
                <MemberCard memberId={member?.id as string} />
              );
            })}
          </div>
        </Tabs.Content>
        <Tabs.Content value="tab3" className="grow">
          <Tasks teamId={teamId as string} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Team;
