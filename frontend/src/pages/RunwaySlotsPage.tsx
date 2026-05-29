import { RunwayTimeline } from "../components/runway/RunwayTimeline";

export function RunwaySlotsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Runway Slots</h1>
                    <p className="text-muted-foreground">Gerencie os slots de pouso e decolagem existentes</p>
                </div>
            </div>

            <RunwayTimeline />
        </div>
    );
}
