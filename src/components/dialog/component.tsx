import React from 'react';
import * as D from '@radix-ui/react-dialog';
import Close from '@/svgs/Close';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  trigger: { label: string; className: string; icon?: React.ReactNode };
}

const Dialog: React.FC<Props> = (props) => {
  const { onOpenChange, open, children, description, title, trigger } = props;
  const { className, label, icon } = trigger;

  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>
        <button className={className}>
          {icon ? icon : null}
          <span>{label}</span>
        </button>
      </D.Trigger>
      <D.Portal>
        <D.Overlay className="bg-opacity-30 bg-black fixed inset-0" />
        <D.Content className="overflow-auto fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <D.Title className="font-medium text-lg">{title}</D.Title>
          <D.Description className="mb-5 text-sm text-gray-700">{description}</D.Description>
          {children}
          <D.Close asChild>
            <button className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:shadow-blue-600 focus:outline-none">
              <Close />
            </button>
          </D.Close>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
};

export default Dialog;
