// src/services/getTasks.ts
import { Social } from "near-social-bridge/api";

export interface Task {
  id: number;
  finished: boolean;
  description: string;
}

type TasksIndex = {
  value: Task[];
}[];

// get the user tasks
const getTasks = async (accountId: string) => {
  const response = await Social.index<TasksIndex>(
    `todo-app-${accountId}`,
    "tasks",
    {
      limit: 1, // Always the most recent
      order: "desc",
    }
  );

  if (Array.isArray(response) && response[0]) {
    return response[0].value;
  }

  return [];
};

export default getTasks;
