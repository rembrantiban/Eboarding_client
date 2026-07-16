"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
//import { useRoomAssignment } from "@/hooks/useRoomAssignment";

import { MOCK_ASSIGNMENTS } from "./Data";
import type { EnrichedAssignment, StatusFilter } from "./types";

import StatsCards from "./StatsCard";
import AssignmentToolbar from "./Assignmenttoolbar";
import AssignmentTable from "./AssignmentTable";
import AssignmentFormModal from "./AssignmentFormModal";
import AssignmentDetailsModal from "./AssignmentDetailsModal";

export default function RoomAssignmentPage() {
    const [assignments, setAssignments] = useState<EnrichedAssignment[]>(MOCK_ASSIGNMENTS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
    const [selected, setSelected] = useState<EnrichedAssignment | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
   // const [editingAssignment, setEditingAssignment] = useState<EnrichedAssignment | null>(null);

    //const { assignRoom, getAssignments } = useRoomAssignment();

    const filtered = useMemo(() => {
        return assignments.filter((a) => {
            const matchesStatus = statusFilter === "All" || a.status === statusFilter;
            const matchesSearch =
                search.trim() === "" ||
                a.user_name.toLowerCase().includes(search.toLowerCase()) ||
                a.room_number.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [assignments, search, statusFilter]);

    const counts = useMemo(
        () => ({
            Active: assignments.filter((a) => a.status === "Active").length,
            Transferred: assignments.filter((a) => a.status === "Transferred").length,
            "Checked-Out": assignments.filter((a) => a.status === "Checked-Out").length,
        }),
        [assignments]
    );




  


    const handleCheckout = (a: EnrichedAssignment) => {
        // TODO: call your real checkout mutation here
        setAssignments((prev) =>
            prev.map((r) =>
                r.id === a.id
                    ? { ...r, status: "Checked-Out", actual_checkout: new Date().toISOString().slice(0, 10) }
                    : r
            )
        );
    };

    const handleDelete = (a: EnrichedAssignment) => {
        // TODO: call your real delete mutation here
        setAssignments((prev) => prev.filter((r) => r.id !== a.id));
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
                    onView={setSelected}
                    onCheckout={handleCheckout}
                    onDelete={handleDelete}
                />
            </div>

            <AssignmentFormModal
                open={showAssignModal}
                onClose={() => setShowAssignModal(false)}
            />


            <AssignmentDetailsModal assignment={selected} onClose={() => setSelected(null)} />
        </div>
    );
}