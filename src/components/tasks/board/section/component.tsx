import React, { SyntheticEvent, useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import Dialog from "../../../dialog/component";
import { useMembers, useSocket, useTasks, useTeams } from "../../../../hooks";
import Task from "../task/component";

interface Props {
  teamId: string;
  status: "active" | "ongoing" | "review" | "finished";
}

const TITLES = {
  active: "To Do",
  ongoing: "In Progress",
  review: "Need Review",
  finished: "Done",
};

const COLORS = {
  active: "before:bg-orange-500",
  ongoing: "before:bg-blue-500",
  review: "before:bg-yellow-500",
  finished: "before:bg-green-500",
};

type SelectValue = MultiValue<{ value: string; label: string }> | null;

const Section: React.FC<Props> = (props) => {
  const { teamId, status } = props;
  const { socket, connected } = useSocket();
  const teams = useTeams();
  const tasks = useTasks();
  const members = useMembers();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SelectValue>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    const onDragStart = () => setIsDragging(true);
    const onDragEnd = () => setIsDragging(false);
    window.addEventListener("dragstart", onDragStart);
    window.addEventListener("dragend", onDragEnd);
    return () => {
      window.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, []);

  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;
  const teamTasks = tasks.filter((t) => t.teamId === teamId);
  const teamMembers = members.filter((m) => team.members.includes(m.id));
  const tasksFiltered = teamTasks.filter((t) => t.status === status);

  function renderAddTaskForm() {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const date = new Date(formData.get("date") as string).getTime();
      const description = formData.get("description");
      const dueDate = new Date(formData.get("dueDate") as string).getTime();
      if (!socket || !connected) return;
      socket.emit("tasks:create", {
        teamId,
        date,
        description,
        dueDate,
        status,
        assignees: selectedMembers?.map((m) => m.value),
        inDevelopmentAt: ["ongoing", "review", "finished"].includes(status)
          ? new Date().getTime()
          : null,
        inReviewAt: ["review", "finished"].includes(status)
          ? new Date().getTime()
          : null,
        finishedAt: status === "finished" ? new Date().getTime() : null,
      });
    };
    const options = teamMembers.map((m) => ({
      value: m.id,
      label: m.name,
    }));

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => {
                console.log(e.target.value);
                setDate(e.target.value);
              }}
            />
          </div>
          <div>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={10}
            ></textarea>
          </div>
          <div>
            <input type="date" name="dueDate" id="dueDate" />
          </div>
          <label htmlFor="memebers">Members</label>
          <Select
            options={options}
            onChange={(value) => setSelectedMembers(value)}
            name="members"
            isMulti
          />
        </div>
        <button
          type="submit"
          className="self-end text-green-800 bg-green-100 hover:bg-green-200 py-1 px-6 rounded font-medium"
        >
          Add
        </button>
      </form>
    );
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const taskId = e.dataTransfer.getData("text/plain");

    socket?.emit("tasks:move", { status, taskId });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = () => {
    setIsDraggingOver(true);
  };

  const onDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      className={`rounded flex flex-col gap-2`}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`whitespace-nowrap text-ellipsis relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full ${COLORS[status]} before:left-0 before:top-1/2 before:translate-y-[-4px]`}
        >
          {TITLES[status]}
        </div>
        <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">
          {tasksFiltered.length}
        </div>
      </div>
      <Dialog
        open={isAddingTask}
        onOpenChange={setIsAddingTask}
        title="Add New Task"
        description="Add a new to do task."
        triggerText="Add New Task"
        triggerClassName="bg-white border-[1px] border-gray-200 text-blue-700 py-2 px-6 rounded w-full flex"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        }
      >
        {renderAddTaskForm()}
      </Dialog>

      <div
        className={`flex flex-col gap-2 h-[500px] overflow-auto border-2 border-dashed border-transparent ${
          isDragging ? "!border-indigo-500" : ""
        } ${isDraggingOver ? "bg-gray-300" : ""}`}
      >
        {tasksFiltered.map((t) => (
          <Task task={t} />
        ))}
      </div>
    </div>
  );
};

export default Section;
