import { useTasks } from "../../hooks";
import React from "react";

interface Props {
  teamId: string;
}

const Tasks: React.FC<Props> = (props) => {
  const { teamId } = props;
  const tasks = useTasks();
  const tasksOfTheTeam = tasks.filter((t) => t.teamId === teamId)

  return (
    <div className="p-8 bg-gray-50 grid grid-cols-4 gap-4 grow h-full">
      <div>
        <div>To Do</div>
        <button className="bg-white border-2 border-gray-100 text-blue-700 py-2 px-6 rounded-md w-full">
          Add New Task
        </button>
      </div>
      <div>
        <div>In Progress</div>
        <button className="bg-white border-2 border-gray-100 text-blue-700 py-2 px-6 rounded-md w-full">
          Add New Task
        </button>
      </div>
      <div>
        <div>Need Review</div>
        <button className="bg-white border-2 border-gray-100 text-blue-700 py-2 px-6 rounded-md w-full">
          Add New Task
        </button>
      </div>
      <div>
        <div>Done</div>
        <button className="bg-white border-2 border-gray-100 text-blue-700 py-2 px-6 rounded-md w-full">
          Add New Task
        </button>
      </div>
    </div>
  );
};

export default Tasks;
