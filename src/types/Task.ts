import { TASK_STATUSES } from "../utils/enums";

export type Task = {
  createdAt: number;
  date: number;
  description: string;
  finishedAt: number | null;
  id: string;
  inDevelopmentAt: number | null;
  predictedDate: string;
  responsible: string | null;
  status: Lowercase<keyof typeof TASK_STATUSES>;
  teamId: string;
};
