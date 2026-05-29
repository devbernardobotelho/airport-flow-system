import { useEffect, useState } from "react";
import { Clock, Plane, MapPin, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import api from "../../api";
import type { Flight } from "../../types";

interface StandMetric {
  id: string;
  type: "GATE" | "REMOTE";
  status: "FREE" | "OCCUPIED";
  flightId: string | null;
}

const statusInfo = [
  {
    label: "Em Espera",
    status: "WAITING",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    label: "Em Aproximação",
    status: "APPROACHING",
    icon: Plane,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    label: "Pousados",
    status: "LANDED",
    icon: Plane,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    label: "Emergências",
    status: "EMERGENCY",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
];

export function DashboardMetrics() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [stands, setStands] = useState<StandMetric[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [flightsRes, standsRes] = await Promise.all([
          api.get<Flight[]>('/flights'),
          api.get<StandMetric[]>('/stands'),
        ]);

        setFlights(flightsRes.data);
        setStands(standsRes.data);
      } catch (error) {
        console.error('Erro ao carregar métricas do dashboard', error);
      }
    };

    void loadData();
  }, []);

  const standMetrics = {
    available: stands.filter((stand) => stand.status === 'FREE').length,
    occupied: stands.filter((stand) => stand.status === 'OCCUPIED').length,
    total: stands.length,
  };

  const metrics = statusInfo.map((item) => ({
    ...item,
    value:
      item.status === 'EMERGENCY'
        ? flights.filter((flight) => flight.priority === 'EMERGENCY').length
        : flights.filter((flight) => flight.status === item.status).length,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
              <div className={`p-3 ${metric.bgColor} rounded-lg`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Stands</p>
            <p className="text-3xl font-bold">{standMetrics.available}</p>
            <p className="text-xs text-muted-foreground mt-1">Disponíveis</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Ocupados: {standMetrics.occupied}</span>
          <span className="text-muted-foreground">Total: {standMetrics.total}</span>
        </div>
      </motion.div>
    </div>
  );
}
