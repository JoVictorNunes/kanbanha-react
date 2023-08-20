import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface Props {
  children: React.ReactNode;
  innerRef?(ref: HTMLDivElement | null): void;
  [k: string]: unknown;
}

const Scroll: React.FC<Props> = (props) => {
  const { children, innerRef, ...rest } = props;
  return (
    <ScrollArea.Root
      className={`w-full h-full rounded overflow-hidden border-2 border-dashed border-transparent`}
    >
      <ScrollArea.Viewport className={`w-full h-full`} ref={innerRef} {...rest}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-gray-200 transition-colors duration-[160ms] ease-out hover:hover:bg-gray-300 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-slate-900" />
    </ScrollArea.Root>
  );
};

export default Scroll;
