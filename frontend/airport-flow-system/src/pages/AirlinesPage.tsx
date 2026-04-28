import { Plus } from "lucide-react";
import { AirlinesManagement } from "../components/airline/AirlinesManagement";

export function AirlinesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Companhias Aéreas</h1>
                    <p className="text-muted-foreground">Gerencie as companhias e seus voos</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Nova Companhia</span>
                </button>
            </div>

            <AirlinesManagement />
        </div>
    );
}
