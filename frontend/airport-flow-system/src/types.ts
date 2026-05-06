export interface RunwaySlot {
    id: string;
    runwayId: string;
    startTime: string;
    endTime: string;
    flightId: string | null;
}

export interface Stand {
    id: string;
    type: "GATE" | "REMOTE";
    flightId: string | null;
}

export interface Flight {
    id: string;
    flightNumber: string;
    status: "WAITING" | "APPROACHING" | "LANDED";
    priority: "NORMAL" | "EMERGENCY";

    Airline?: {
        id: string;
        name: string;
    };

    runwaySlot?: RunwaySlot | null;
    stand?: Stand | null;
}