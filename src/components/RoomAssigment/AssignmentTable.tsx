"use client";

import { BedDouble, DoorOpen, User } from "lucide-react";
import { statusConfig } from "./Data";
import { formatDate } from "./Utils";
import RowMenu from "./Rowmenu";
import type { AssignedBoarder } from "@/store/useRoomAssignmentStore";

interface AssignmentTableProps {
    assignments: AssignedBoarder[];
}

export default function AssignmentTable({
    assignments,
}: AssignmentTableProps) {
    return (
      <div className="overflow-visible rounded border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                            <th className="px-4 py-3">Boarder</th>
                            <th className="px-4 py-3">Room</th>
                            <th className="px-4 py-3">Bed</th>
                            <th className="hidden px-4 py-3 sm:table-cell">Assigned</th>
                            <th className="hidden px-4 py-3 lg:table-cell">Expected Checkout</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((a) => (
                            <tr key={a.id} className="border-t border-slate-100 transition hover:bg-slate-50/60">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                            <User size={14} />
                                        </span>
                                        <span className="font-medium text-slate-900">{a.first_name} {a.last_name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-1.5 text-slate-600">
                                        <DoorOpen size={14} className="text-slate-400" />
                                        Room {a.room_number}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                        <BedDouble size={12} />
                                        {a.bed_number}
                                    </span>
                                </td>
                                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                                    {formatDate(a.assigned_date)}
                                </td>
                                <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                                    {formatDate(a.expected_checkout)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig[a.status]}`}>
                                        {a.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <RowMenu
                                        assignment={a}
                                    />
                                </td>
                            </tr>
                        ))}

                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                    No assignments match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}