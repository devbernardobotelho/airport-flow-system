import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, AlertTriangle } from "lucide-react";
import api from "../../api";
import { SlotModal } from "../runway/SlotModal";
import { StandModal } from "../stand/StandModal";
import { StatusModal } from "./StatusModal";
import type { Flight } from "../../types";

export function FlightsManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [flights, setFlights] = useState<Flight[]>([]);

    const [selectedFlight, setSelectedFlight] = useState<Flight>();

    const [slotModal, setSlotModal] = useState(false);
    const [standModal, setStandModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);

    const loadFlights = async () => {
        const res = await api.get("/flights");
        setFlights(res.data);
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get("/flights");
                setFlights(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, []);

    const getStatusConfig = (status: Flight["status"]) => {
        const configs = {
            WAITING: {
                label: "Em Espera",
                className: "bg-yellow-100 text-yellow-700"
            },
            APPROACHING: {
                label: "Aproximando",
                className: "bg-blue-100 text-blue-700"
            },
            LANDED: {
                label: "Pousado",
                className: "bg-green-100 text-green-700"
            }
        };
        return configs[status];
    };

    const filteredFlights = flights.filter((flight) =>
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-card border rounded-xl">

            <div className="p-6 border-b space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar voo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>

                <span className="text-sm text-gray-500">
                    {filteredFlights.length} voos encontrados
                </span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredFlights.map((flight, index) => {
                    const isEmergency = flight.priority === "EMERGENCY";
                    const statusConfig = getStatusConfig(flight.status);

                    return (
                        <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border rounded-xl p-5 ${isEmergency ? "border-red-300 bg-red-50" : ""
                                }`}
                        >
                            <div className="flex justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {isEmergency && (
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        )}
                                        <h3 className="font-semibold">
                                            {flight.flightNumber}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        Airline: {flight.Airline?.name}
                                    </p>
                                </div>
                            </div>

                            {/* ✅ STATUS CHIPS */}
                            <div className="flex gap-2 mb-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                                >
                                    {statusConfig.label}
                                </span>

                                {isEmergency && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        EMERGÊNCIA
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedFlight(flight);
                                        if (flight.runwaySlot) {
                                            setSlotModal(true);
                                        } else {
                                            navigate("/runway-slots");
                                        }
                                    }}
                                    className="flex-1 p-2 bg-gray-100 rounded text-xs hover:bg-gray-200"
                                >
                                    Slot
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedFlight(flight);
                                        setStandModal(true);
                                    }}
                                    disabled={flight.status !== "APPROACHING"}
                                    title={flight.status !== "APPROACHING" ? "Somente voos em Approaching podem reservar stand" : undefined}
                                    className={`flex-1 p-2 rounded text-xs ${flight.status !== "APPROACHING" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
                                >
                                    Stand
                                </button>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        setSelectedFlight(flight);
                                        setStatusModal(true);
                                    }}
                                    disabled={!flight.stand}
                                    title={!flight.stand ? "É necessário reservar um stand antes de alterar o status" : undefined}
                                    className={`flex-1 p-2 rounded text-xs ${!flight.stand ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                                >
                                    Alterar Status
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <SlotModal
                open={slotModal}
                onClose={() => {
                    setSlotModal(false);
                    loadFlights();
                }}
                flightId={selectedFlight?.id || ""}
                assignedSlot={selectedFlight?.runwaySlot}
            />

            <StandModal
                open={standModal}
                onClose={() => {
                    setStandModal(false);
                    loadFlights();
                }}
                flight={selectedFlight}
                onOpenStatusModal={(flight: Flight) => {
                    setSelectedFlight(flight);
                    setStatusModal(true);
                }}
            />

            <StatusModal
                open={statusModal}
                onClose={() => {
                    setStatusModal(false);
                    loadFlights();
                }}
                flight={selectedFlight}
            />
        </div>
    );
}