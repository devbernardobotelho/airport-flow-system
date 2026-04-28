import { motion } from "motion/react";
import { Building2, Plane, MoreVertical } from "lucide-react";

interface Airline {
    id: string;
    name: string;
    code: string;
    country: string;
    activeFlights: number;
    totalFlights: number;
}

export function AirlinesManagement() {
    const airlines: Airline[] = [
        { id: "AL001", name: "LATAM Airlines", code: "TAM", country: "Brasil", activeFlights: 8, totalFlights: 45 },
        { id: "AL002", name: "GOL Linhas Aéreas", code: "GLO", country: "Brasil", activeFlights: 6, totalFlights: 32 },
        { id: "AL003", name: "Azul Linhas Aéreas", code: "AZU", country: "Brasil", activeFlights: 5, totalFlights: 28 },
        { id: "AL004", name: "TAP Air Portugal", code: "TAP", country: "Portugal", activeFlights: 3, totalFlights: 12 },
        { id: "AL005", name: "American Airlines", code: "AAL", country: "EUA", activeFlights: 2, totalFlights: 8 },
        { id: "AL006", name: "Air France", code: "AFR", country: "França", activeFlights: 1, totalFlights: 5 },
    ];

    const getCountryFlag = (country: string) => {
        const flags: Record<string, string> = {
            "Brasil": "🇧🇷",
            "Portugal": "🇵🇹",
            "EUA": "🇺🇸",
            "França": "🇫🇷",
        };
        return flags[country] || "🌍";
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total de Companhias</p>
                    <p className="text-3xl font-bold">{airlines.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Voos Ativos</p>
                    <p className="text-3xl font-bold text-primary">
                        {airlines.reduce((sum, airline) => sum + airline.activeFlights, 0)}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total de Voos (hoje)</p>
                    <p className="text-3xl font-bold">
                        {airlines.reduce((sum, airline) => sum + airline.totalFlights, 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {airlines.map((airline, index) => (
                    <motion.div
                        key={airline.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{airline.name}</h3>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <span>{getCountryFlag(airline.country)}</span>
                                        <span>{airline.country}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="mb-4 pb-4 border-b border-border">
                            <span className="px-3 py-1 bg-muted rounded-lg font-mono font-semibold text-sm">
                                {airline.code}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Voos Ativos</p>
                                <div className="flex items-center space-x-2">
                                    <Plane className="w-4 h-4 text-primary" />
                                    <p className="text-lg font-bold">{airline.activeFlights}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Hoje</p>
                                <p className="text-lg font-bold">{airline.totalFlights}</p>
                            </div>
                        </div>

                        <button className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
                            Ver Todos os Voos
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
