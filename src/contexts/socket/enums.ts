export const CLIENT_TO_SERVER_EVENTS = {
  MEMBERS: {
    CREATE: 'members:create',
    READ: 'members:read',
    UPDATE: 'members:update',
    DELETE: 'members:delete',
  },
  TEAMS: {
    CREATE: 'teams:create',
    READ: 'teams:read',
    UPDATE: 'teams:update',
    DELETE: 'teams:delete',
    ADD_MEMBER: 'teams:add_member',
    REMOVE_MEMBER: 'teams:remove_member',
  },
  TASKS: {
    CREATE: 'tasks:create',
    READ: 'tasks:read',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
    MOVE: 'tasks:move',
  },
  PROJECTS: {
    CREATE: 'projects:create',
    READ: 'projects:read',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
  },
  INVITES: {
    CREATE: 'invites:create',
    READ: 'invites:read',
    ACCEPT: 'invites:accept',
  },
} as const;

export const SERVER_TO_CLIENT_EVENTS = {
  MEMBERS: {
    CREATE: 'members:create',
    UPDATE: 'members:update',
    DELETE: 'members:delete',
    CONNECTED: 'members:member_connected',
    DISCONNECTED: 'members:member_disconnected',
  },
  TEAMS: {
    CREATE: 'teams:create',
    UPDATE: 'teams:update',
    DELETE: 'teams:delete',
  },
  TASKS: {
    CREATE: 'tasks:create',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
  },
  PROJECTS: {
    CREATE: 'projects:create',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
  },
  INVITES: {
    CREATE: 'invites:create',
    UPDATE: 'invites:update',
  },
} as const;
