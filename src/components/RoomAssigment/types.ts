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

export interface EnrichedAssignment extends RoomAssignment {
    user_name: string;
    room_number: string;
    bed_label: string;
}

export interface Boarder {
    id: number;
    name: string;
}

export interface BedOption {
    id: number;
    label: string;
    occupied: boolean;
}

export interface RoomOption {
    id: number;
    room_number: string;
    beds: BedOption[];
}

export type AssignmentStatus = EnrichedAssignment["status"];

export type StatusFilter = "All" | AssignmentStatus;

export interface AssignmentDraft {
    user_id: string;
    room_id: string;
    bed_id: string;
    assigned_date: string;
    expected_checkout: string;
    remarks: string;
}