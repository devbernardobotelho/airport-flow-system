import { createBrowserRouter } from "react-router";
import { AirportDashboard } from "./pages/DashboardPage";
import { AirportLayout } from "./pages/AirportLayout";
import { FlightsPage } from "./pages/FlightsPage";
import { RunwaySlotsPage } from "./pages/RunwaySlotsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AirportLayout,
    children: [
      {
        index: true,
        Component: AirportDashboard,
      },
      {
        path: 'flights',
        Component: FlightsPage,
      },
      {
        path: 'runway-slots',
        Component: RunwaySlotsPage,
      }
    ],
  },
]);
