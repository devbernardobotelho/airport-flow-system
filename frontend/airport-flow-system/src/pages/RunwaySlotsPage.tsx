import { RunwayTimeline } from "../components/runway/RunwayTimeline";

export function RunwaySlotsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Runway Slots</h1>
                <p className="text-muted-foreground">Gerencie os slots de pouso e decolagem</p>
            </div>

            <RunwayTimeline />
        </div>
    );
}
