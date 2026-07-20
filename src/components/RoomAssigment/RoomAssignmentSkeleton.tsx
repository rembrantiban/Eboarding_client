"use client";



function Shimmer({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`}
        />
    );
}

function StatsCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                    <Shimmer className="h-3.5 w-24" />
                    <Shimmer className="mt-3 h-7 w-14" />
                </div>
            ))}
        </div>
    );
}

function ToolbarSkeleton() {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Shimmer className="h-10 w-full sm:w-72" />
            <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Shimmer key={i} className="h-9 w-20 rounded-full" />
                ))}
            </div>
        </div>
    );
}

function TableSkeleton() {
    const columns = 6;
    const rows = 6;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="grid gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {Array.from({ length: columns }).map((_, i) => (
                    <Shimmer key={i} className="h-3 w-16" />
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, r) => (
                    <div
                        key={r}
                        className="grid items-center gap-4 px-5 py-4"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        <div className="flex items-center gap-3">
                            <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
                            <Shimmer className="h-3.5 w-24" />
                        </div>
                        <Shimmer className="h-3.5 w-16" />
                        <Shimmer className="h-3.5 w-12" />
                        <Shimmer className="h-5 w-20 rounded-full" />
                        <Shimmer className="h-3.5 w-20" />
                        <Shimmer className="ml-auto h-8 w-8 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RoomAssignmentSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Shimmer className="h-7 w-52" />
                        <Shimmer className="h-3.5 w-72" />
                    </div>
                    <Shimmer className="h-10 w-40 rounded-xl" />
                </div>

                <StatsCardsSkeleton />
                <ToolbarSkeleton />
                <TableSkeleton />
            </div>
        </div>
    );
}