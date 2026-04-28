import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Edit2, MapPin, Clock, AlertTriangle } from "lucide-react";

interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    status: "WAITING" | "APPROACHING" | "LANDED" | "DEPARTED";
    priority: "NORMAL" | "EMERGENCY";
    runwaySlot: string | null;
    stand: string | null;
    origin: string;
    destination: string;
    eta: string;
}

export function FlightsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [filterPriority, setFilterPriority] = useState<string>("ALL");

    const flights: Flight[] = [
        {
            id: "F001",
            flightNumber: "TAM3054",
            airline: "LATAM",
            status: "APPROACHING",
            priority: "NORMAL",
            runwaySlot: "RW09-14:30",
            stand: null,
            origin: "GRU",
            destination: "CGH",
            eta: "14:30",
        },
        {
            id: "F002",
            flightNumber: "GLO1234",
            airline: "GOL",
            status: "WAITING",
            priority: "EMERGENCY",
            runwaySlot: null,
            stand: null,
            origin: "GIG",
            destination: "CGH",
            eta: "14:45",
        },
        {
            id: "F003",
            flightNumber: "AZU5678",
            airline: "Azul",
            status: "LANDED",
            priority: "NORMAL",
            runwaySlot: "RW09-13:15",
            stand: "A12",
            origin: "VCP",
            destination: "CGH",
            eta: "13:15",
        },
        {
            id: "F004",
            flightNumber: "TAP9876",
            airline: "TAP",
            status: "APPROACHING",
            priority: "NORMAL",
            runwaySlot: "RW09-15:00",
            stand: "B05",
            origin: "LIS",
            destination: "GRU",
            eta: "15:00",
        },
    ];

    const getStatusConfig = (status: Flight["status"]) => {
        const configs = {
            WAITING: { label: "Em Espera", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
            APPROACHING: { label: "Aproximando", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
            LANDED: { label: "Pousado", className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
            DEPARTED: { label: "Decolado", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
        };
        return configs[status];
    };

    const filteredFlights = flights.filter((flight) => {
        const matchesSearch =
            flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || flight.status === filterStatus;
        const matchesPriority = filterPriority === "ALL" || flight.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="bg-card border border-border rounded-xl">

            <div className="p-6 border-b border-border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar voo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="WAITING">Em Espera</option>
                            <option value="APPROACHING">Aproximando</option>
                            <option value="LANDED">Pousados</option>
                            <option value="DEPARTED">Decolados</option>
                        </select>
                    </div>

                    <div className="relative">
                        <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="ALL">Todas as Prioridades</option>
                            <option value="NORMAL">Normal</option>
                            <option value="EMERGENCY">Emergência</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{filteredFlights.length} voos encontrados</span>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredFlights.map((flight, index) => {
                    const statusConfig = getStatusConfig(flight.status);
                    const isEmergency = flight.priority === "EMERGENCY";

                    return (
                        <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border rounded-xl p-5 hover:shadow-md transition-all ${isEmergency
                                ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/10"
                                : "border-border bg-background"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        {isEmergency && (
                                            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                                        )}
                                        <h3 className="text-lg font-semibold">{flight.flightNumber}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{flight.airline}</p>
                                </div>
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                                    {statusConfig.label}
                                </span>
                                {isEmergency && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                        EMERGÊNCIA
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Rota:</span>
                                    <span className="font-mono font-medium">
                                        {flight.origin} → {flight.destination}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">ETA:</span>
                                    <span className="font-mono">{flight.eta}</span>
                                </div>
                                {flight.runwaySlot && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Slot:</span>
                                        <span className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-mono">{flight.runwaySlot}</span>
                                        </span>
                                    </div>
                                )}
                                {flight.stand && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Stand:</span>
                                        <span className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-mono bg-muted px-2 py-0.5 rounded">{flight.stand}</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                                <button className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors">
                                    Atribuir Slot
                                </button>
                                <button className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors">
                                    Atribuir Stand
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
