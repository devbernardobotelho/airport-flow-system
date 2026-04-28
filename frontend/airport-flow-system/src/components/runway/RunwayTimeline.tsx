import { motion } from "motion/react";
import { Plane, Plus, AlertTriangle } from "lucide-react";

interface RunwaySlot {
    id: string;
    runway: string;
    time: string;
    flightNumber: string | null;
    status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
    priority?: "NORMAL" | "EMERGENCY";
}

export function RunwayTimeline() {
    const runways = ["RW09", "RW27"];

    const timeSlots = [
        "14:00",
        "14:15",
        "14:30",
        "14:45",
        "15:00",
        "15:15",
        "15:30",
        "15:45",
        "16:00",
    ];

    const slots: RunwaySlot[] = [
        { id: "S001", runway: "RW09", time: "14:30", flightNumber: "TAM3054", status: "RESERVED", priority: "NORMAL" },
        { id: "S002", runway: "RW09", time: "15:00", flightNumber: "TAP9876", status: "RESERVED", priority: "NORMAL" },
        { id: "S003", runway: "RW27", time: "14:45", flightNumber: "GLO1234", status: "RESERVED", priority: "EMERGENCY" },
        { id: "S004", runway: "RW27", time: "15:30", flightNumber: null, status: "AVAILABLE" },
    ];

    const getSlotForRunwayTime = (runway: string, time: string) => {
        return slots.find((slot) => slot.runway === runway && slot.time === time);
    };

    const getSlotColor = (status: RunwaySlot["status"], priority?: RunwaySlot["priority"]) => {
        if (priority === "EMERGENCY") {
            return "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
        }
        if (status === "RESERVED") {
            return "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400";
        }
        if (status === "OCCUPIED") {
            return "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
        }
        return "bg-muted border-border text-muted-foreground hover:border-primary hover:bg-primary/5";
    };

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center space-x-6 text-sm">
                    <span className="font-medium text-muted-foreground">Legenda:</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-muted border border-border rounded"></div>
                        <span>Disponível</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-300 dark:bg-blue-900/20 dark:border-blue-800 rounded"></div>
                        <span>Reservado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-300 dark:bg-red-900/20 dark:border-red-800 rounded"></div>
                        <span>Emergência</span>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="grid grid-cols-[150px_repeat(9,minmax(120px,1fr))] border-b border-border bg-muted/50">
                            <div className="px-6 py-4 font-medium text-sm">Pista</div>
                            {timeSlots.map((time) => (
                                <div key={time} className="px-4 py-4 font-medium text-sm text-center border-l border-border">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {runways.map((runway, runwayIndex) => (
                            <motion.div
                                key={runway}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: runwayIndex * 0.1 }}
                                className="grid grid-cols-[150px_repeat(9,minmax(120px,1fr))] border-b border-border last:border-b-0"
                            >
                                <div className="px-6 py-6 flex items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Plane className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-semibold">{runway}</span>
                                    </div>
                                </div>

                                {timeSlots.map((time, timeIndex) => {
                                    const slot = getSlotForRunwayTime(runway, time);
                                    const isEmergency = slot?.priority === "EMERGENCY";

                                    return (
                                        <div key={time} className="p-3 border-l border-border">
                                            {slot && slot.status !== "AVAILABLE" ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: timeIndex * 0.05 }}
                                                    className={`h-full rounded-lg border-2 p-3 ${getSlotColor(
                                                        slot.status,
                                                        slot.priority
                                                    )}`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <span className="text-xs font-medium uppercase tracking-wider">
                                                            {slot.status === "RESERVED" ? "Reservado" : "Ocupado"}
                                                        </span>
                                                        {isEmergency && (
                                                            <AlertTriangle className="w-4 h-4 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <p className="font-mono font-semibold text-sm mb-1">{slot.flightNumber}</p>
                                                    <p className="text-xs opacity-75">{time}</p>
                                                </motion.div>
                                            ) : (
                                                <button
                                                    className={`w-full h-full rounded-lg border-2 p-3 transition-all group ${getSlotColor(
                                                        "AVAILABLE"
                                                    )}`}
                                                >
                                                    <div className="flex flex-col items-center justify-center h-full opacity-50 group-hover:opacity-100">
                                                        <Plus className="w-5 h-5 mb-1" />
                                                        <span className="text-xs">Reservar</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
