import { TASK_STATUSES } from "../utils/enums";

export type Task = {
  createdAt: string;
  date: string;
  description: string;
  finishedAt: string | null;
  id: string;
  inDevelopmentAt: string | null;
  inReviewAt: string | null;
  dueDate: string;
  assignees: string[];
  status: Lowercase<keyof typeof TASK_STATUSES>;
  teamId: string;
};
