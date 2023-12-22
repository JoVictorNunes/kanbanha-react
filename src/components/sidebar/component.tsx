import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useLayout } from '@/hooks';
import { ACTIONS } from '@/contexts/layout/enums';
import RectangleStack from '@/svgs/RectangleStack';

const Navbar: React.FC = () => {
  const { layout, dispatch } = useLayout();

  const toggleProjectsPanel = () => {
    dispatch({
      type: ACTIONS.SET_PANEL_IS_OPEN,
      value: !layout.input.isPanelOpen,
    });
  };

  const projectsPanelButtonStyles = clsx({
    'border-l-blue-700': layout.input.isPanelOpen,
    'text-blue-700': layout.input.isPanelOpen,
    'bg-blue-100': layout.input.isPanelOpen,
  });

  return (
    <div
      className={`flex absolute overflow-hidden`}
      style={{
        height: layout.sidebar.height,
        width: layout.sidebar.width,
        left: layout.sidebar.left,
        top: layout.sidebar.top,
      }}
    >
      <div className={`flex flex-col gap-8 border-r-2 border-r-gray-100`}>
        <Link
          to="/"
          className={`text-center m-2 rounded-xl bg-blue-700 text-white font-extrabold text-xl p-2 active:scale-[0.95] transition-all`}
        >
          ƙ
        </Link>
        <button
          className={`px-6 py-3 outline-none border-l-4 border-transparent hover:bg-blue-100 ${projectsPanelButtonStyles}`}
          onClick={toggleProjectsPanel}
        >
          <RectangleStack />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
