import { Outlet } from "react-router";
import { AirportSidebar } from "../components/main/SideBar";
import { AirportHeader } from "../components/main/AirportHeader";

export function AirportLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      <AirportSidebar />
      <div className="flex-1 flex flex-col">
        <AirportHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
