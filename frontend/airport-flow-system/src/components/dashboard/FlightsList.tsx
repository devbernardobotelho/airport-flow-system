import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, AlertTriangle } from "lucide-react";

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  status: "WAITING" | "APPROACHING" | "LANDED";
  priority: "NORMAL" | "EMERGENCY";
  runwaySlot: string | null;
  stand: string | null;
  eta: string;
}

export function FlightsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Mock data
  const flights: Flight[] = [
    {
      id: "F001",
      flightNumber: "TAM3054",
      airline: "LATAM",
      status: "APPROACHING",
      priority: "NORMAL",
      runwaySlot: "RW09-14:30",
      stand: null,
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
      eta: "15:00",
    },
    {
      id: "F005",
      flightNumber: "AAL456",
      airline: "American",
      status: "WAITING",
      priority: "NORMAL",
      runwaySlot: null,
      stand: null,
      eta: "15:30",
    },
  ];

  const getStatusBadge = (status: Flight["status"]) => {
    const configs = {
      WAITING: { label: "Em Espera", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
      APPROACHING: { label: "Aproximando", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
      LANDED: { label: "Pousado", className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
    };
    return configs[status];
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || flight.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Voos em Tempo Real</h2>
          <span className="text-sm text-muted-foreground">{filteredFlights.length} voos</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por voo ou companhia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-muted border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">Todos</option>
              <option value="WAITING">Em Espera</option>
              <option value="APPROACHING">Aproximando</option>
              <option value="LANDED">Pousados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Voo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Companhia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Slot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ETA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredFlights.map((flight, index) => {
              const statusConfig = getStatusBadge(flight.status);
              const isEmergency = flight.priority === "EMERGENCY";

              return (
                <motion.tr
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-muted/50 transition-colors ${
                    isEmergency ? "bg-red-50 dark:bg-red-900/10" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {isEmergency && (
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2 animate-pulse" />
                      )}
                      <span className="font-medium">{flight.flightNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {flight.airline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isEmergency
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {isEmergency ? "EMERGÊNCIA" : "Normal"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {flight.runwaySlot ? (
                      <span className="text-sm font-mono">{flight.runwaySlot}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {flight.stand ? (
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {flight.stand}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {flight.eta}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
