import { useMembers } from "../../../../hooks";
import Dropdown from "../../../dropdown/component";
import type { Task } from "@/types";
import React, { useState } from "react";

interface Props {
  task: Task;
}

const Task: React.FC<Props> = (props) => {
  const { task } = props;
  const members = useMembers();
  const [isDragging, setIsDragging] = useState(false);
  const assignees = task.assignees
    .map((assigneeId) => members.find((member) => member.id === assigneeId))
    .filter((assignee) => assignee);

  const options = [
    {
      label: "Delete",
      onSelect: (e: Event) => {
        console.log(e);
      },
    },
    {
      label: "Edit",
      onSelect: (e: Event) => {
        console.log(e);
      },
    },
  ];

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", task.id);
    setIsDragging(true);
  }

  function onDragEnd(e: React.DragEvent<HTMLDivElement>) {
    setIsDragging(false);
  }

  return (
    <div
      key={task.id}
      draggable
      className={`border-[1px] border-gray-200 rounded p-2 cursor-grab ${
        isDragging ? "border-dashed" : ""
      }`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-end">
        <Dropdown options={options} />
      </div>
      <div>Title</div>
      <div className="text-sm text-gray-500 h-[42px] overflow-hidden whitespace-nowrap text-ellipsis leading-none">
        {task.description}
      </div>
      <div className="text-sm text-gray-600">
        <div className="flex">
          <div>Created at:</div>&nbsp;
          <div>{new Date(task.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="flex">
          <div>Date:</div>&nbsp;
          <div>{new Date(task.date).toLocaleDateString()}</div>
        </div>
        <div className="flex">
          <div>Due:</div>&nbsp;
          <div>{new Date(task.dueDate).toLocaleDateString()}</div>
        </div>
        {["ongoing", "review", "finished"].includes(task.status) && (
          <div className="flex">
            <div>In development at:</div>&nbsp;
            <div>{new Date(task.inDevelopmentAt!).toLocaleDateString()}</div>
          </div>
        )}
        {["review", "finished"].includes(task.status) && (
          <div className="flex">
            <div>In review at:</div>&nbsp;
            <div>{new Date(task.inReviewAt!).toLocaleDateString()}</div>
          </div>
        )}
        {["finished"].includes(task.status) && (
          <div className="flex">
            <div>Finished at:</div>&nbsp;
            <div>{new Date(task.finishedAt!).toLocaleDateString()}</div>
          </div>
        )}
      </div>
      <div className="flex pt-4">
        {assignees.map((assignee, index) => (
          <div
            key={assignee?.id}
            className={`h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white border-[1px] border-white ${
              index > 0 ? "-translate-x-2" : ""
            }`}
          >
            <div className="leading-none">{assignee?.name.substring(0, 2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
