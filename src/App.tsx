import { Outlet } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar/component";
import Topbar from "./components/topbar/component";
import { useSocket } from "./hooks";
import { useEffect } from "react";

function App() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.connect();
  }, [socket]);

  return (
    <div className={`h-full root`}>
      <Sidebar />
      <Topbar />
      <Outlet />
    </div>
  );
}

export default App;
