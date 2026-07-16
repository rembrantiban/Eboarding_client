"use client";
import { CalendarDays, X, ArrowRight, DoorOpen, BedDouble } from "lucide-react";
import { useRoom } from "@/hooks/useRoom";
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import { useEffect, useState } from "react";

interface CurrentAssignment {
    assignment_id: number;
    user_id: number;
    boarder_name: string;
    room_number: string;
    bed_number: string;
}

interface TransferRoomForm {
    room_id: string;
    bed_id: string;
    transfer_date: string;
    remarks: string;
}

interface TransferRoomModalProps {
    open: boolean;
    onClose: () => void;
    assignment: CurrentAssignment | null;
}

export default function TransferRoomModal({
    open,
    onClose,
    assignment,
}: TransferRoomModalProps) {
    const { loading, transferAssignment } = useRoomAssignment();
    const { getAvailableRooms, availableRooms } = useRoom();

    const [draft, setDraft] = useState<TransferRoomForm>({
        room_id: "",
        bed_id: "",
        transfer_date: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    useEffect(() => {
        if (!open) return;

        getAvailableRooms();
        //eslint-disable-next-line
    }, [open]);

    if (!open || !assignment) return null;

    const selectedRoom = availableRooms.find(
        (room) => room.id === Number(draft.room_id)
    );

    const availableBeds = selectedRoom?.beds ?? [];

    const isSameRoom =
        draft.room_id && Number(draft.room_id) === Number(assignment.room_number);

    const handleTransfer = async () => {
        try {
            await transferAssignment({
                assignment_id: assignment.assignment_id,
                room_id: Number(draft.room_id),
                bed_id: Number(draft.bed_id),
                expected_checkout: draft.transfer_date,
                remarks: draft.remarks,
            });

            setDraft({
                room_id: "",
                bed_id: "",
                transfer_date: new Date().toISOString().split("T")[0],
                remarks: "",
            });

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Transfer Room
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Move {assignment.boarder_name} to a new room or bed
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Current -> New summary strip */}
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex flex-1 items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
                            <DoorOpen size={16} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Current
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                Room {assignment.room_number} · Bed {assignment.bed_number}
                            </p>
                        </div>
                    </div>

                    <ArrowRight size={16} className="shrink-0 text-slate-300" />

                    <div className="flex flex-1 items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
                            <BedDouble size={16} />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                New
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                {selectedRoom
                                    ? `Room ${selectedRoom.room_number}${draft.bed_id
                                        ? ` · Bed ${availableBeds.find(
                                            (b) => b.id === Number(draft.bed_id)
                                        )?.bed_number ?? ""
                                        }`
                                        : ""
                                    }`
                                    : "Not selected"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                New Room
                            </label>
                            <select
                                value={draft.room_id}
                                onChange={(e) =>
                                    setDraft({
                                        ...draft,
                                        room_id: e.target.value,
                                        bed_id: "",
                                    })
                                }
                                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select room</option>
                                {availableRooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.room_number} ({room.available_beds} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                New Bed
                            </label>
                            <select
                                value={draft.bed_id}
                                onChange={(e) => setDraft({ ...draft, bed_id: e.target.value })}
                                disabled={!draft.room_id}
                                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                <option value="">Select bed</option>
                                {availableBeds.map((bed) => (
                                    <option key={bed.id} value={bed.id}>
                                        {bed.bed_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isSameRoom && (
                        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-600">
                            This is the boarder&apos;s current room — pick a different bed to
                            continue.
                        </p>
                    )}

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Transfer Date
                        </label>
                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={draft.transfer_date}
                                onChange={(e) =>
                                    setDraft({ ...draft, transfer_date: e.target.value })
                                }
                                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Reason / Remarks{" "}
                            <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={draft.remarks}
                            onChange={(e) => setDraft({ ...draft, remarks: e.target.value })}
                            placeholder="e.g. Requested room change, maintenance issue..."
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTransfer}
                        disabled={!draft.room_id || !draft.bed_id || loading}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                        {loading ? "Transferring..." : "Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
}