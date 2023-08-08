import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import AuthProvider from "./contexts/auth/provider.tsx";
import SocketProvider from "./contexts/socket/provider.tsx";
import ProjectsProvider from "./contexts/projects/provider.tsx";
import TeamsProvider from "./contexts/teams/provider.tsx";
import MembersProvider from "./contexts/members/provider.tsx";
import TasksProvider from "./contexts/tasks/provider.tsx";
import Login from "./components/login/component.tsx";
import Home from "./components/home/component.tsx";
import authLoader from "./contexts/auth/loader.ts";
import Project from "./components/project/component.tsx";
import Team from "./components/team/component.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    loader: authLoader,
    element: (
      <AuthProvider>
        <SocketProvider>
          <ProjectsProvider>
            <TeamsProvider>
              <MembersProvider>
                <TasksProvider>
                  <App />
                  <ToastContainer />
                </TasksProvider>
              </MembersProvider>
            </TeamsProvider>
          </ProjectsProvider>
        </SocketProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects/:projectId",
        element: <Project />,
      },
      {
        path: "projects/:projectId/teams/:teamId",
        element: <Team />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
