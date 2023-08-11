import React, { SyntheticEvent, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import { useProjects, useSocket } from "../../hooks";

const Projects: React.FC = () => {
  const projects = useProjects();
  const { socket } = useSocket();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!socket || !nameRef.current) return;
    setIsAddingProject(false);
    socket.emit(
      "projects:create",
      { name: nameRef.current.value },
      (response: { code: number }) => {
        if (response.code === 201) {
          toast.success("Project created!");
        }
      }
    );
  };

  const renderNewProjectForm = () => (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label htmlFor="name">Project Name</label>
        <input
          type="text"
          name="name"
          className="outline-none border-[1px] border-gray-300 rounded-lg p-2"
          ref={nameRef}
          required
          maxLength={12}
          minLength={3}
        />
      </div>
      <button
        type="submit"
        className="self-end text-blue-700 bg-blue-100 hover:bg-blue-200 py-1 px-6 rounded font-medium"
      >
        Criar
      </button>
    </form>
  );

  return (
    <div
      className={`flex flex-col gap-6 p-5 border-r-2 border-r-gray-100 w-full h-full`}
    >
      <div className={`grow flex flex-col gap-8`}>
        <div>
          <h2 className={`text-xl pb-2`}>Projects</h2>
          <div className={`flex flex-col gap-2`}>
            {projects.map((p) => {
              return (
                <div className="flex gap-2">
                  <NavLink
                    to={`projects/${p.id}`}
                    key={p.id}
                    className={({ isActive, isPending }) =>
                      `${
                        isActive
                          ? `!border-blue-700 bg-blue-700 text-white`
                          : isPending
                          ? `bg-gray-50`
                          : ``
                      } border-2 border-gray-100 rounded-md px-4 py-2 flex items-center grow`
                    }
                  >
                    <span className="grow overflow-hidden text-ellipsis whitespace-nowrap">
                      {p.name}
                    </span>
                  </NavLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <Dialog.Root
          open={isAddingProject}
          onOpenChange={(open) => setIsAddingProject(open)}
        >
          <Dialog.Trigger asChild>
            <button
              onClick={() => setIsAddingProject(true)}
              className="flex border-2 border-dashed border-indigo-500 text-indigo-500 px-6 py-3 rounded-lg w-full justify-center hover:bg-indigo-50"
            >
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
              <span>New Project</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-opacity-30 bg-black data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="font-medium text-lg">
                New Project
              </Dialog.Title>
              <Dialog.Description className="mb-5 text-sm text-gray-700">
                Create a new project.
              </Dialog.Description>
              {renderNewProjectForm()}
              <Dialog.Close>
                <button className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Projects;
