import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Plane, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import api from "../../api";
import { useToast } from "../ui/useToast";
import type { Flight } from "../../types";

interface Stand {
    id: string;
    type: "GATE" | "REMOTE";
    status: "FREE" | "OCCUPIED";
    flightId: string | null;
    createdAt?: string;
    updatedAt?: string;
}

type StandAction = "release" | "reallocate" | "reserve" | null;

export function StandsManagement() {
    const [stands, setStands] = useState<Stand[]>([]);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
    const [selectedTargetStandId, setSelectedTargetStandId] = useState("");
    const [selectedFlightId, setSelectedFlightId] = useState("");
    const [modalAction, setModalAction] = useState<StandAction>(null);
    const [actionStandId, setActionStandId] = useState<string | null>(null);

    const loadStands = async () => {
        const response = await api.get<Stand[]>("/stands");
        setStands(response.data);
    };

    const loadFlights = async () => {
        const response = await api.get<Flight[]>("/flights");
        setFlights(response.data);
    };

      const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([loadStands(), loadFlights()]);
            } catch (err) {
                console.error(err);
                toast.showToast("Erro ao carregar os dados. Tente novamente.", 'error');
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [toast]);

    const freeStands = useMemo(() => stands.filter((s) => s.status === "FREE"), [stands]);
    const gateStands = useMemo(() => stands.filter((s) => s.type === "GATE"), [stands]);
    const remoteStands = useMemo(() => stands.filter((s) => s.type === "REMOTE"), [stands]);
    const flightById = useMemo(() => new Map(flights.map((flight) => [flight.id, flight])), [flights]);
    const availableFlights = useMemo(() => flights.filter((flight) => !flight.stand && ["APPROACHING"].includes(flight.status)), [flights]);

    const getStatusConfig = (status: Stand["status"]) => {
        if (status === "FREE") {
            return {
                icon: CheckCircle,
                label: "Livre",
                className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                borderClassName: "border-green-300 dark:border-green-800",
                iconColor: "text-green-600",
            };
        }

        return {
            icon: XCircle,
            label: "Ocupado",
            className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
            borderClassName: "border-gray-300 dark:border-gray-700",
            iconColor: "text-gray-600",
        };
    };

    const openReleaseModal = (stand: Stand) => {
        setSelectedStand(stand);
        setModalAction("release");
    };

    const openReallocateModal = (stand: Stand) => {
        setSelectedStand(stand);
        setSelectedTargetStandId("");
        setModalAction("reallocate");
    };

    const openReserveModal = (stand: Stand) => {
        setSelectedStand(stand);
        setSelectedFlightId(availableFlights[0]?.id ?? "");
        setModalAction("reserve");
    };

    const closeModal = () => {
        setModalAction(null);
        setSelectedStand(null);
        setSelectedTargetStandId("");
        setSelectedFlightId("");
    };

    const handleRelease = async () => {
        if (!selectedStand) return;

        setModalLoading(true);
        setActionStandId(selectedStand.id);

        try {
            await api.post(`/stands/${selectedStand.id}/release`);
            await loadStands();
        } catch (err) {
            console.error(err);
            toast.showToast("Erro ao liberar o stand.", 'error');
        } finally {
            setModalLoading(false);
            setActionStandId(null);
            closeModal();
        }
    };

    const handleReallocate = async () => {
        if (!selectedStand || !selectedTargetStandId || !selectedStand.flightId) return;

        setModalLoading(true);
        setActionStandId(selectedStand.id);

        try {
            await api.post(`/stands/${selectedStand.id}/reallocate`, {
                newStandId: selectedTargetStandId,
                flightId: selectedStand.flightId,
            });
            await loadStands();
        } catch (err) {
            console.error(err);
            toast.showToast("Erro ao realocar o voo.", 'error');
        } finally {
            setModalLoading(false);
            setActionStandId(null);
            closeModal();
        }
    };

    const handleReserve = async () => {
        if (!selectedStand || !selectedFlightId) return;

        setModalLoading(true);
        setActionStandId(selectedStand.id);

        try {
            await api.post(`/stands/${selectedStand.id}/reserve`, {
                flightId: selectedFlightId,
            });
            await Promise.all([loadStands(), loadFlights()]);
        } catch (err: unknown) {
            console.error(err);
            const message = axios.isAxiosError(err) && err.response?.status === 404 ? "Nenhum stand disponível do tipo selecionado." : "Erro ao reservar o stand.";
            toast.showToast(message, 'error');
        } finally {
            setModalLoading(false);
            setActionStandId(null);
            closeModal();
        }
    };

    const actionStand = selectedStand;
    const targetCandidates = useMemo(
        () => freeStands.filter((stand) => stand.id !== selectedStand?.id),
        [freeStands, selectedStand]
    );

    const StandCard = ({ stand, index }: { stand: Stand; index: number }) => {
        const statusConfig = getStatusConfig(stand.status);
        const Icon = statusConfig.icon;
        const runningAction = actionStandId === stand.id;
        const flight = stand.flightId ? flightById.get(stand.flightId) : undefined;
        const flightLabel = flight ? `${flight.flightNumber}${flight.Airline ? ` · ${flight.Airline.name}` : ""}` : "Sem voo";

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${stand.status === "FREE"
                        ? "bg-background hover:border-primary cursor-pointer"
                        : "bg-muted/50"
                    } ${statusConfig.borderClassName}`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`p-2.5 rounded-lg ${stand.type === "GATE" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-purple-100 dark:bg-purple-900/20"}`}
                        >
                            <MapPin className={`w-5 h-5 ${stand.type === "GATE" ? "text-blue-600" : "text-purple-600"}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{stand.id.slice(0, 8).toUpperCase()}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                {stand.type === "GATE" ? "Gate" : "Remoto"}
                            </p>
                        </div>
                    </div>
                    <Icon className={`w-6 h-6 ${statusConfig.iconColor}`} />
                </div>

                <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                        {statusConfig.label}
                    </span>
                </div>

                {stand.status === "OCCUPIED" ? (
                    <div className="space-y-2 mb-4 pb-4 border-b border-border">
                        <div className="flex items-center space-x-2">
                            <Plane className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{flightLabel}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Voo associado</p>
                    </div>
                ) : (
                    <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground italic">Disponível para atribuição</p>
                    </div>
                )}

                <div className="space-y-2">
                    {stand.status === "FREE" ? (
                        <button
                            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                            onClick={() => openReserveModal(stand)}
                        >
                            Reservar Stand
                        </button>
                    ) : (
                        <>
                            <button
                                className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
                                onClick={() => openReallocateModal(stand)}
                                disabled={runningAction}
                            >
                                {runningAction ? "Realocando..." : "Realocar Voo"}
                            </button>
                            <button
                                className="w-full px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors text-sm font-medium"
                                onClick={() => openReleaseModal(stand)}
                                disabled={runningAction}
                            >
                                {runningAction ? "Liberando..." : "Liberar Stand"}
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderModal = () => {
        if (!modalAction || !actionStand) return null;

        const standLabel = `${actionStand.id.slice(0, 8).toUpperCase()} (${actionStand.type === "GATE" ? "Gate" : "Remoto"})`;
        const flight = actionStand.flightId ? flightById.get(actionStand.flightId) : undefined;
        const flightLabel = flight ? `${flight.flightNumber}${flight.Airline ? ` · ${flight.Airline.name}` : ""}` : "Sem voo";

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModal}>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                    {modalAction === "release" && (
                        <>
                            <h2 className="text-lg font-semibold">Liberar Stand</h2>
                            <p className="text-sm text-muted-foreground">Stand: <strong>{standLabel}</strong></p>
                            <p className="text-sm text-muted-foreground">Voo: <strong>{flightLabel}</strong></p>
                            <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                <button onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancelar</button>
                                <button onClick={handleRelease} disabled={modalLoading} className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg">
                                    {modalLoading ? "Liberando..." : "Confirmar liberação"}
                                </button>
                            </div>
                        </>
                    )}

                    {modalAction === "reallocate" && (
                        <>
                            <h2 className="text-lg font-semibold">Realocar Voo</h2>
                            <p className="text-sm text-muted-foreground">Stand atual: <strong>{standLabel}</strong></p>
                            <p className="text-sm text-muted-foreground">Voo: <strong>{flightLabel}</strong></p>

                            {targetCandidates.length === 0 ? (
                                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-sm">
                                    Não há stands livres para realocar este voo no momento.
                                </div>
                            ) : (
                                <div className="space-y-4 pt-3">
                                    <div>
                                        <label className="text-sm font-medium">Stand de destino</label>
                                        <select
                                            value={selectedTargetStandId}
                                            onChange={(e) => setSelectedTargetStandId(e.target.value)}
                                            className="w-full border rounded-lg p-2 mt-2"
                                        >
                                            <option value="">Selecione um stand livre</option>
                                            {targetCandidates.map((stand) => (
                                                <option key={stand.id} value={stand.id}>
                                                    {stand.id.slice(0, 8).toUpperCase()} — {stand.type} ({stand.status})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancelar</button>
                                        <button
                                            onClick={handleReallocate}
                                            disabled={modalLoading || !selectedTargetStandId}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                        >
                                            {modalLoading ? "Realocando..." : "Confirmar realocação"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {modalAction === "reserve" && (
                        <>
                            <h2 className="text-lg font-semibold">Reservar Stand</h2>
                            <p className="text-sm text-muted-foreground">Stand: <strong>{standLabel}</strong></p>

                            {availableFlights.length === 0 ? (
                                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-sm">
                                    Não há voos disponíveis para reservar este stand no momento.
                                </div>
                            ) : (
                                <div className="space-y-4 pt-3">
                                    <div>
                                        <label className="text-sm font-medium">Voo</label>
                                        <select
                                            value={selectedFlightId}
                                            onChange={(e) => setSelectedFlightId(e.target.value)}
                                            className="w-full border rounded-lg p-2 mt-2"
                                        >
                                            <option value="">Selecione um voo</option>
                                            {availableFlights.map((flight) => (
                                                <option key={flight.id} value={flight.id}>
                                                    {flight.flightNumber} {flight.Airline ? `· ${flight.Airline.name}` : ""} ({flight.status})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button onClick={closeModal} className="px-4 py-2 border rounded-lg">Cancelar</button>
                                        <button
                                            onClick={handleReserve}
                                            disabled={modalLoading || !selectedFlightId}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                        >
                                            {modalLoading ? "Reservando..." : "Confirmar reserva"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total de Stands</p>
                    <p className="text-3xl font-bold">{stands.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Livres</p>
                    <p className="text-3xl font-bold text-green-600">{freeStands.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Ocupados</p>
                    <p className="text-3xl font-bold text-gray-600">{stands.filter((s) => s.status === "OCCUPIED").length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Taxa de Ocupação</p>
                    <p className="text-3xl font-bold text-primary">
                        {stands.length ? Math.round((stands.filter((s) => s.status === "OCCUPIED").length / stands.length) * 100) : 0}%
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-muted-foreground">Carregando stands...</div>
            ) : (
                <>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Gates (Pátio Principal)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {gateStands.map((stand, index) => (
                                <StandCard key={stand.id} stand={stand} index={index} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Posições Remotas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {remoteStands.map((stand, index) => (
                                <StandCard key={stand.id} stand={stand} index={index + gateStands.length} />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {renderModal()}
        </div>
    );
}
