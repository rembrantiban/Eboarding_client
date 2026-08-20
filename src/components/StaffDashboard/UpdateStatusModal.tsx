"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, ClipboardCheck } from "lucide-react";
import type { MaintenanceRequest } from "@/store/useMaintenanceStore";

type MaintenanceStatus = "Completed";

interface UpdateStatusModalProps {
    open: boolean;
    request: MaintenanceRequest | null;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (id: number, status: MaintenanceStatus, remarks?: string) => void | Promise<void>;
}

export default function UpdateStatusModal({
    open,
    request,
    loading = false,
    onClose,
    onSubmit,
}: UpdateStatusModalProps) {
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (open)
         //eslint-disable-next-line
        setRemarks("");
    }, [open, request]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open || !request) return null;

    const alreadyCompleted = request.status === "Completed";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-[3px] animate-in fade-in duration-150"
                onClick={onClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <ClipboardCheck className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
                                Update Status
                            </h3>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                {request.request_number ? `${request.request_number} · ` : ""}
                                {request.title}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    {/* Request meta */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
                        <div className="flex items-center gap-x-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                                Room {request.room || request.room_number || "—"}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="truncate">{request.reporter || "Unknown"}</span>
                            <span className="text-slate-300">•</span>
                            <span className="truncate capitalize">{request.status}</span>
                        </div>
                    </div>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        New status
                    </p>

                    <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-3 ring-1 ring-emerald-200">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium leading-tight text-emerald-800">
                                Completed
                            </p>
                            <p className="mt-0.5 text-[11px] text-emerald-700/70">
                                Work is finished and verified.
                            </p>
                        </div>
                    </div>

                    {alreadyCompleted && (
                        <p className="mt-2 text-[11px] text-slate-400">
                            This request is already marked as completed.
                        </p>
                    )}

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Remarks{" "}
                        <span className="font-normal normal-case tracking-normal text-slate-400">
                            (optional)
                        </span>
                    </p>
                    <textarea
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add a short note about this update…"
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 transition focus:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={loading || alreadyCompleted}
                        onClick={() => onSubmit(request.id, "Completed", remarks.trim() || undefined)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                    >
                        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Mark as Completed
                    </button>
                </div>
            </div>
        </div>
    );
}