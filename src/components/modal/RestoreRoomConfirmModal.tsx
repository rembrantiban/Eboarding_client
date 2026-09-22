import type { DeletedRoom } from "@/store/useRoomStore"
import { BedDouble, Info, RotateCcw, Users, X } from "lucide-react";

interface RestoreRoomConfirmModalProps {
    room: DeletedRoom;
    onCancel: () => void;
    onConfirm: () => void;
}

const STATUS_STYLES: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    Occupied: "bg-slate-900 text-white",
    "Under Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const peso = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

const RestoreRoomConfirmModal = ({ room, onCancel, onConfirm }: RestoreRoomConfirmModalProps) => {
    const statusClass =
        STATUS_STYLES[room.status] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

    return (
        <div
            className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-xl bg-white shadow-xl"
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X size={14} />
                </button>

                <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <RotateCcw size={18} className="text-slate-700" />
                    </div>

                    <h2 className="text-[15px] font-semibold text-slate-900">Restore this room?</h2>
                    <p className="mt-1 text-[13px] text-slate-500 leading-relaxed max-w-70">
                        Are you sure you want to restore this room? It will be available again.
                    </p>

                    {/* Room summary card */}
                    <div className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 flex items-center gap-2.5 text-left">
                        <div className="h-9 w-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                            <BedDouble size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-900 text-[13px]">
                                    Room {room.room_number}
                                </span>
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass}`}
                                >
                                    {room.status}
                                </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users size={11} />
                                    {room.capacity} capacity
                                </span>
                                <span className="flex items-center gap-1">
                                    <BedDouble size={11} />
                                    {room.total_beds} beds
                                </span>
                            </div>
                            <div className="mt-1 text-[12.5px] font-semibold text-slate-900">
                                {peso(room.price_per_month)}
                                <span className="ml-0.5 text-[10.5px] font-normal text-slate-400">/mo</span>
                            </div>
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="mt-2.5 w-full rounded-lg bg-blue-50 p-2.5 flex items-start gap-2 text-left">
                        <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-700 leading-snug">
                            The room and its bed configuration will be restored to the previous state before deletion.
                        </p>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
                    <button
                        onClick={onCancel}
                        className="px-3.5 py-1.5 text-[13px] font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <RotateCcw size={13} />
                        Yes, restore room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RestoreRoomConfirmModal
