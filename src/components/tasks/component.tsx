import { useMembers, useSocket, useTasks, useTeams } from "../../hooks";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Dialog from "../dialog/component";
import Select, { MultiValue } from "react-select";
import Task from "./board/task/component";
import Section from "./board/section/component";


interface Props {
  teamId: string;
}

type SelectValue = MultiValue<{ value: string; label: string }> | null;

const Tasks: React.FC<Props> = (props) => {
  const { teamId } = props;
  const tasks = useTasks();
  const teams = useTeams();
  const members = useMembers();
  const { socket } = useSocket();
  const [isAddingActive, setIsAddingActive] = useState(false);
  const [isAddingOngoing, setIsAddingOngoing] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isAddingFinished, setIsAddingFinished] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SelectValue>(null);
  const [isDragging, setIsDragging] = useState(false);
  const team = teams.find((t) => t.id === teamId);
  console.log(isDragging)

  useEffect(() => {
    const onDrag = () => setIsDragging(true);
    const onDragEnd = () => setIsDragging(false);

    window.addEventListener("drag", onDrag);
    window.addEventListener("dragend", onDragEnd);

    return () => {
      window.removeEventListener("drag", onDrag);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [isDragging]);

  if (!team) return null;
  const tasksOfTheTeam = tasks.filter((t) => t.teamId === teamId);
  const membersOfTheTeam = members.filter((m) => team.members.includes(m.id));
  const activeTasks = tasksOfTheTeam.filter((t) => t.status === "active");
  const ongoingTasks = tasksOfTheTeam.filter((t) => t.status === "ongoing");
  const reviewTasks = tasksOfTheTeam.filter((t) => t.status === "review");
  const finishedTasks = tasksOfTheTeam.filter((t) => t.status === "finished");

  function renderAddTaskForm(status: string) {
    const onSubmit = (e: SyntheticEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const date = new Date(formData.get("date") as string).getTime();
      const description = formData.get("description");
      const dueDate = new Date(formData.get("dueDate") as string).getTime();
      if (!socket) return;
      socket.emit("tasks:create", {
        teamId,
        date,
        description,
        dueDate,
        status,
        assignees: selectedMember?.map((s) => s.value),
      });
    };
    const options = membersOfTheTeam.map((m) => ({
      value: m.id,
      label: m.name,
    }));

    return (
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div>
            <input type="date" name="date" id="date" />
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
            onChange={(value) => setSelectedMember(value)}
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

  return (
    <div className={`p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4 grow h-full`}>
      <Section status="active" teamId={teamId} />
      {/* <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <div className="whitespace-nowrap text-ellipsis relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full before:bg-orange-500 before:left-0 before:top-1/2 before:translate-y-[-4px]">
            To Do
          </div>
          <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">
            {activeTasks.length}
          </div>
        </div>
        <Dialog
          open={isAddingActive}
          onOpenChange={setIsAddingActive}
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
          {renderAddTaskForm("active")}
        </Dialog>

        <div>
          {activeTasks.map((t) => (
            <Task task={t} />
          ))}
        </div>
      </div> */}
      <div className={`flex flex-col gap-2 border-[1px] border-transparent rounded overflow-hidden ${isDragging ? ' border-red-600 animate-pulse' : ''}`}>
        <div className="flex gap-4 items-center">
          <div className="relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full before:bg-blue-500 before:left-0 before:top-1/2 before:translate-y-[-4px]">
            In Progress
          </div>
          <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">
            {ongoingTasks.length}
          </div>
        </div>
        <Dialog
          open={isAddingOngoing}
          onOpenChange={setIsAddingOngoing}
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
          {renderAddTaskForm("ongoing")}
        </Dialog>
        <div>
          {ongoingTasks.map((t) => (
            <Task task={t} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <div className="whitespace-nowrap text-ellipsis relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full before:bg-yellow-500 before:left-0 before:top-1/2 before:translate-y-[-4px]">
            Need Review
          </div>
          <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">
            {reviewTasks.length}
          </div>
        </div>
        <Dialog
          open={isAddingReview}
          onOpenChange={setIsAddingReview}
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
          {renderAddTaskForm("review")}
        </Dialog>
        <div>
          {reviewTasks.map((t) => (
            <Task task={t} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <div className="relative pl-4 before:w-2 before:h-2 before:content-[''] before:absolute before:rounded-full before:bg-green-500 before:left-0 before:top-1/2 before:translate-y-[-4px]">
            Done
          </div>
          <div className="text-sm p-1 rounded-full bg-gray-200 leading-none">
            {finishedTasks.length}
          </div>
        </div>
        <Dialog
          open={isAddingFinished}
          onOpenChange={setIsAddingFinished}
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
          {renderAddTaskForm("finished")}
        </Dialog>
        <div>
          {finishedTasks.map((t) => (
            <Task task={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
