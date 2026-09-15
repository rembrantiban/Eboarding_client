"use client";

import { useBilling } from "@/hooks/useBilling";
import { usePenalty } from "@/hooks/usePenalty";
import {
    ClipboardList,
    Wallet,
    PhilippinePeso,
    TriangleAlert,
    FileText,
    CircleCheck,
    Receipt,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AllPaymentsModal from "@/components/BoarderReport/AllPaymentsModal";
import AllPenaltiesModal from "@/components/BoarderReport/AllPenaltiesModal";

const peso = (value: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

const num = (v: unknown) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
};

const STATUS_STYLE: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Partial: "bg-amber-50 text-amber-700 ring-amber-100",
    "Partially Paid": "bg-blue-50 text-blue-700 ring-blue-100",
    Waived: "bg-slate-100 text-slate-600 ring-slate-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-100",
    Outstanding: "bg-rose-50 text-rose-700 ring-rose-100",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-100",
};



const BoarderReport = () => {

    const { boarderPaymentSummary, getBoarderPaymentSummary, getMyRecentPayments, recentPayments } = useBilling();
    const { myPenaltyRecords, myPenaltyRecordsLoading, getMyPenaltyRecords } = usePenalty();
    const [allPaymentsOpen, setAllPaymentsOpen] = useState(false);
    const [allPenaltiesOpen, setAllPenaltiesOpen] = useState(false);


    useEffect(() => {
        getBoarderPaymentSummary();
        getMyRecentPayments();
        getMyPenaltyRecords();
        //eslint-disable-next-line
    }, []);

    const penaltySummary = useMemo(() => {
        const totalPenalties = myPenaltyRecords
            .filter((p) => p.status !== "Pending")
            .reduce((sum, p) => sum + num(p.amount), 0);

        const outstandingPenalties = myPenaltyRecords
            .filter((p) => p.status === "Partially Paid")
            .reduce((sum, p) => sum + Math.max(num(p.amount) - num(p.amount_paid), 0), 0);

        return { totalPenalties, outstandingPenalties };
    }, [myPenaltyRecords]);

    const recentPenalties = useMemo(
        () =>
            [...myPenaltyRecords]
                .sort(
                    (a, b) =>
                        new Date(b.penalty_date).getTime() - new Date(a.penalty_date).getTime()
                )
                .slice(0, 5),
        [myPenaltyRecords]
    );


    return (
        <div className="min-h-screen bg-slate-50/60 print:bg-white">
            <div className="mx-auto max-w-5xl space-y-3 px-4 py-6 sm:px-6 lg:py-8">

                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 via-blue-50/60 to-slate-50/40 px-5 py-5">
                    <div className="pointer-events-none absolute -right-6 -top-10 hidden h-40 w-40 rounded-full bg-slate-100/50 blur-2xl sm:block" />
                    <div className="pointer-events-none absolute right-10 top-5 hidden sm:block">
                        <FileText size={72} className="text-blue-200/70" strokeWidth={1} />
                    </div>

                    <div className="relative flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
                            <ClipboardList size={18} className="text-slate-600" />
                        </div>

                        <div>
                            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
                                Boarder Report
                            </h1>
                            <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-slate-500">
                                View and manage your payment and penalty records. Stay updated
                                with your account status.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <SummaryCard
                        tone="emerald"
                        icon={Wallet}
                        badgeIcon={PhilippinePeso }
                        title="Payment Records"
                        subtitle="View your payment history and status"
                        stats={[
                            {
                                label: "Total Payments Made",
                                value: peso(boarderPaymentSummary?.total_payments ?? 0),
                                highlight: true,
                            },
                            {
                                label: "Last Payment",
                                value: formatDate(boarderPaymentSummary?.last_payment_date),
                            },
                        ]}
                    />

                    <SummaryCard
                        tone="rose"
                        icon={TriangleAlert}
                        badgeIcon={FileText}
                        title="Penalty Records"
                        subtitle="View your penalty history and status"
                        stats={[
                            { label: "Total Penalties", value: peso(penaltySummary.totalPenalties), highlight: true },
                            { label: "Outstanding Penalties", value: peso(penaltySummary.outstandingPenalties) },
                        ]}
                    />
                </div>

             
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

                    {/* Recent payments */}
                    <Panel
                        className="lg:col-span-3"
                        icon={FileText}
                        iconTone="blue"
                        title="Recent Payments"
                        action="View All Payments"
                        onAction={() => setAllPaymentsOpen(true)}
                        footer={
                            recentPayments.length > 0
                                ? `Showing 1 to ${recentPayments.length} of ${recentPayments.length} payments`
                                : undefined
                        }
                    >
                        {recentPayments.length === 0 ? (
                            <EmptyState
                                title="No Payments Found"
                                text="You have no payment records."
                            />
                        ) : (
                            <ul className="divide-y divide-slate-100 border-t border-slate-100 px-4">
                                {recentPayments.map((p) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
                                                <Receipt size={14} className="text-blue-500" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-[12.5px] font-medium text-slate-900">
                                                    {p.description}
                                                </p>
                                                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                                    {formatDate(p.date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-col items-end gap-1">
                                            <span className="text-[12.5px] font-semibold tabular-nums text-slate-900">
                                                {peso(p.amount)}
                                            </span>
                                            <StatusBadge status={p.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Panel>

                    {/* Recent penalties */}
                    <Panel
                        className="lg:col-span-2"
                        icon={TriangleAlert}
                        iconTone="rose"
                        title="Recent Penalties"
                        action="View All Penalties"
                        onAction={() => setAllPenaltiesOpen(true)}
                        footer={
                            recentPenalties.length > 0
                                ? `Showing 1 to ${recentPenalties.length} of ${myPenaltyRecords.length} penalties`
                                : undefined
                        }
                    >
                        {myPenaltyRecordsLoading && myPenaltyRecords.length === 0 ? (
                            <div className="space-y-2 px-4 py-3">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
                                    />
                                ))}
                            </div>
                        ) : recentPenalties.length === 0 ? (
                            <EmptyState
                                title="No Penalties Found"
                                text="You have no penalty records."
                            />
                        ) : (
                            <ul className="divide-y divide-slate-100 border-t border-slate-100 px-4">
                                {recentPenalties.map((p) => {
                                    const amount = num(p.amount);
                                    const outstanding = Math.max(amount - num(p.amount_paid), 0);
                                    const active =
                                        p.status === "Pending" || p.status === "Partially Paid";

                                    return (
                                        <li
                                            key={p.penalty_id}
                                            className="flex items-center justify-between gap-3 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${active
                                                        ? "bg-amber-50 ring-amber-100"
                                                        : "bg-emerald-50 ring-emerald-100"
                                                        }`}
                                                >
                                                    {active ? (
                                                        <TriangleAlert size={14} className="text-amber-500" />
                                                    ) : (
                                                        <CircleCheck size={14} className="text-emerald-500" />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-[12.5px] font-medium text-slate-900">
                                                        {p.penalty_name ?? "Custom penalty"}
                                                    </p>
                                                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                                        {formatDate(p.penalty_date)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                <span className="text-[12.5px] font-semibold tabular-nums text-slate-900">
                                                    {peso(active ? outstanding : amount)}
                                                </span>
                                                <StatusBadge status={p.status} />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Panel>
                </div>
            </div>

            <AllPaymentsModal
                open={allPaymentsOpen}
                onClose={() => setAllPaymentsOpen(false)}
            />

            <AllPenaltiesModal
                open={allPenaltiesOpen}
                onClose={() => setAllPenaltiesOpen(false)}
            />
        </div>
    );
};

export default BoarderReport;



type IconType = React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
}>;

const TONE = {
    emerald: {
        tile: "bg-emerald-50 ring-emerald-100",
        icon: "text-emerald-600",
        value: "text-emerald-600",
        link: "text-emerald-600 hover:text-emerald-700",
    },
    rose: {
        tile: "bg-rose-50 ring-rose-100",
        icon: "text-rose-500",
        value: "text-rose-500",
        link: "text-rose-500 hover:text-rose-600",
    },
    blue: {
        tile: "bg-blue-50 ring-blue-100",
        icon: "text-blue-600",
        value: "text-blue-600",
        link: "text-blue-600 hover:text-blue-700",
    },
} as const;

function SummaryCard({
    tone,
    icon: Icon,
    badgeIcon: BadgeIcon,
    title,
    subtitle,
    stats,
}: {
    tone: keyof typeof TONE;
    icon: IconType;
    badgeIcon: IconType;
    title: string;
    subtitle: string;
    stats: { label: string; value: string; highlight?: boolean }[];
}) {
    const t = TONE[tone];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${t.tile}`}>
                        <Icon size={17} className={t.icon} />
                    </div>
                    <div>
                        <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                            {title}
                        </h2>
                        <p className="mt-0.5 text-[12px] text-slate-400">{subtitle}</p>
                    </div>
                </div>

                <div className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:flex ${t.tile}`}>
                    <BadgeIcon size={15} className={t.icon} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3.5">
                {stats.map((s) => (
                    <div key={s.label}>
                        <p className="text-[11px] text-slate-400">{s.label}</p>
                        <p
                            className={`mt-0.5 text-[15px] font-semibold tabular-nums tracking-tight ${s.highlight ? t.value : "text-slate-900"
                                }`}
                        >
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}

function Panel({
    icon: Icon,
    iconTone,
    title,
    action,
    onAction,
    footer,
    className = "",
    children,
}: {
    icon: IconType;
    iconTone: keyof typeof TONE;
    title: string;
    action: string;
    onAction: () => void;
    footer?: string;
    className?: string;
    children: React.ReactNode;
}) {
    const t = TONE[iconTone];

    return (
        <section
            className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${className}`}
        >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Icon size={15} className={t.icon} />
                    <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                        {title}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onAction}
                    className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                    {action}
                </button>
            </div>

            <div className="min-h-0 flex-1">{children}</div>

            {footer && (
                <p className="border-t border-slate-100 px-4 py-2.5 text-center text-[11.5px] text-slate-400">
                    {footer}
                </p>
            )}
        </section>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${STATUS_STYLE[status] ?? "bg-slate-50 text-slate-600 ring-slate-200"
                }`}
        >
            {status}
        </span>
    );
}

function EmptyState({ title, text }: { title: string; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-100">
                <CircleCheck size={22} className="text-emerald-500" />
            </div>
            <p className="mt-3 text-[13.5px] font-semibold text-slate-800">{title}</p>
            <p className="mt-1 text-[12px] text-slate-400">{text}</p>
        </div>
    );
}