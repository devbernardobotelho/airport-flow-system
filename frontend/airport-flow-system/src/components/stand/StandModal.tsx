import { useState } from "react";
import axios from "axios";
import api from "../../api";
import { useToast } from "../ui/useToast";
import type { Flight } from "../../types";

export interface StandModal {
    open: boolean,
    onClose: () => void,
    flight: Flight | undefined,
    onOpenStatusModal: (flight: Flight) => void,
}
export function StandModal({ open, onClose, flight, onOpenStatusModal }: StandModal) {
    const [type, setType] = useState("GATE");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    if (!open || !flight) return null;

    const isApproaching = flight.status === "APPROACHING";

    const handleReserve = async () => {
        try {
            setLoading(true);

            await api.post("/stands/reserve", {
                type,
                flightId: flight.id
            });

            onClose();
        } catch (err: unknown) {
            console.error(err);
            const message = axios.isAxiosError(err) && err.response?.status === 404 ? "Nenhum stand disponível do tipo selecionado." : "Erro ao reservar stand";
            toast.showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold">Atribuir Stand</h2>

                {!isApproaching ? (
                    <>
                        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm">
                            Voo está em <b>{flight.status}</b><br />
                            Precisa estar <b>APPROACHING</b>.
                        </div>

                        <button
                            onClick={() => {
                                onClose();
                                onOpenStatusModal(flight);
                            }}
                            disabled={!flight.stand}
                            title={!flight.stand ? "Necessário reservar um stand antes de alterar o status" : undefined}
                            className={`w-full px-4 py-2 rounded-lg ${!flight.stand ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
                        >
                            Mudar status do voo
                        </button>
                    </>
                ) : (
                    <>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="GATE">Gate</option>
                            <option value="REMOTE">Remoto</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleReserve}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                {loading ? "Reservando..." : "Reservar"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}