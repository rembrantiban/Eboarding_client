import type { AssignmentStatus, Boarder, EnrichedAssignment, RoomOption } from "./types";

// TODO: replace with real data from useRoomAssignment() / useRoom()
export const MOCK_BOARDERS: Boarder[] = [
    { id: 101, name: "Maria Santos Cruz" },
    { id: 102, name: "Paolo Reyes" },
    { id: 103, name: "Kevin Lim Tan" },
    { id: 104, name: "Angela Fernandez" },
];

export const MOCK_ROOMS: RoomOption[] = [
    {
        id: 1,
        room_number: "204",
        beds: [
            { id: 1, label: "Bed A", occupied: true },
            { id: 2, label: "Bed B", occupied: false },
        ],
    },
    {
        id: 2,
        room_number: "205",
        beds: [
            { id: 3, label: "Bed A", occupied: false },
            { id: 4, label: "Bed B", occupied: false },
        ],
    },
    {
        id: 3,
        room_number: "301",
        beds: [
            { id: 5, label: "Bed A", occupied: true },
            { id: 6, label: "Bed B", occupied: true },
        ],
    },
];

export const MOCK_ASSIGNMENTS: EnrichedAssignment[] = [
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
];

export const statusConfig: Record<AssignmentStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Transferred: "bg-amber-50 text-amber-700 border-amber-200",
    "Checked-Out": "bg-rose-50 text-rose-700 border-rose-200",
};

export const statusFilters = ["All", "Active", "Transferred", "Checked-Out"] as const;