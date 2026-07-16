"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { AssignedBoarder } from "@/store/useRoomAssignmentStore";

import type { StatusFilter } from "./types";

import StatsCards from "./StatsCard";
import AssignmentToolbar from "./AssignmentToolbar";
import AssignmentTable from "./AssignmentTable";
import AssignmentFormModal from "./AssignmentFormModal";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import TransferRoomModal from "./TransferoomModal";
import CheckoutModal from "./CheckoutModal";

export default function RoomAssignmentPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [selected, setSelected] = useState<AssignedBoarder | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const { assignedBoarders, getAssignments, checkoutAssignment, loading } = useRoomAssignment();
    const [transferAssignment, setTransferAssignment] = useState<AssignedBoarder | null>(null);
    const [checkout, setCheckout] = useState<AssignedBoarder | null>(null);

    useEffect(() => {
        getAssignments();
        // eslint-disable-next-line
    }, []);

    const filtered = useMemo(() => {
        return assignedBoarders.filter((a) => {
            const matchesStatus = statusFilter === "All" || a.status === statusFilter;
            const matchesSearch =
                search.trim() === "" ||
                `${a.first_name} ${a.last_name}`
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                a.room_number
                    .toLowerCase()
                    .includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [assignedBoarders, search, statusFilter]);

    const counts = useMemo(
        () => ({
            Active: assignedBoarders.filter((a) => a.status === "Active").length,
            Transferred: assignedBoarders.filter((a) => a.status === "Transferred").length,
            "Checked-Out": assignedBoarders.filter((a) => a.status === "Checked-Out").length,
        }),
        [assignedBoarders]
    );


    const handleTransfer = (assignment: AssignedBoarder) => {
        setTransferAssignment(assignment);
    };

    const handleCheckout = (assignment: AssignedBoarder) => {
        setCheckout(assignment);
    };
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl space-y-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Room Assignments</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Assign boarders to rooms and beds, and track occupancy
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="flex w-fit items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        <Plus size={16} />
                        New Assignment
                    </button>
                </div>

                <StatsCards counts={counts} />

                <AssignmentToolbar
                    search={search}
                    onSearchChange={setSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                <AssignmentTable
                    assignments={filtered}
                    onTransfer={handleTransfer}
                    onCheckout={handleCheckout}
                />
            </div>

            <AssignmentFormModal
                open={showAssignModal}
                onClose={() => setShowAssignModal(false)}
            />


            <AssignmentDetailsModal assignment={selected} onClose={() => setSelected(null)} />
            <TransferRoomModal
                open={transferAssignment !== null}
                assignment={
                    transferAssignment
                        ? {
                            assignment_id:
                                transferAssignment.assignment_id,

                            user_id: transferAssignment.id,

                            boarder_name:
                                `${transferAssignment.first_name} ${transferAssignment.last_name}`,

                            room_number:
                                transferAssignment.room_number,

                            bed_number:
                                transferAssignment.bed_number,
                        }
                        : null
                }
                onClose={() => {
                    setTransferAssignment(null);
                    getAssignments();
                }}
            />


            <CheckoutModal
                open={checkout !== null}
                assignment={checkout}
                loading={loading}
                onClose={() => setCheckout(null)}
                onConfirm={async () => {
                    if (!checkout) return;

                    const success = await checkoutAssignment(
                        checkout.assignment_id
                    );

                    if (success) {
                        setCheckout(null);
                        getAssignments();
                    }
                }}
            />
        </div>
    );
}