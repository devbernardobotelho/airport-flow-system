import { Plus } from "lucide-react";
import { FlightsManagement } from "../components/flights/FlightsManagement";

export function FlightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciamento de Voos</h1>
          <p className="text-muted-foreground">Gerencie todos os voos e suas atribuições</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Criar Voo</span>
        </button>
      </div>

      <FlightsManagement />
    </div>
  );
}
