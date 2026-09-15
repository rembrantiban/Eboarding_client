export type ReportHistoryEntry = {
    title: string;
    type: string;
    path: string;
    date: string; // ISO timestamp
};

const STORAGE_KEY = "eb_report_history";
const MAX_ENTRIES = 200;

/** Reads the locally tracked report-generation history, newest first. */
export function getReportHistory(): ReportHistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (e): e is ReportHistoryEntry =>
                e &&
                typeof e.title === "string" &&
                typeof e.type === "string" &&
                typeof e.path === "string" &&
                typeof e.date === "string"
        );
    } catch {
        return [];
    }
}

/** Records that a report was generated/opened just now, prepending it to the history. */
export function recordReportGenerated(entry: Omit<ReportHistoryEntry, "date">): ReportHistoryEntry[] {
    const next: ReportHistoryEntry[] = [
        { ...entry, date: new Date().toISOString() },
        ...getReportHistory(),
    ].slice(0, MAX_ENTRIES);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // localStorage unavailable (private mode, quota exceeded) — tracking is best-effort
    }

    return next;
}
