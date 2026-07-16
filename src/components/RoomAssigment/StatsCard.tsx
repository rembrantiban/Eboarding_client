"use client";

import type { AssignmentStatus } from "./types";

interface StatsCardsProps {
    counts: Record<AssignmentStatus, number>;
}

const STAT_LABELS: AssignmentStatus[] = ["Active", "Transferred", "Checked-Out"];

export default function StatsCards({ counts }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {STAT_LABELS.map((s) => (
                <div key={s} className="rounded-2xl border border-slate-200 bg-slate-800 p-4">
                    <p className="text-xs font-medium text-slate-200">{s}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-100">{counts[s]}</p>
                </div>
            ))}
        </div>
    );
}