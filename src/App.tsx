import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/component";
import Topbar from "@/components/topbar/component";
import { useSocket } from "@/hooks";
import { useEffect } from "react";
import Panel from "@/components/panel/component";

function App() {
  const { socket } = useSocket();

  useEffect(() => {
    socket?.connect();
  }, [socket]);

  return (
    <div className="h-full relative">
      <Sidebar />
      <Panel />
      <Topbar />
      <Outlet />
    </div>
  );
}

export default App;
