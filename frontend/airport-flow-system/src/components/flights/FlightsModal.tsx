import { useEffect, useState } from "react";
import api from "../../api";

interface Airline {
    id: string;
    name: string;
}

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export function FlightsModal({ open, onClose }: ModalProps) {
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [airlineId, setAirlineId] = useState("");
    const [priority, setPriority] = useState("NORMAL");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            api.get("/airlines").then((res) => {
                setAirlines(res.data);

                if (res.data.length > 0) {
                    setAirlineId(res.data[0].id);
                }
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/flights", {
                airlineId,
                priority
            });

            onClose();
        } catch (err) {
            console.error(err);
            alert("Erro ao criar voo");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

                <h2 className="text-lg font-semibold">
                    Criar Voo
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm">Airline</label>

                        <select
                            value={airlineId}
                            onChange={(e) => setAirlineId(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            {airlines.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm">Priority</label>

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="NORMAL">NORMAL</option>
                            <option value="EMERGENCY">EMERGENCY</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded"
                            onClick={(() => window.location.reload())}
                        >
                            {loading ? "Criando..." : "Criar"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}