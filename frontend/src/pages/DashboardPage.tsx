import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { FlightsList } from "../components/dashboard/FlightsList";

export function AirportDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Visão geral das operações do aeroporto
                </p>
            </div>
            <DashboardMetrics />
            <FlightsList />
        </div>
    );
}
