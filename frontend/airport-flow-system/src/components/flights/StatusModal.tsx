import { useState } from "react";
import api from "../../api";
import { useToast } from "../ui/useToast";
import type { Flight } from "../../types";

export interface StatusModal {
    open: boolean,
    onClose: () => void,
    flight: Flight | undefined;
}
export function StatusModal({ open, onClose, flight }: StatusModal) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const getAllowedStatuses = () => {
        if (!flight) return [];
        if (flight.status === "WAITING") return ["APPROACHING"];
        if (flight.status === "APPROACHING") return ["LANDED"];
        return [];
    };

    const allowedStatuses = getAllowedStatuses();
    const selectedStatus = allowedStatuses[0] ?? "";

    if (!open || !flight) return null;

    const hasSlot = !!flight.runwaySlot;

    const handleUpdate = async () => {
        try {
            setLoading(true);

            await api.patch(`/flights/${flight.id}/status`, {
                status: selectedStatus,
            });

            toast.showToast("Status atualizado com sucesso.", 'success');
            onClose();
        } catch (err) {
            console.error(err);
            toast.showToast("Erro ao atualizar status", 'error');
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
                <h2 className="text-lg font-semibold">
                    Alterar Status - {flight.flightNumber}
                </h2>

                {allowedStatuses.length === 0 ? (
                    <div className="text-sm text-gray-500">
                        Nenhuma transição disponível.
                    </div>
                ) : selectedStatus === "APPROACHING" && !hasSlot ? (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                        Este voo não possui slot.<br />
                        Atribua um slot antes de mudar o status.
                    </div>
                ) : (
                    <>
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm">
                            Próximo status: <b>{selectedStatus}</b>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                {loading ? "Atualizando..." : "Confirmar"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}