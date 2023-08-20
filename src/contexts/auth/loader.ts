import { decodeJwt } from 'jose';
import { checkAuth } from '@/api';
import type { UUID } from '@/contexts/socket/context';

export type MemberPayload = {
  id: UUID;
  email: string;
  name: string;
  role: string;
};

type ResponseCodes = {
  ok: 200;
  unauthorized: 401;
};

export type AuthLoader = {
  [K in keyof ResponseCodes]: {
    code: ResponseCodes[K];
    currentMember: ResponseCodes[K] extends 200 ? MemberPayload : null;
    token: ResponseCodes[K] extends 200 ? string : null;
  };
}[keyof ResponseCodes];

const authLoader = async (): Promise<AuthLoader> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      code: 401,
      currentMember: null,
      token: null,
    };
  }
  const response = await checkAuth(token);
  if (response.status === 200) {
    const member = decodeJwt(token) as MemberPayload;
    return {
      code: 200,
      currentMember: member,
      token,
    };
  }
  localStorage.removeItem('token');
  return {
    code: 401,
    currentMember: null,
    token: null,
  };
};

export default authLoader;
