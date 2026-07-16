import type { AssignmentDraft } from "./types";

export function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function emptyDraft(): AssignmentDraft {
    return {
        user_id: "",
        room_id: "",
        bed_id: "",
        assigned_date: new Date().toISOString().slice(0, 10),
        expected_checkout: "",
        remarks: "",
    };
}