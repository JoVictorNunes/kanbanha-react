import React from 'react';
import { Socket } from 'socket.io-client';
import instance from './instance';

export type UUID = string;

export type Project = {
  id: UUID;
  name: string;
  ownerId: UUID;
  members: Array<UUID>;
};

export type TaskStatuses = 'active' | 'ongoing' | 'review' | 'finished';

export type Task = {
  id: UUID;
  createdAt: Date;
  date: Date;
  description: string;
  finishedAt: Date | null;
  inDevelopmentAt: Date | null;
  inReviewAt: Date | null;
  dueDate: Date;
  assignees: UUID[];
  status: TaskStatuses;
  teamId: UUID;
  index: number;
};

export type Team = {
  id: UUID;
  name: string;
  projectId: UUID;
  members: Array<UUID>;
};

export type Member = {
  id: UUID;
  email: string;
  name: string;
  role: string;
  online: boolean;
};

export type Invite = {
  id: UUID;
  projectId: UUID | null;
  memberId: UUID;
  text: string;
  when: string;
  accepted: boolean;
};

type ResponseCallback = (response: { code: number; message: string }) => void;
type ReadCallback<T> = (data: T) => void;

type CreateProjectData = { name: string; invited: Array<string> };
type UpdateProjectData = { id: UUID; name: string };
type DeleteProjectData = { id: UUID };

type CreateTeamData = { projectId: UUID; name: string; members: Array<UUID> };
type UpdateTeamData = { teamId: UUID; name: string };
type DeleteTeamData = { id: UUID };
type AddTeamMemberData = { teamId: UUID; memberId: UUID };
type RemoveTeamMemberData = AddTeamMemberData;

type CreateTaskData = {
  date: number;
  description: string;
  dueDate: number;
  assignees: UUID[];
  teamId: UUID;
  status: TaskStatuses;
};
type UpdateTaskData = {
  id: UUID;
  date: number;
  description: string;
  dueDate: number;
  assignees: UUID[];
};
type DeleteTaskData = { id: UUID };
type MoveTaskData = {
  taskId: UUID;
  status: TaskStatuses;
  index: number;
};

type UpdateMemberData = {
  name: string;
  role: string;
};

export type CreateInviteData = {
  projectId: UUID;
  invited: Array<string>;
};
export type AccepteInviteData = {
  id: UUID;
};

export interface ServerToClientsEvents {
  'projects:create': (project: Project) => void;
  'projects:update': (project: Project) => void;
  'projects:delete': (projectId: UUID) => void;

  'teams:create': (team: Team) => void;
  'teams:update': (team: Team) => void;
  'teams:delete': (teamId: UUID) => void;

  'tasks:create': (task: Task) => void;
  'tasks:update': (task: Task) => void;
  'tasks:delete': (taskId: UUID) => void;

  'members:create': (member: Member) => void;
  'members:update': (member: Member) => void;
  'members:delete': (memberId: UUID) => void;
  'members:member_connected': (memberId: UUID) => void;
  'members:member_disconnected': (memberId: UUID) => void;

  'invites:create': (invite: Invite) => void;
  'invites:update': (invite: Invite) => void;
}

export interface ClientToServerEvents {
  'projects:create': (data: CreateProjectData, callback: ResponseCallback) => void;
  'projects:read': (callback: ReadCallback<Array<Project>>) => void;
  'projects:update': (data: UpdateProjectData, callback: ResponseCallback) => void;
  'projects:delete': (data: DeleteProjectData, callback: ResponseCallback) => void;

  'teams:create': (data: CreateTeamData, callback: ResponseCallback) => void;
  'teams:read': (callback: ReadCallback<Array<Team>>) => void;
  'teams:update': (data: UpdateTeamData, callback: ResponseCallback) => void;
  'teams:delete': (teamId: DeleteTeamData, callback: ResponseCallback) => void;
  'teams:add_member': (data: AddTeamMemberData, callback: ResponseCallback) => void;
  'teams:remove_member': (data: RemoveTeamMemberData, callback: ResponseCallback) => void;

  'tasks:create': (data: CreateTaskData, callback: ResponseCallback) => void;
  'tasks:read': (callback: ReadCallback<Array<Task>>) => void;
  'tasks:update': (data: UpdateTaskData, callback: ResponseCallback) => void;
  'tasks:delete': (data: DeleteTaskData, callback: ResponseCallback) => void;
  'tasks:move': (data: MoveTaskData, callback: ResponseCallback) => void;

  'members:read': (callback: ReadCallback<Array<Member>>) => void;
  'members:update': (data: UpdateMemberData, callback: ResponseCallback) => void;

  'invites:create': (data: CreateInviteData, callback: ResponseCallback) => void;
  'invites:read': (callback: ReadCallback<Array<Invite>>) => void;
  'invites:accept': (data: AccepteInviteData, callback: ResponseCallback) => void;
}

export type SocketType = Socket<ServerToClientsEvents, ClientToServerEvents>;

const SocketContext = React.createContext<{
  socket: SocketType;
  connected: boolean;
  isReadyToConnect: boolean;
}>({
  socket: instance,
  connected: false,
  isReadyToConnect: false,
});

export default SocketContext;
