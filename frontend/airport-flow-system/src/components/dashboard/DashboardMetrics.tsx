import { Clock, Plane, MapPin, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export function DashboardMetrics() {
  const metrics = [
    {
      label: "Em Espera",
      value: "12",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      status: "WAITING",
    },
    {
      label: "Em Aproximação",
      value: "8",
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      status: "APPROACHING",
    },
    {
      label: "Pousados",
      value: "45",
      icon: Plane,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      status: "LANDED",
    },
    {
      label: "Emergências",
      value: "2",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      status: "EMERGENCY",
    },
  ];

  const standMetrics = {
    available: 18,
    occupied: 32,
    total: 50,
  };

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
