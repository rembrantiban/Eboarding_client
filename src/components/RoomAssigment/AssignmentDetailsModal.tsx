"use client";

import { X } from "lucide-react";
import { statusConfig } from "./Data";
import type { EnrichedAssignment } from "./types";
import { formatDate } from "./Utils";

interface AssignmentDetailsModalProps {
    assignment: EnrichedAssignment | null;
    onClose: () => void;
}

export default function AssignmentDetailsModal({ assignment, onClose }: AssignmentDetailsModalProps) {
    if (!assignment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900">Assignment Details</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Boarder</span>
                        <span className="font-medium text-slate-900">{assignment.user_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Room / Bed</span>
                        <span className="font-medium text-slate-900">
                            Room {assignment.room_number} · {assignment.bed_label}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned Date</span>
                        <span className="text-slate-700">{formatDate(assignment.assigned_date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Expected Checkout</span>
                        <span className="text-slate-700">{formatDate(assignment.expected_checkout)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Actual Checkout</span>
                        <span className="text-slate-700">{formatDate(assignment.actual_checkout)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig[assignment.status]}`}>
                            {assignment.status}
                        </span>
                    </div>
                    {assignment.remarks && (
                        <div className="border-t border-slate-100 pt-3">
                            <p className="text-xs text-slate-400">Remarks</p>
                            <p className="mt-1 text-slate-700">{assignment.remarks}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}