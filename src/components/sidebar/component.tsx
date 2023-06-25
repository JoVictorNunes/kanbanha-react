import React, { useState } from "react";
import Projects from "../projects/component";

const Navbar: React.FC = () => {
  const [isProjectsPanelOpen, setIsProjectPanelOpen] = useState(false);

  const toggleProjectsPanel = () => {
    setIsProjectPanelOpen(!isProjectsPanelOpen);
  };

  return (
    <div className={`flex`}>
      <div className={`flex flex-col gap-8 border-r-2 border-r-gray-100`}>
        <div
          className={`text-center m-2 rounded-xl bg-blue-700 text-white font-extrabold text-xl p-2`}
        >
          K
        </div>
        <div
          className={`px-6 py-3 text-inherit outline-none border-l-4 border-transparent ${
            isProjectsPanelOpen
              ? "border-l-blue-700 text-blue-700 bg-blue-50"
              : ""
          }`}
          onClick={toggleProjectsPanel}
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
              d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
            />
          </svg>
        </div>
      </div>
      {isProjectsPanelOpen && <Projects />}
    </div>
  );
};

export default Navbar;
