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
  useTeams,
} from "../../hooks";

type SelectValue = MultiValue<{ value: string; label: string }>;

const Project: React.FC = () => {
  const { projectId } = useParams();
  const { currentMember } = useAuth();
  const socket = useSocket();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const project = projects.find((p) => p.id === projectId);
  const teamsOnTheProject = teams.filter((t) => t.projectId === projectId);

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
    <div className="w-full p-6">
      <div className="flex pb-6">
        <div className="grow shrink text-xl font-medium">
          <span>{project?.name}</span>
        </div>
        <div className="grow shrink flex justify-end">
          <Dialog
            open={isNewTeamDialogOpen}
            onOpenChange={setIsNewTeamDialogOpen}
            description={`Create a new team for the ${project?.name} project.`}
            title="Create New Team"
            triggerText="Create New Team"
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
        <Tabs.Content value="tab1">Overview</Tabs.Content>
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
