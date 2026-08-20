"use client";

import { useEffect, useState } from "react";
import {
    X,
    Check,
    CircleCheck,
    UserCheck,
    Wrench,
    Loader2,
    DoorOpen,
} from "lucide-react";
import type { Room } from "@/store/useRoomStore";

export type RoomStatus = "Available" | "Occupied" | "Under Maintenance";

type Props = {
    open: boolean;
    onClose: () => void;
    room: Room | null;
    loading?: boolean;
    onConfirm: (status: RoomStatus) => void | Promise<void>;
};

const STATUS_OPTIONS: {
    value: RoomStatus;
    label: string;
    description: string;
    icon: typeof CircleCheck;
    activeRing: string;
    iconWrap: string;
    dot: string;
}[] = [
    {
        value: "Available",
        label: "Available",
        description: "Open for new boarders to book.",
        icon: CircleCheck,
        activeRing: "ring-emerald-500 bg-emerald-50/50",
        iconWrap: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        dot: "bg-emerald-500",
    },
    {
        value: "Occupied",
        label: "Occupied",
        description: "Currently taken and not accepting bookings.",
        icon: UserCheck,
        activeRing: "ring-slate-900 bg-slate-50",
        iconWrap: "bg-slate-900 text-white ring-slate-900/10",
        dot: "bg-slate-900",
    },
    {
        value: "Under Maintenance",
        label: "Under Maintenance",
        description: "Temporarily unavailable while repairs are done.",
        icon: Wrench,
        activeRing: "ring-amber-500 bg-amber-50/50",
        iconWrap: "bg-amber-50 text-amber-600 ring-amber-100",
        dot: "bg-amber-500",
    },
];

const UpdateRoomStatusModal = ({
    open,
    onClose,
    room,
    loading = false,
    onConfirm,
}: Props) => {
    const [selected, setSelected] = useState<RoomStatus>("Available");

    useEffect(() => {
        if (open && room) {
            //eslint-disable-next-line
            setSelected(room.status as RoomStatus);
        }
    }, [open, room]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, loading, onClose]);

    if (!open || !room) return null;

    const current = room.status as RoomStatus;
    const unchanged = selected === current;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40"
                onClick={() => !loading && onClose()}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <DoorOpen className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[13px] font-semibold leading-tight tracking-tight text-slate-900">
                                Update Room Status
                            </h2>
                            <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                                Room {room.room_number} &middot; currently{" "}
                                <span className="font-medium text-slate-700">{current}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-2 px-5 py-4">
                    <p className="text-[11px] font-medium text-slate-600">
                        Select a new status
                    </p>

                    {STATUS_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = selected === option.value;
                        const isCurrent = current === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                disabled={loading}
                                onClick={() => setSelected(option.value)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ring-1 transition-all disabled:opacity-60 ${
                                    isActive
                                        ? `${option.activeRing} ring-[1.5px]`
                                        : "bg-white ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
                                }`}
                            >
                                <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${option.iconWrap}`}
                                >
                                    <Icon size={15} />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[12.5px] font-semibold text-slate-900">
                                            {option.label}
                                        </span>
                                        {isCurrent && (
                                            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-slate-500">
                                                Current
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                                        {option.description}
                                    </span>
                                </span>

                                <span
                                    className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all ${
                                        isActive
                                            ? `${option.dot} text-white`
                                            : "bg-white ring-1 ring-slate-200"
                                    }`}
                                    style={{ height: "18px", width: "18px" }}
                                >
                                    {isActive && <Check size={11} strokeWidth={3} />}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                    <p className="text-[10.5px] text-slate-400">
                        {unchanged ? "No changes selected" : `Changing to ${selected}`}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onConfirm(selected)}
                            disabled={loading || unchanged}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                            {loading && <Loader2 size={13} className="animate-spin" />}
                            {loading ? "Updating..." : "Update Status"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoomStatusModal;