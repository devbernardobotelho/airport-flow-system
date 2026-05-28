import { useContext } from "react";
import { ToastContext, ToastContextType } from "./ToastContext.ts";

export function useToast(): ToastContextType {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
