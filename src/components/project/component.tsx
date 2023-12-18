import React, { SyntheticEvent, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import * as Tabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import Dialog from '@/components/dialog/component';
import MemberCard from '@/components/members/card/component';
import {
  useInvites,
  useLayout,
  useMembers,
  useProjects,
  useSocket,
  useTasks,
  useTeams,
} from '@/hooks';
import { CLIENT_TO_SERVER_EVENTS } from '@/contexts/socket/enums';

type SelectValue = MultiValue<{ value: string; label: string }>;

const Project: React.FC = () => {
  const { projectId = '' } = useParams();

  // Data
  const { socket, connected } = useSocket();
  const { layout } = useLayout();
  const projects = useProjects();
  const teams = useTeams();
  const members = useMembers();
  const tasks = useTasks();
  const invites = useInvites();
  const project = projects[projectId];

  // State
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>([]);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [projectName, setProjectName] = useState(project?.name || '');

  const teamsInTheProject = useMemo(
    () => Object.values(teams).filter((team) => team.projectId === projectId),
    [projectId, teams]
  );
  const membersInTheProject = useMemo(() => {
    if (!project) return [];
    return project.members
      .filter((memberId) => memberId !== project.ownerId)
      .map((memberId) => members[memberId]);
  }, [members, project]);
  const projectInvites = useMemo(() => {
    return Object.values(invites).filter((i) => i.projectId === projectId && !i.accepted);
  }, [invites, projectId]);
  const unenrolledMembers = projectInvites.map((i) => members[i.memberId]);
  const tasksInTheProject = useMemo(
    () =>
      Object.values(tasks).filter((task) =>
        teamsInTheProject.some((team) => team.id === task.teamId)
      ),
    [tasks, teamsInTheProject]
  );
  const finishedTasks = useMemo(
    () => tasksInTheProject.filter((task) => task.status === 'finished'),
    [tasksInTheProject]
  );
  const finishedTasksPercentage = useMemo(
    () => (finishedTasks.length / (tasksInTheProject.length || 1)) * 100,
    [finishedTasks.length, tasksInTheProject.length]
  );
  const memberOptions = useMemo(() => {
    return membersInTheProject.map((member) => ({
      value: member.id,
      label: member.name,
    }));
  }, [membersInTheProject]);

  if (!project) {
    return (
      <div
        className="p-5 absolute flex justify-center items-center"
        style={{
          width: layout.main.width,
          height: layout.main.height,
          left: layout.main.left,
          top: layout.main.top,
        }}
      >
        <span>This project does not exist or was deleted.</span>
      </div>
    );
  }

  const renderCreateTeamForm = () => {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!nameRef.current || !connected) return;
      socket.emit(
        CLIENT_TO_SERVER_EVENTS.TEAMS.CREATE,
        {
          projectId: project.id,
          name: nameRef.current.value,
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
            ref={nameRef}
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
            trigger={{
              label: 'New Team',
              className: clsx('bg-blue-600', 'text-white', 'rounded', 'px-4', 'py-2'),
            }}
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
          <Tabs.Trigger
            value="tab3"
            className="p-3 border-b-2 border-b-transparent data-[state=active]:border-b-blue-700"
          >
            Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" className="py-2 flex flex-col gap-8">
          <div>
            <div className="text-xs text-gray-500 font-bold">Name</div>
            <div>{project.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-2">Owner</div>
            <MemberCard memberId={project.ownerId} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-2">Members</div>
            <div>
              {membersInTheProject.map((member) => (
                <div className="flex items-center p-2 rounded odd:bg-gray-200">
                  <div className="grow">
                    <MemberCard memberId={member.id} />
                  </div>
                  <div className="text-gray-800">Enrolled</div>
                </div>
              ))}
              {unenrolledMembers.map((member) => (
                <div className="flex items-center p-2 rounded odd:bg-gray-200">
                  <div className="grow">
                    <MemberCard memberId={member.id} />
                  </div>
                  <div className="text-gray-800">Invited</div>
                </div>
              ))}
            </div>
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
        <Tabs.Content value="tab3" className="flex flex-col gap-8">
          <div className="flex flex-col items-start">
            <label htmlFor="projectName" className="font-medium">
              Project name
            </label>
            <div>
              <input
                type="text"
                id="projectName"
                className="outline-none border-[1px] border-gray-300 rounded p-2 focus:shadow-[0px_0px_0px_3px] focus:shadow-blue-300 focus:border-blue-600"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
              <button
                className="bg-blue-600 px-4 py-2 rounded text-white ml-2"
                onClick={() => {
                  socket.emit('projects:update', { id: projectId, name: projectName }, (res) => {
                    console.log(res);
                  });
                }}
              >
                Rename
              </button>
            </div>
          </div>
          <div className="border-[1px] border-red-600 rounded p-2 flex flex-col gap-4">
            <div>
              <div className="font-medium">Delete this project</div>
              <div>
                Warning: this action will delete permanently this project, its teams and tasks.
              </div>
            </div>
            <button
              className="px-4 py-2 rounded border-red-600 border-[1px] text-red-600 self-start hover:bg-red-600 hover:text-white"
              onClick={() => {
                socket.emit("projects:delete", { id: projectId }, (res) => {
                  console.log(res)
                })
              }}
            >
              Delete project
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Project;
