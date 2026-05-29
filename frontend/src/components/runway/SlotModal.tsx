import { useEffect, useState } from "react";
import api from "../../api";
import { useToast } from "../ui/useToast";
import type { RunwaySlot } from "../../types";

export interface SlotModal {
    open: boolean,
    onClose: () => void;
    flightId: string,
    assignedSlot?: RunwaySlot | null,
}
export function SlotModal({ open, onClose, flightId, assignedSlot }: SlotModal) {
const [slots, setSlots] = useState<RunwaySlot[]>([]);
const [selected, setSelected] = useState<string>("");
const toastHook = useToast();

    useEffect(() => {
        if (open && !assignedSlot) {
            api.get("/slots").then(res => {
                const free = res.data.filter((s: { flightId: string | null; }) => !s.flightId);
                setSlots(free);

                if (free.length > 0) {
                    setSelected(free[0].id);
                }
            });
        }
    }, [open, assignedSlot]);

    const handleReserve = async () => {
        await api.post("/landings/slots", {
            slotId: selected,
            flightId
        });

        toastHook.showToast("Slot reservado com sucesso.", 'success');

        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-5">

                <h2 className="text-lg font-semibold">
                    {assignedSlot ? "Slot do Voo" : "Atribuir Slot"}
                </h2>

                {assignedSlot ? (
                    <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                            <div className="font-medium">Pista</div>
                            <div>{assignedSlot.runwayId}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <div className="font-medium">Início</div>
                            <div>{new Date(assignedSlot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <div className="font-medium">Fim</div>
                            <div>{new Date(assignedSlot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                    </div>
                ) : slots.length === 0 ? (
                    <p className="text-sm text-red-500">
                        Nenhum slot disponível. Crie um slot primeiro.
                    </p>
                ) : (
                    <select
                        value={selected}
                        onChange={e => setSelected(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        {slots.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.runwayId} • {new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </option>
                        ))}
                    </select>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancelar
                    </button>

                    {!assignedSlot && (
                        <button
                            onClick={handleReserve}
                            disabled={!selected}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                        >
                            Reservar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}