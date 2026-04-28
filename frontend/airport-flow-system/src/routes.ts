import { createBrowserRouter } from "react-router";
import { AirportDashboard } from "./pages/DashboardPage";
import { AirportLayout } from "./pages/AirportLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AirportLayout,
    children: [
      {
        index: true,
        Component: AirportDashboard,
      },
    ],
  },
]);
