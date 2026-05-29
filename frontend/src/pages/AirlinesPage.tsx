import { AirlinesManagement } from "../components/airline/AirlinesManagement";

export function AirlinesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Companhias Aéreas</h1>
                    <p className="text-muted-foreground">Gerencie as companhias e seus voos</p>
                </div>
            </div>

            <AirlinesManagement />
        </div>
    );
}
