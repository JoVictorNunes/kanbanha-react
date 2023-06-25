import React from "react";
import * as D from "@radix-ui/react-dialog";

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  triggerText: string;
}

const Dialog: React.FC<Props> = (props) => {
  const {
    onOpenChange,
    open,
    children,
    description,
    title,
    triggerText,
  } = props;
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>
        <button className="py-2 p-6 bg-blue-700 text-white rounded-md">
          {triggerText}
        </button>
      </D.Trigger>
      <D.Portal>
        <D.Overlay className="bg-opacity-30 bg-black data-[state=open]:animate-overlayShow fixed inset-0" />
        <D.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <D.Title className="font-medium text-lg">{title}</D.Title>
          <D.Description className="mb-5 text-sm text-gray-700">
            {description}
          </D.Description>
          {children}
          <D.Close asChild>
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
          </D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
};

export default Dialog;
