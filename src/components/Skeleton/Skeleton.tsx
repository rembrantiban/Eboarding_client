"use client";

import * as React from "react";

/* ------------------------------------------------------------------ */
/*  Keyframes — mount once, or move into globals.css and delete this   */
/* ------------------------------------------------------------------ */

export function SkeletonStyles() {
    return (
        <style>{`
            @keyframes bh-shimmer {
                100% { transform: translateX(100%); }
            }
            @keyframes bh-rise {
                from { opacity: 0; transform: translateY(4px); }
                to   { opacity: 1; transform: none; }
            }
        `}</style>
    );
}

/* ------------------------------------------------------------------ */
/*  Primitive                                                          */
/* ------------------------------------------------------------------ */

type Tone = "light" | "dark";

export function Skeleton({
    className = "",
    tone = "light",
    delay = 0,
}: {
    className?: string;
    tone?: Tone;
    /** ms — stagger rows so they don't all pulse in lockstep */
    delay?: number;
}) {
    const base = tone === "dark" ? "bg-white/10" : "bg-slate-200/70";
    const sweep = tone === "dark" ? "via-white/12" : "via-white/75";

    return (
        <div
            aria-hidden
            className={`relative overflow-hidden rounded-md ${base} ${className}`}
        >
            <div
                style={{ animationDelay: `${delay}ms` }}
                className={`absolute inset-0 -translate-x-full bg-linear-to-r from-transparent ${sweep} to-transparent motion-safe:animate-[bh-shimmer_1.6s_ease-in-out_infinite]`}
            />
        </div>
    );
}

/** Wraps a loading block: announces to screen readers, fades the group in. */
export function SkeletonGroup({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`motion-safe:animate-[bh-rise_.25s_ease-out] ${className}`}
        >
            <span className="sr-only">Loading</span>
            {children}
        </div>
    );
}

function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

/** Dark slate-900 stat cards (Total Billed, Collected, Outstanding…) */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <SkeletonGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 shadow-sm ring-1 ring-slate-900/5"
                >
                    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                    <div className="flex items-start gap-4">
                        <Skeleton tone="dark" delay={i * 90} className="h-11 w-11 shrink-0 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton tone="dark" delay={i * 90} className="h-3 w-24" />
                            <Skeleton tone="dark" delay={i * 90} className="h-6 w-20 rounded-lg" />
                            <Skeleton tone="dark" delay={i * 90} className="h-2.5 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </SkeletonGroup>
    );
}

/** Search + filter chips + action button row */
export function ToolbarSkeleton() {
    return (
        <SkeletonGroup className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-full rounded-xl sm:w-72" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28 rounded-xl" delay={80} />
                <Skeleton className="h-9 w-24 rounded-xl" delay={160} />
                <Skeleton className="h-9 w-32 rounded-xl" delay={240} />
            </div>
        </SkeletonGroup>
    );
}

