"use client";

import { useMemo, useState } from "react";
import {
    Search,
    BedDouble,
    DoorOpen,
    User,
    CalendarDays,
    Clock,
    Users,
} from "lucide-react";

export interface RoomAssignment {
    id: number;
    user_id: number;
    room_id: number;
    bed_id: number;
    assigned_date: string;
    expected_checkout: string | null;
    actual_checkout: string | null;
    status: "Active" | "Transferred" | "Checked-Out";
    assigned_by: number | null;
    remarks: string | null;
    created_at: string;
}

// TODO: swap for real joined data from your API, same as RoomAssignmentPage
interface EnrichedAssignment extends RoomAssignment {
    user_name: string;
    room_number: string;
    bed_label: string;
}

// TODO: replace with real data from useRoomAssignment() — history should include
// ALL past + present assignments per bed, not just the current occupant.
const MOCK_HISTORY: EnrichedAssignment[] = [
    {
        id: 1,
        user_id: 101,
        room_id: 1,
        bed_id: 1,
        user_name: "Maria Santos Cruz",
        room_number: "204",
        bed_label: "Bed A",
        assigned_date: "2026-01-10",
        expected_checkout: null,
        actual_checkout: null,
        status: "Active",
        assigned_by: 1,
        remarks: null,
        created_at: "2026-01-10T09:00:00",
    },
    {
        id: 4,
        user_id: 105,
        room_id: 1,
        bed_id: 1,
        user_name: "Jerome Villaflor",
        room_number: "204",
        bed_label: "Bed A",
        assigned_date: "2025-06-01",
        expected_checkout: "2025-12-31",
        actual_checkout: "2025-12-28",
        status: "Checked-Out",
        assigned_by: 1,
        remarks: "Graduated, moved out early.",
        created_at: "2025-06-01T09:00:00",
    },
    {
        id: 2,
        user_id: 103,
        room_id: 3,
        bed_id: 5,
        user_name: "Kevin Lim Tan",
        room_number: "301",
        bed_label: "Bed A",
        assigned_date: "2025-11-02",
        expected_checkout: "2026-07-31",
        actual_checkout: null,
        status: "Active",
        assigned_by: 1,
        remarks: "Requested ground-floor room, moved from 105 for accessibility.",
        created_at: "2025-11-02T10:30:00",
    },
    {
        id: 3,
        user_id: 104,
        room_id: 3,
        bed_id: 6,
        user_name: "Angela Fernandez",
        room_number: "301",
        bed_label: "Bed B",
        assigned_date: "2025-08-15",
        expected_checkout: "2026-06-30",
        actual_checkout: "2026-06-28",
        status: "Checked-Out",
        assigned_by: 1,
        remarks: null,
        created_at: "2025-08-15T14:00:00",
    },
    {
        id: 5,
        user_id: 106,
        room_id: 2,
        bed_id: 3,
        user_name: "Ronnel Abarquez",
        room_number: "205",
        bed_label: "Bed A",
        assigned_date: "2025-09-01",
        expected_checkout: "2026-02-28",
        actual_checkout: "2026-02-25",
        status: "Checked-Out",
        assigned_by: 1,
        remarks: null,
        created_at: "2025-09-01T09:00:00",
    },
    {
        id: 6,
        user_id: 107,
        room_id: 3,
        bed_id: 6,
        user_name: "Diane Cortez",
        room_number: "301",
        bed_label: "Bed B",
        assigned_date: "2025-02-10",
        expected_checkout: "2025-08-10",
        actual_checkout: "2025-08-05",
        status: "Transferred",
        assigned_by: 1,
        remarks: "Transferred to Room 204 to be near sibling.",
        created_at: "2025-02-10T09:00:00",
    },
];

const statusConfig = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Transferred: "bg-amber-50 text-amber-700 border-amber-200",
    "Checked-Out": "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function durationLabel(start: string, end: string | null) {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const days = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000));

    if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;
    const months = Math.round(days / 30);
    return `${months} month${months === 1 ? "" : "s"}`;
}

export default function RoomOccupancyHistoryPage() {
    const [history] = useState<EnrichedAssignment[]>(MOCK_HISTORY);
    const [search, setSearch] = useState("");
    const [roomFilter, setRoomFilter] = useState<string>("All");

    const rooms = useMemo(
        () => ["All", ...Array.from(new Set(history.map((h) => h.room_number))).sort()],
        [history]
    );

    const filtered = useMemo(() => {
        return history
            .filter((h) => {
                const matchesRoom = roomFilter === "All" || h.room_number === roomFilter;
                const matchesSearch =
                    search.trim() === "" ||
                    h.user_name.toLowerCase().includes(search.toLowerCase()) ||
                    h.room_number.toLowerCase().includes(search.toLowerCase());
                return matchesRoom && matchesSearch;
            })
            .sort((a, b) => new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime());
    }, [history, search, roomFilter]);

    const roomStats = useMemo(() => {
        if (roomFilter === "All") return null;
        const roomHistory = history.filter((h) => h.room_number === roomFilter);
        const avgDays =
            roomHistory.reduce((sum, h) => {
                const end = h.actual_checkout ? new Date(h.actual_checkout) : new Date();
                const days = (end.getTime() - new Date(h.assigned_date).getTime()) / 86_400_000;
                return sum + days;
            }, 0) / roomHistory.length;

        return {
            totalStays: roomHistory.length,
            currentlyActive: roomHistory.filter((h) => h.status === "Active").length,
            avgStay: Math.round(avgDays),
        };
    }, [history, roomFilter]);

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-4xl space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Room Occupancy History</h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Full timeline of past and current bed assignments
                    </p>
                </div>

                {/* Room stats — only shown for a specific room */}
                {roomStats && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium text-slate-500">Total Stays</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{roomStats.totalStays}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium text-slate-500">Currently Active</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{roomStats.currentlyActive}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium text-slate-500">Avg. Stay Length</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{roomStats.avgStay}d</p>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search boarder or room"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {rooms.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRoomFilter(r)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${roomFilter === r
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {r === "All" ? "All Rooms" : `Room ${r}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-4">
                    {filtered.length === 0 ? (
                        <p className="py-12 text-center text-sm text-slate-400">
                            No occupancy history matches your filters.
                        </p>
                    ) : (
                        <div className="relative space-y-0">
                            {filtered.map((h, i) => (
                                <div key={h.id} className="relative flex gap-4 px-2 py-4">

                                    {/* Timeline rail */}
                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                h.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            <User size={14} />
                                        </span>
                                        {i < filtered.length - 1 && (
                                            <span className="mt-1 w-px flex-1 bg-slate-100" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-2">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{h.user_name}</p>
                                                <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <DoorOpen size={12} className="text-slate-400" />
                                                        Room {h.room_number}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BedDouble size={12} className="text-slate-400" />
                                                        {h.bed_label}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig[h.status]}`}>
                                                {h.status}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <CalendarDays size={12} />
                                                {formatDate(h.assigned_date)} &rarr;{" "}
                                                {h.actual_checkout ? formatDate(h.actual_checkout) : "Present"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {durationLabel(h.assigned_date, h.actual_checkout)}
                                            </span>
                                        </div>

                                        {h.remarks && (
                                            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                {h.remarks}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}