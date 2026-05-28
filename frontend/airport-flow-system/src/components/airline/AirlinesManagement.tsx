import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Plane } from "lucide-react";
import api from "../../api";

interface Airline {
    id: string;
    name: string;
    code: string;
    country?: string;
    activeFlights?: number;
    totalFlights?: number;
}

export function AirlinesManagement() {
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newName, setNewName] = useState("");
    const [newCode, setNewCode] = useState("");
    const [newCountry, setNewCountry] = useState("");

    const getCountryFlag = (country: string | undefined) => {
        const flags: Record<string, string> = {
            "Brasil": "🇧🇷",
            "Portugal": "🇵🇹",
            "EUA": "🇺🇸",
            "França": "🇫🇷",
        };
        if (!country) return "🌍";
        return flags[country] || "🌍";
    };

    useEffect(() => {
        api.get("/airlines")
            .then((res) => {
                const data = (res.data as Array<{ id: string; name: string; code: string; country?: string }>).map((a) => ({
                    id: a.id,
                    name: a.name,
                    code: a.code,
                    country: a.country || "",
                    activeFlights: 0,
                    totalFlights: 0,
                }));
                setAirlines(data);
            })
            .catch((err) => console.error("Failed to load airlines", err))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newCode) return;

        try {
            const res = await api.post("/airlines", { name: newName, code: newCode });
            const created = res.data;
            const item: Airline = {
                id: created.id,
                name: created.name,
                code: created.code,
                country: newCountry || "",
                activeFlights: 0,
                totalFlights: 0,
            };
            setAirlines((s) => [item, ...s]);
            setShowModal(false);
            setNewName("");
            setNewCode("");
            setNewCountry("");
        } catch (err) {
            console.error("Erro ao criar companhia", err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Companhias Aéreas</h2>
                <button
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                    onClick={() => setShowModal(true)}
                >
                    Nova Companhia
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total de Companhias</p>
                    <p className="text-3xl font-bold">{airlines.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Voos Ativos</p>
                    <p className="text-3xl font-bold text-primary">
                        {airlines.reduce((sum, airline) => sum + (airline.activeFlights || 0), 0)}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Total de Voos (hoje)</p>
                    <p className="text-3xl font-bold">
                        {airlines.reduce((sum, airline) => sum + (airline.totalFlights || 0), 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    airlines.map((airline, index) => (
                        <motion.div
                            key={airline.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{airline.name}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <span>{getCountryFlag(airline.country)}</span>
                                            <span>{airline.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 pb-4 border-b border-border">
                                <span className="px-3 py-1 bg-muted rounded-lg font-mono font-semibold text-sm">
                                    {airline.code}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Voos Ativos</p>
                                    <div className="flex items-center space-x-2">
                                        <Plane className="w-4 h-4 text-primary" />
                                        <p className="text-lg font-bold">{airline.activeFlights || 0}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Hoje</p>
                                    <p className="text-lg font-bold">{airline.totalFlights || 0}</p>
                                </div>
                            </div>

                            <button className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
                                Ver Todos os Voos
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                    <div className="bg-card rounded-lg p-6 z-10 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Criar Nova Companhia</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Nome</label>
                                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Código (ex: TAM)</label>
                                <input value={newCode} onChange={(e) => setNewCode(e.target.value)} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">País (opcional)</label>
                                <input value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="w-full px-3 py-2 border rounded" />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
