"use client";
import { CalendarDays, X } from "lucide-react";
import { useRoom } from "@/hooks/useRoom"
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

interface AssignRoomForm {
    user_id: string;
    room_id: string;
    bed_id: string;
    assigned_date: string;
    expected_checkout: string;
    remarks: string;
}

interface AssignRoomModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AssignmentFormModal({
    open,
    onClose,
}: AssignRoomModalProps) {

    const { loading, assignRoom } = useRoomAssignment();
    const { getAvailableRooms, availableRooms } = useRoom();
    const { availableBoarders, getAvailableBorders } = useAuth();

    const [draft, setDraft] = useState<AssignRoomForm>({
        user_id: "",
        room_id: "",
        bed_id: "",
        assigned_date: new Date().toISOString().split("T")[0],
        expected_checkout: "",
        remarks: "",
    });

    useEffect(() => {
        if (!open) return;

        getAvailableRooms();
        getAvailableBorders();
        //eslint-disable-next-line
    }, [open]);

    if (!open) return null;

    const selectedRoom = availableRooms.find(
        (room) => room.id === Number(draft.room_id)
    );

    const availableBeds = selectedRoom?.beds ?? [];

    const handleAssign = async () => {
        try {
            await assignRoom({
                user_id: Number(draft.user_id),
                room_id: Number(draft.room_id),
                bed_id: Number(draft.bed_id),
                assigned_date: draft.assigned_date,
                expected_checkout:
                    draft.expected_checkout || undefined,
                remarks: draft.remarks,
            });
            setDraft({
                user_id: "",
                room_id: "",
                bed_id: "",
                assigned_date: new Date().toISOString().split("T")[0],
                expected_checkout: "",
                remarks: "",
            });

            onClose();

        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">
                        New Room Assignment
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Boarder</label>
                        <select
                            value={draft.user_id}
                            onChange={(e) =>
                                setDraft({
                                    ...draft,
                                    user_id: e.target.value,
                                })
                            }
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            <option value="">Select boarder</option>
                            {availableBoarders.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.first_name} {b.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">Room</label>
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
                                    <option
                                        key={room.id}
                                        value={room.id}
                                    >
                                        Room {room.room_number} ({room.available_beds} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">Bed</label>
                            <select
                                value={draft.bed_id}
                                onChange={(e) => setDraft({ ...draft, bed_id: e.target.value })}
                                disabled={!draft.room_id}
                                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                <option value="">Select bed</option>
                                {availableBeds.map((bed) => (
                                    <option
                                        key={bed.id}
                                        value={bed.id}
                                    >
                                        {bed.bed_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">Assigned Date</label>
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={draft.assigned_date}
                                    onChange={(e) => setDraft({ ...draft, assigned_date: e.target.value })}
                                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                Expected Checkout <span className="font-normal text-slate-400">(optional)</span>
                            </label>
                            <input
                                type="date"
                                value={draft.expected_checkout}
                                onChange={(e) => setDraft({ ...draft, expected_checkout: e.target.value })}
                                className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Remarks <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={draft.remarks}
                            onChange={(e) => setDraft({ ...draft, remarks: e.target.value })}
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
                        onClick={handleAssign}
                        disabled={!draft.user_id || !draft.room_id || !draft.bed_id}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                        {loading ? "Saving..." : "Assign Room"}
                    </button>
                </div>
            </div>
        </div>
    );
}