export function TableSkeleton({
    rows = 8,
    cols = ["30%", "20%", "20%", "15%", "15%"],
    withAvatar = false,
}: {
    rows?: number;
    cols?: string[];
    /** first cell gets a circle + two lines — use for boarder/tenant tables */
    withAvatar?: boolean;
}) {
    return (
        <SkeletonGroup>
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                {/* header */}
                <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                    {cols.map((w, i) => (
                        <div key={i} style={{ width: w }}>
                            <Skeleton className="h-2.5 w-16 max-w-full" delay={i * 60} />
                        </div>
                    ))}
                </div>

                {/* rows */}
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: rows }).map((_, r) => (
                        <div key={r} className="flex items-center gap-4 px-4 py-3.5">
                            {cols.map((w, c) => (
                                <div key={c} style={{ width: w }} className="min-w-0">
                                    {withAvatar && c === 0 ? (
                                        <div className="flex items-center gap-3">
                                            <Skeleton
                                                className="h-9 w-9 shrink-0 rounded-full"
                                                delay={r * 70}
                                            />
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <Skeleton className="h-3 w-32 max-w-full" delay={r * 70} />
                                                <Skeleton className="h-2.5 w-20 max-w-full" delay={r * 70} />
                                            </div>
                                        </div>
                                    ) : c === cols.length - 1 ? (
                                        <Skeleton className="h-6 w-16 rounded-lg" delay={r * 70} />
                                    ) : (
                                        <Skeleton
                                            className="h-3 max-w-full"
                                            delay={r * 70}
                                            // vary width slightly so rows read as real data
                                            {...{ style: { width: `${60 + ((r * 13 + c * 7) % 35)}%` } }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                    <Skeleton className="h-2.5 w-40" />
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-7 w-7 rounded-lg" />
                        <Skeleton className="h-7 w-7 rounded-lg" delay={60} />
                        <Skeleton className="h-7 w-7 rounded-lg" delay={120} />
                    </div>
                </div>
            </div>
        </SkeletonGroup>
    );
}

/** Room cards grid — image band, title, meta chips, footer action */
export function RoomCardsSkeleton({ count = 6 }: { count?: number }) {
    return (
        <SkeletonGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="p-0 overflow-hidden">
                    <Skeleton className="h-32 w-full rounded-none" delay={i * 80} />
                    <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-24" delay={i * 80} />
                                <Skeleton className="h-2.5 w-32" delay={i * 80} />
                            </div>
                            <Skeleton className="h-5 w-16 rounded-full" delay={i * 80} />
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            <Skeleton className="h-5 w-14 rounded-full" delay={i * 80} />
                            <Skeleton className="h-5 w-20 rounded-full" delay={i * 80 + 40} />
                            <Skeleton className="h-5 w-16 rounded-full" delay={i * 80 + 80} />
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <Skeleton className="h-4 w-20" delay={i * 80} />
                            <Skeleton className="h-7 w-20 rounded-xl" delay={i * 80} />
                        </div>
                    </div>
                </Card>
            ))}
        </SkeletonGroup>
    );
}

/** Stacked list rows — billing schedule, invoices, room occupants */
export function ListSkeleton({
    rows = 5,
    trailing = true,
}: {
    rows?: number;
    /** right-aligned amount + status badge */
    trailing?: boolean;
}) {
    return (
        <SkeletonGroup className="space-y-2.5">
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" delay={i * 70} />
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <Skeleton className="h-3 w-36 max-w-full" delay={i * 70} />
                                <Skeleton className="h-2.5 w-24 max-w-full" delay={i * 70} />
                            </div>
                        </div>
                        {trailing && (
                            <div className="shrink-0 space-y-1.5 text-right">
                                <Skeleton className="ml-auto h-3.5 w-16" delay={i * 70} />
                                <Skeleton className="ml-auto h-4 w-14 rounded-full" delay={i * 70} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </SkeletonGroup>
    );
}

/** Empty-ish card with heading placeholder — wrap any custom body */
export function CardSkeleton({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={className}>
            <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-44" />
            </div>
            <div className="mt-4">{children}</div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/*  Page-level composites                                              */
/* ------------------------------------------------------------------ */

export function BillingPageSkeleton() {
    return (
        <div className="space-y-2">
            <SkeletonGroup className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-2.5 w-64 max-w-full" />
            </SkeletonGroup>

            <StatCardsSkeleton count={4} />
            <ToolbarSkeleton />
            <TableSkeleton
                rows={8}
                withAvatar
                cols={["30%", "14%", "16%", "16%", "14%", "10%"]}
            />
        </div>
    );
}

export function RoomPageSkeleton({
    view = "grid",
}: {
    view?: "grid" | "table";
}) {
    return (
        <div className="space-y-2">
            <SkeletonGroup className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2.5 w-56 max-w-full" />
            </SkeletonGroup>

            <StatCardsSkeleton count={4} />
            <ToolbarSkeleton />

            {view === "grid" ? (
                <RoomCardsSkeleton count={6} />
            ) : (
                <TableSkeleton
                    rows={8}
                    cols={["20%", "18%", "18%", "16%", "16%", "12%"]}
                />
            )}
        </div>
    );
}