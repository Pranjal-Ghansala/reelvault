import { Outlet } from "react-router-dom";
import Header from "./Header";
import ToastViewport from "../feedback/ToastViewport.jsx";

function AppShell() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f5f1e8]">
      <Header />

      <main>
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  );
}

export default AppShell;