import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useInvites, useLayout, useSocket } from '@/hooks';
import Dropdown from '@/components/dropdown/component';
import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';

const Topbar: React.FC = () => {
  const { currentMember } = useAuth();
  const { layout } = useLayout();
  const { socket } = useSocket();
  const invites = useInvites();
  const navigate = useNavigate();

  const options = [
    {
      label: 'My account',
      onSelect: () => {
        navigate('/account');
      },
    },
    {
      label: 'Sign out',
      onSelect: () => {
        socket.disconnect();
        localStorage.removeItem('token');
        navigate('/signin');
      },
    },
  ];

  const memberInvites = Object.values(invites).filter(
    (invite) => invite.memberId === currentMember?.id
  );

  return (
    <div
      className={`h-16 px-6 pt-6 flex items-center gap-3 text-sm text-gray-500 justify-end absolute`}
      style={{
        height: layout.topbar.height,
        width: layout.topbar.width,
        left: layout.topbar.left,
        top: layout.topbar.top,
      }}
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center bg-white cursor-pointer outline-none"
            aria-label="Update dimensions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="rounded w-[260px] p-1 bg-white border-[1px] border-gray-300 text-xs select-none"
            sideOffset={5}
          >
            <div className="flex flex-col gap-2.5">
              {memberInvites.length > 0 ? (
                memberInvites.map((invite) => {
                  return (
                    <div
                      key={invite.id}
                      className={clsx(
                        {
                          'font-bold': !invite.accepted,
                        },
                        'hover:bg-gray-200 p-4 flex flex-col items-start rounded'
                      )}
                    >
                      <span>{invite.text}</span>
                      <button
                        onClick={() => {
                          socket.emit('invites:accept', { id: invite.id }, (res) => {
                            console.log(res);
                          });
                        }}
                        className={`rounded bg-gray-300 px-2 py-1 hover:bg-blue-600 hover:text-white`}
                      >
                        Accept
                      </button>
                    </div>
                  );
                })
              ) : (
                <span>You have no invites!</span>
              )}
            </div>
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <button className="relative before:w-2 before:h-2 before:rounded-full before:content-[''] before:absolute before:bg-red-600 before:right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </button>
      <Dropdown options={options} side="bottom">
        <button className="flex gap-2 items-center">
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
            <div className="leading-none">{currentMember?.name.substring(0, 2)}</div>
          </div>
          <div className="text-black">{currentMember?.name}</div>
        </button>
      </Dropdown>
    </div>
  );
};

export default Topbar;
