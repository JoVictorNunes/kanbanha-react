import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface Props {
  options: Array<{
    label: string;
    onSelect: (e: Event) => void;
  }>;
  children?: React.ReactNode,
  side?: "top" | "right" | "bottom" | "left"
}

const Dropdown: React.FC<Props> = (props) => {
  const { options, children, side = 'right' } = props;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {children ? children : <button
          className="outline-none border-none bg-transparent p-2 rounded-full hover:bg-gray-200 h-fit focus:shadow-[0px_0px_0px_2px] focus:shadow-blue-600"
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
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
            />
          </svg>
        </button>}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content side={side} className="bg-white min-w-[220px] shadow shadow-gray-400 rounded overflow-hidden">
          
          {options.map((option) => (
            <DropdownMenu.Item
              onSelect={option.onSelect}
              className="outline-none p-2 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white"
            >
              {option.label}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Arrow className="fill-gray-900" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
