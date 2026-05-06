import { useEffect, useState } from "react";
import api from "../../api";
import type { RunwaySlot } from "../../types";

export interface SlotModal {
    open: boolean,
    onClose: () => void;
    flightId: string,
}
export function SlotModal({ open, onClose, flightId }: SlotModal) {
const [slots, setSlots] = useState<RunwaySlot[]>([]);
const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        if (open) {
            api.get("/slots").then(res => {
                const free = res.data.filter((s: { flightId: string; }) => !s.flightId);
                setSlots(free);

                if (free.length > 0) {
                    setSelected(free[0].id);
                }
            });
        }
    }, [open]);

    const handleReserve = async () => {
        await api.post("/landings/slots", {
            slotId: selected,
            flightId
        });

        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-5">

                <h2 className="text-lg font-semibold">Atribuir Slot</h2>

                {slots.length === 0 ? (
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
                                {s.runwayId} • {new Date(s.startTime).toLocaleTimeString()}
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

                    <button
                        onClick={handleReserve}
                        disabled={!selected}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                    >
                        Reservar
                    </button>
                </div>
            </div>
        </div>
    );
}