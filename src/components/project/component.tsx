import React, { SyntheticEvent, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import * as Tabs from '@radix-ui/react-tabs';
import Dialog from '@/components/dialog/component';
import MemberCard from '@/components/members/card/component';
import {
  useAuth,
  useLayout,
  useMembers,
  useProjects,
  useSocket,
  useTasks,
  useTeams,
} from '@/hooks';

type SelectValue = MultiValue<{ value: string; label: string }>;

const Project: React.FC = () => {
  const { projectId } = useParams();

  // Data
  const { currentMember } = useAuth();
  const { socket, connected } = useSocket();
  const { layout } = useLayout();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const tasks = useTasks();

  // State
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const project = projects.find((project) => project.id === projectId);
  const teamsInTheProject = teams.filter((task) => task.projectId === projectId);
  const tasksInTheProject = tasks.filter((task) =>
    teamsInTheProject.some((team) => team.id === task.teamId)
  );
  const finishedTasks = tasksInTheProject.filter((task) => task.status === 'finished');
  const finishedTasksPercentage = (finishedTasks.length / (tasksInTheProject.length || 1)) * 100;

  if (!project || !projectId) {
    return <div className="font-light">This project does not exist or was deleted.</div>;
  }

  const renderCreateTeamForm = () => {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!nameRef.current || !connected) return;
      socket.emit(
        'teams:create',
        {
          projectId,
          name: nameRef.current.value,
          members: selectedMembers.map((m) => m.value),
        },
        (response) => console.log(response)
      );
    };

    const options = members
      .filter((m) => m.id !== currentMember?.id)
      .map((member) => ({
        value: member.id,
        label: member.name,
      }));

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="outline-none border-[1px] border-gray-300 rounded p-2 focus:shadow-[0px_0px_0px_1px] focus:shadow-blue-600 focus:border-blue-600"
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
          className="self-end text-blue-800 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium focus:shadow-[0px_0px_0px_2px] focus:shadow-blue-600 outline-none"
        >
          Create
        </button>
      </form>
    );
  };

  return (
    <div
      className={`p-5 absolute`}
      style={{
        width: layout.main.width,
        height: layout.main.height,
        left: layout.main.left,
        top: layout.main.top,
      }}
    >
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
            open={isNewTeamDialogOpen}
            onOpenChange={setIsNewTeamDialogOpen}
            description={`Create a new team for the ${project.name} project.`}
            title="New Team"
            triggerText="New Team"
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
            <div contentEditable={editing} id="projectName">
              {project.name}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold">Owner</div>
            <MemberCard memberId={project.ownerId as string} />
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => {
                    setEditing(false);
                  }}
                  className="border-[1px] border-black rounded py-1 px-4 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!connected) return;
                    socket.emit('projects:delete', projectId, (response) => console.log(response));
                  }}
                  className="border-[1px] border-red-600 bg-red-600 text-white rounded py-1 px-4 hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    const name = document.getElementById('projectName')?.innerText;
                    if (!name || !connected) return;
                    socket.emit('projects:update', { id: projectId, name }, (response) =>
                      console.log(response)
                    );
                  }}
                  className="border-[1px] border-blue-600 bg-blue-600 text-white rounded py-1 px-4 hover:bg-blue-700"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditing(true);
                }}
                className="border-[1px] border-blue-600 bg-blue-600 text-white rounded py-1 px-4 hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <div>
            {teamsInTheProject.length > 0 ? (
              teamsInTheProject.map((t) => {
                return (
                  <Link to={`teams/${t.id}`}>
                    <div>{t.name}</div>
                    <div></div>
                  </Link>
                );
              })
            ) : (
              <div className="text-slate-600">
                This project has no teams yet. Create one and start working! &#128521;
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Project;
