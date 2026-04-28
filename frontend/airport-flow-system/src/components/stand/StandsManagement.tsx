import { motion } from "motion/react";
import { MapPin, Plane, CheckCircle, XCircle } from "lucide-react";

interface Stand {
    id: string;
    standNumber: string;
    type: "GATE" | "REMOTE";
    status: "FREE" | "OCCUPIED";
    flightNumber?: string;
    airline?: string;
    since?: string;
}

export function StandsManagement() {
    const stands: Stand[] = [
        { id: "ST001", standNumber: "A01", type: "GATE", status: "FREE" },
        { id: "ST002", standNumber: "A02", type: "GATE", status: "OCCUPIED", flightNumber: "TAM3054", airline: "LATAM", since: "13:45" },
        { id: "ST003", standNumber: "A03", type: "GATE", status: "FREE" },
        { id: "ST004", standNumber: "A04", type: "GATE", status: "OCCUPIED", flightNumber: "GLO1234", airline: "GOL", since: "14:20" },
        { id: "ST005", standNumber: "A12", type: "GATE", status: "OCCUPIED", flightNumber: "AZU5678", airline: "Azul", since: "13:15" },
        { id: "ST006", standNumber: "B01", type: "REMOTE", status: "FREE" },
        { id: "ST007", standNumber: "B02", type: "REMOTE", status: "FREE" },
        { id: "ST008", standNumber: "B03", type: "REMOTE", status: "OCCUPIED", flightNumber: "AAL456", airline: "American", since: "12:30" },
        { id: "ST009", standNumber: "B04", type: "REMOTE", status: "FREE" },
        { id: "ST010", standNumber: "B05", type: "REMOTE", status: "OCCUPIED", flightNumber: "TAP9876", airline: "TAP", since: "15:00" },
    ];

    const gateStands = stands.filter((s) => s.type === "GATE");
    const remoteStands = stands.filter((s) => s.type === "REMOTE");

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

    const StandCard = ({ stand, index }: { stand: Stand; index: number }) => {
        const statusConfig = getStatusConfig(stand.status);
        const Icon = statusConfig.icon;

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
                            className={`p-2.5 rounded-lg ${stand.type === "GATE" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-purple-100 dark:bg-purple-900/20"
                                }`}
                        >
                            <MapPin
                                className={`w-5 h-5 ${stand.type === "GATE" ? "text-blue-600" : "text-purple-600"
                                    }`}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{stand.standNumber}</h3>
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

                {stand.status === "OCCUPIED" && stand.flightNumber ? (
                    <div className="space-y-2 mb-4 pb-4 border-b border-border">
                        <div className="flex items-center space-x-2">
                            <Plane className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono font-semibold">{stand.flightNumber}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stand.airline}</p>
                        <p className="text-xs text-muted-foreground">Desde {stand.since}</p>
                    </div>
                ) : (
                    <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground italic">Disponível para atribuição</p>
                    </div>
                )}

                <div className="space-y-2">
                    {stand.status === "FREE" ? (
                        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                            Reservar Stand
                        </button>
                    ) : (
                        <>
                            <button className="w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium">
                                Realocar Voo
                            </button>
                            <button className="w-full px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors text-sm font-medium">
                                Liberar Stand
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
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
                    <p className="text-3xl font-bold text-green-600">
                        {stands.filter((s) => s.status === "FREE").length}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Ocupados</p>
                    <p className="text-3xl font-bold text-gray-600">
                        {stands.filter((s) => s.status === "OCCUPIED").length}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">Taxa de Ocupação</p>
                    <p className="text-3xl font-bold text-primary">
                        {Math.round((stands.filter((s) => s.status === "OCCUPIED").length / stands.length) * 100)}%
                    </p>
                </div>
            </div>

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
        </div>
    );
}
