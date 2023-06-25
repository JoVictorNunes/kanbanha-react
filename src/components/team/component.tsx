import React, { SyntheticEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Select, { MultiValue } from "react-select";
import * as Tabs from "@radix-ui/react-tabs";
import Dialog from "../dialog/component";
import Tasks from "../tasks/component";
import {
  useMembers,
  useProjects,
  useSocket,
  useTeams,
} from "../../hooks";

type SelectValue = MultiValue<{ value: string; label: string }>;

const Team: React.FC = () => {
  const { projectId, teamId } = useParams();
  const socket = useSocket();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const project = projects.find((p) => p.id === projectId);
  const team = teams.find((t) => t.id === teamId);

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
    <div className="w-full flex flex-col">
      <div className="flex pb-6">
        <div className="grow shrink text-xl font-medium">
          <span>{project?.name}</span>&nbsp;/&nbsp;<span>{team?.name}</span>
        </div>
        <div className="grow shrink flex justify-end">
          <Dialog
            open={isAddMemberDialogOpen}
            onOpenChange={setIsAddMemberDialogOpen}
            title="Add New Member"
            description="Select the new member to add in the team."
            triggerText="Add New Member"
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
                <div className="border-2 border-gray-100 rounded p-3 flex bg-white">
                  <div className="w-16 h-16 bg-slate-400 rounded-full"></div>
                  <div>
                    <div>{member?.name}</div>
                    <div>{member?.role}</div>
                  </div>
                </div>
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
