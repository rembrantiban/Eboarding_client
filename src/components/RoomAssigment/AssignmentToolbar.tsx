"use client";

import { Search } from "lucide-react";
import { statusFilters } from "./Data";
import type { StatusFilter } from "./types";

interface AssignmentToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (value: StatusFilter) => void;
}

export default function AssignmentToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: AssignmentToolbarProps) {
    return (
        <div className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search boarder or room"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            <div className="flex flex-wrap gap-1.5">
                {statusFilters.map((s) => (
                    <button
                        key={s}
                        onClick={() => onStatusFilterChange(s)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            statusFilter === s
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}