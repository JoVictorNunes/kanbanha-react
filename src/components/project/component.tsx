import React, { SyntheticEvent, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Select, { MultiValue } from "react-select";
import * as Tabs from "@radix-ui/react-tabs";
import Dialog from "../dialog/component";
import {
  useAuth,
  useMembers,
  useProjects,
  useSocket,
  useTasks,
  useTeams,
} from "../../hooks";
import MemberCard from "../members/member-card/component";
import styles from './styles.module.css'

type SelectValue = MultiValue<{ value: string; label: string }>;

const Project: React.FC = () => {
  const { projectId } = useParams();
  const { currentMember } = useAuth();
  const { socket } = useSocket();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const tasks = useTasks();
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const project = projects.find((p) => p.id === projectId);
  const teamsOnTheProject = teams.filter((t) => t.projectId === projectId);
  const tasksOnTheProject = tasks.filter((t) => teamsOnTheProject.some((team) => team.id === t.teamId))
  const finishedTasks = tasksOnTheProject.filter((t) => t.status === 'finished')

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

  const renderCreateTeamForm = () => {
    const options = members
      .filter((m) => m.id !== currentMember?.id)
      .map((member) => ({
        value: member.id,
        label: member.name,
      }));
    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="name">Team Name</label>
          <input
            type="text"
            name="name"
            className="outline-none border-2 border-gray-100 rounded p-2"
            ref={nameRef}
          />
        </div>
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
          Criar
        </button>
      </form>
    );
  };

  return (
    <div className={`w-full p-6 ${styles.root}`}>
      <div className="flex pb-6 gap-4">
        <div className="grow font-medium flex flex-col">
          <div className="text-lg mb-2">{project?.name}</div>
          <div className="w-full">
            <div className="h-[4px] bg-blue-600 rounded" style={{
              width: finishedTasks.length / tasksOnTheProject.length * 100 + '%'
            }}></div>
          </div>
          <div className="text-center text-xs text-gray-500">{(finishedTasks.length / tasksOnTheProject.length * 100).toFixed(0) + '%'} complete</div>
        </div>
        <div className="flex flex-col justify-center">
          <Dialog
            open={isNewTeamDialogOpen}
            onOpenChange={setIsNewTeamDialogOpen}
            description={`Create a new team for the ${project?.name} project.`}
            title="Create New Team"
            triggerText="Create Team"
            triggerClassName="bg-blue-600 text-white rounded px-4 py-2"
          >
            {renderCreateTeamForm()}
          </Dialog>
        </div>
      </div>
      <Tabs.Root defaultValue="tab1">
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
            Teams
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" className="py-2 flex flex-col gap-4">
          <div>
            <div className="text-xs text-gray-500 font-bold">Name</div>
            <div>{project?.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold">Owner</div>
            <MemberCard memberId={project?.ownerId as string} />
          </div>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <div>
            {teamsOnTheProject.map((t) => {
              return (
                <Link to={`teams/${t.id}`}>
                  <div>{t.name}</div>
                  <div></div>
                </Link>
              );
            })}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Project;
