import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plane, Plus, AlertTriangle } from "lucide-react";
import api from "../../api";
import { useToast } from "../ui/useToast";
import type { RunwaySlot, Flight } from "../../types";

const runways = ["RW09", "RW27", "RW18", "RW36"];

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const generateTimeSlots = () => {
    const slots: string[] = [];

    for (let hour = 0; hour < 24; hour += 1) {
        for (let minute = 0; minute < 60; minute += 15) {
            slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        }
    }

    return slots;
};

export function RunwayTimeline() {
    const [slots, setSlots] = useState<RunwaySlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<RunwaySlot | null>(null);
    const [selectedFlightId, setSelectedFlightId] = useState("");
    const [reserveModalOpen, setReserveModalOpen] = useState(false);
    const [reserving, setReserving] = useState(false);
    const toast = useToast();

    const loadSlots = async () => {
        try {
            const res = await api.get("/slots");
            setSlots(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadFlights = async () => {
        try {
            const res = await api.get("/flights");
            setFlights(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await api.get("/slots");
                setSlots(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void loadInitialData();

        const loadInitialFlights = async () => {
            try {
                const res = await api.get("/flights");
                setFlights(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        void loadInitialFlights();
    }, []);

    const timeSlots = useMemo(() => generateTimeSlots(), []);

    const slotsByKey = useMemo(() => {
        return new Map(
            slots.map((slot) => [
                `${slot.runwayId}-${formatTime(slot.startTime)}`,
                slot,
            ])
        );
    }, [slots]);

    const getSlotForRunwayTime = (runway: string, time: string) => {
        return slotsByKey.get(`${runway}-${time}`);
    };

    const flightById = useMemo(() => {
        return new Map(flights.map((flight) => [flight.id, flight]));
    }, [flights]);

    const availableFlights = flights.filter((flight) => !flight.runwaySlot && flight.status === "WAITING");

    const createSlotForTime = async (runway: string, time: string) => {
        const baseDate = slots[0]
            ? new Date(slots[0].startTime)
            : new Date();
        const [hours, minutes] = time.split(":").map(Number);
        const startTime = new Date(baseDate);
        startTime.setHours(hours, minutes, 0, 0);
        const endTime = new Date(startTime.getTime() + 15 * 60 * 1000);

        const res = await api.post("/slots", {
            runwayId: runway,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        });

        return res.data as RunwaySlot;
    };

    const openReserveModal = async (slot: RunwaySlot | null, runway: string, time: string) => {
        const selected = slot ?? await createSlotForTime(runway, time);
        setSelectedSlot(selected);
        setSelectedFlightId(availableFlights[0]?.id || "");
        setReserveModalOpen(true);
    };

    const handleReserve = async () => {
        if (!selectedSlot || !selectedFlightId) return;

        try {
            setReserving(true);
            await api.post("/landings/slots", {
                slotId: selectedSlot.id,
                flightId: selectedFlightId,
            });
            toast.showToast("Slot reservado com sucesso.", 'success');
            setReserveModalOpen(false);
            setSelectedSlot(null);
            setSelectedFlightId("");
            await loadSlots();
            await loadFlights();
        } catch (err) {
            console.error(err);
            toast.showToast("Erro ao reservar slot", 'error');
        } finally {
            setReserving(false);
        }
    };

    const getSlotColor = (status: "AVAILABLE" | "RESERVED" | "OCCUPIED", emergency = false) => {
        if (emergency) {
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

    if (loading) {
        return (
            <div className="p-6 bg-card border border-border rounded-xl text-sm text-muted-foreground">
                Carregando slots de pista...
            </div>
        );
    }

    const gridTemplateColumns = `150px ${timeSlots.map(() => "minmax(120px,120px)").join(" ")}`;
    const timelineMinWidth = 150 + timeSlots.length * 120;

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

            <div className="bg-card border border-border rounded-xl overflow-x-auto max-w-full">
                <div className="min-w-max" style={{ gridTemplateColumns, minWidth: `${timelineMinWidth}px` }}>
                    <div className="grid border-b border-border bg-muted/50" style={{ gridTemplateColumns }}>
                        <div className="sticky left-0 z-30 px-6 py-4 font-medium text-sm bg-muted/50 border-r border-border">
                            Pista
                        </div>
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
                            className="grid border-b border-border last:border-b-0"
                            style={{ gridTemplateColumns }}
                        >
                            <div className="sticky left-0 z-20 px-6 py-6 flex items-center bg-card border-r border-border">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Plane className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="font-semibold">{runway}</span>
                                </div>
                            </div>

                            {timeSlots.map((time, timeIndex) => {
                                const slot = getSlotForRunwayTime(runway, time);
                                const status = slot?.flightId ? "RESERVED" : "AVAILABLE";
                                const isEmergency = false;

                                return (
                                    <div key={time} className="p-2 border-l border-border">
                                        {slot && status !== "AVAILABLE" ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: timeIndex * 0.05 }}
                                                className={`min-h-[90px] rounded-lg border-2 p-3 ${getSlotColor(status, isEmergency)}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs font-medium uppercase tracking-wider">
                                                        Reservado
                                                    </span>
                                                    {isEmergency && (
                                                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                                                    )}
                                                </div>
                                                <p className="font-mono font-semibold text-sm mb-1">{slot.flightId ? flightById.get(slot.flightId)?.flightNumber ?? slot.flightId : "Sem voo"}</p>
                                                <p className="text-xs opacity-75">{time}</p>
                                            </motion.div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openReserveModal(slot!, runway, time)}
                                                className={`min-h-[90px] w-full rounded-lg border-2 px-3 py-3 transition-all group ${getSlotColor("AVAILABLE")}`}
                                            >
                                                <div className="flex flex-col items-center justify-center h-full opacity-50 group-hover:opacity-100">
                                                    <Plus className="w-6 h-6 mb-1" />
                                                    <span className="text-sm font-medium">Reservar</span>
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

            {reserveModalOpen && selectedSlot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setReserveModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold">Reservar Slot</h2>
                        <p className="text-sm text-muted-foreground">
                            Slot: {selectedSlot.runwayId} - {formatTime(selectedSlot.startTime)}
                        </p>

                        {availableFlights.length === 0 ? (
                            <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                                Não há voos disponíveis para reservar. Crie um voo ou atualize um voo WAITING.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Selecione o voo</label>
                                <select
                                    value={selectedFlightId}
                                    onChange={(e) => setSelectedFlightId(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {availableFlights.map((flight) => (
                                        <option key={flight.id} value={flight.id}>
                                            {flight.flightNumber} - {flight.Airline?.name || "Sem Airline"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setReserveModalOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleReserve}
                                disabled={reserving || !selectedFlightId || availableFlights.length === 0}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:bg-gray-300"
                            >
                                {reserving ? "Reservando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
