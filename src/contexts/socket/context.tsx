import React from 'react';
import { Socket } from 'socket.io-client';
import instance from './instance';

export type UUID = string;

export type Project = {
  id: string;
  name: string;
  ownerId: string;
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
  members: Array<string>;
};

export type Member = {
  id: UUID;
  email: string;
  name: string;
  role: string;
  online: boolean;
};

type ResponseCallback = (response: { code: number; message: string }) => void;
type ReadCallback<T> = (data: T) => void;

type ProjectsCreateData = { name: string };
type ProjectsUpdateData = { id: UUID; name: string };
type ProjectsDeleteData = UUID;

type TeamsCreateData = { projectId: UUID; name: string; members: Array<UUID> };
type TeamsUpdateData = { teamId: UUID; name: string };
type TeamsDeleteData = UUID;
type TeamsAddMemberData = { teamId: UUID; memberId: UUID };
type TeamsRemoveMemberData = TeamsAddMemberData;

type TasksCreateData = {
  date: number;
  description: string;
  dueDate: number;
  assignees: UUID[];
  teamId: UUID;
  status: TaskStatuses;
};
type TasksUpdateData = {
  id: UUID;
  date: number;
  description: string;
  dueDate: number;
  assignees: UUID[];
};
type TasksDeleteData = UUID;
type TasksMoveData = {
  taskId: UUID;
  status: TaskStatuses;
  index: number;
};

type MemberCreateData = {
  email: string;
  password: string;
  name: string;
  role: string;
};
type MemberUpdateData = {
  email: string;
  name: string;
  role: string;
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
}

export interface ClientToServerEvents {
  'projects:create': (data: ProjectsCreateData, callback: ResponseCallback) => void;
  'projects:read': (callback: ReadCallback<Array<Project>>) => void;
  'projects:update': (data: ProjectsUpdateData, callback: ResponseCallback) => void;
  'projects:delete': (projectId: ProjectsDeleteData, callback: ResponseCallback) => void;

  'teams:create': (data: TeamsCreateData, callback: ResponseCallback) => void;
  'teams:read': (callback: ReadCallback<Array<Team>>) => void;
  'teams:update': (data: TeamsUpdateData, callback: ResponseCallback) => void;
  'teams:delete': (teamId: TeamsDeleteData, callback: ResponseCallback) => void;
  'teams:addMember': (data: TeamsAddMemberData, callback: ResponseCallback) => void;
  'teams:removeMember': (data: TeamsRemoveMemberData, callback: ResponseCallback) => void;

  'tasks:create': (data: TasksCreateData, callback: ResponseCallback) => void;
  'tasks:read': (callback: ReadCallback<Array<Task>>) => void;
  'tasks:update': (data: TasksUpdateData, callback: ResponseCallback) => void;
  'tasks:delete': (taskId: TasksDeleteData, callback: ResponseCallback) => void;
  'tasks:move': (data: TasksMoveData, callback: ResponseCallback) => void;

  'members:create': (data: MemberCreateData, callback: ResponseCallback) => void;
  'members:read': (callback: ReadCallback<Array<Member>>) => void;
  'members:update': (data: MemberUpdateData, callback: ResponseCallback) => void;
  'members:delete': (callback: ResponseCallback) => void;
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
