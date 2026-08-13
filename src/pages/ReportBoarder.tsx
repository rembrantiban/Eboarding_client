"use client";

import {
    ClipboardList,
    Wallet,
    Receipt,
    TriangleAlert,
    FileText,
    ArrowRight,
    Download,
    CircleCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* MOCK DATA — swap these for your store/hook data                     */
/* ------------------------------------------------------------------ */

type Payment = {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: "Paid" | "Pending" | "Overdue";
    receipt_url?: string;
};

type Penalty = {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: "Settled" | "Outstanding";
};

const SUMMARY = {
    total_payments: 36000,
    last_payment_date: "2026-05-05",
    total_penalties: 0,
    outstanding_penalties: 0,
};

const PAYMENTS: Payment[] = [
    { id: 1, date: "2026-05-05", description: "Monthly Rent - May 2026", amount: 6000, status: "Paid", receipt_url: "#" },
    { id: 2, date: "2026-04-05", description: "Monthly Rent - Apr 2026", amount: 6000, status: "Paid", receipt_url: "#" },
    { id: 3, date: "2026-03-05", description: "Monthly Rent - Mar 2026", amount: 6000, status: "Paid", receipt_url: "#" },
    { id: 4, date: "2026-02-05", description: "Monthly Rent - Feb 2026", amount: 6000, status: "Paid", receipt_url: "#" },
    { id: 5, date: "2026-01-05", description: "Monthly Rent - Jan 2026", amount: 6000, status: "Paid", receipt_url: "#" },
];

const PENALTIES: Penalty[] = [];

/* ------------------------------------------------------------------ */
/* Formatters                                                          */
/* ------------------------------------------------------------------ */

const peso = (value: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(value);

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

const STATUS_STYLE: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Settled: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Pending: "bg-amber-50 text-amber-700 ring-amber-100",
    Outstanding: "bg-rose-50 text-rose-700 ring-rose-100",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-100",
};



const BoarderReport = () => {
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

                {/* ---------------------------------------------------- */}
                {/* SUMMARY CARDS                                         */}
                {/* ---------------------------------------------------- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <SummaryCard
                        tone="emerald"
                        icon={Wallet}
                        badgeIcon={Receipt}
                        title="Payment Records"
                        subtitle="View your payment history and status"
                        stats={[
                            { label: "Total Payments Made", value: peso(SUMMARY.total_payments), highlight: true },
                            { label: "Last Payment", value: formatDate(SUMMARY.last_payment_date) },
                        ]}
                        action="View Payment Records"
                        onAction={() => { }}
                    />

                    <SummaryCard
                        tone="rose"
                        icon={TriangleAlert}
                        badgeIcon={FileText}
                        title="Penalty Records"
                        subtitle="View your penalty history and status"
                        stats={[
                            { label: "Total Penalties", value: peso(SUMMARY.total_penalties), highlight: true },
                            { label: "Outstanding Penalties", value: peso(SUMMARY.outstanding_penalties) },
                        ]}
                        action="View Penalty Records"
                        onAction={() => { }}
                    />
                </div>

                {/* ---------------------------------------------------- */}
                {/* RECENT TABLES                                         */}
                {/* ---------------------------------------------------- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

                    {/* Recent payments */}
                    <Panel
                        className="lg:col-span-3"
                        icon={FileText}
                        iconTone="blue"
                        title="Recent Payments"
                        action="View All Payments"
                        onAction={() => { }}
                        footer={
                            PAYMENTS.length > 0
                                ? `Showing 1 to ${PAYMENTS.length} of ${PAYMENTS.length} payments`
                                : undefined
                        }
                    >
                        {PAYMENTS.length === 0 ? (
                            <EmptyState
                                title="No Payments Found"
                                text="You have no payment records."
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-y border-slate-100">
                                            <Th>Date</Th>
                                            <Th>Description</Th>
                                            <Th className="text-right">Amount</Th>
                                            <Th>Status</Th>
                                            <Th className="text-right">Receipt</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PAYMENTS.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                                            >
                                                <Td className="whitespace-nowrap text-slate-500">
                                                    {formatDate(p.date)}
                                                </Td>
                                                <Td className="font-medium text-slate-800">
                                                    {p.description}
                                                </Td>
                                                <Td className="whitespace-nowrap text-right font-medium tabular-nums text-slate-800">
                                                    {peso(p.amount)}
                                                </Td>
                                                <Td>
                                                    <StatusBadge status={p.status} />
                                                </Td>
                                                <Td className="text-right">
                                                    <button
                                                        type="button"
                                                        aria-label={`Download receipt for ${p.description}`}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Panel>

                    {/* Recent penalties */}
                    <Panel
                        className="lg:col-span-2"
                        icon={TriangleAlert}
                        iconTone="rose"
                        title="Recent Penalties"
                        action="View All Penalties"
                        onAction={() => { }}
                        footer={
                            PENALTIES.length > 0
                                ? `Showing 1 to ${PENALTIES.length} of ${PENALTIES.length} penalties`
                                : undefined
                        }
                    >
                        {PENALTIES.length === 0 ? (
                            <EmptyState
                                title="No Penalties Found"
                                text="You have no penalty records."
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-y border-slate-100">
                                            <Th>Date</Th>
                                            <Th>Description</Th>
                                            <Th className="text-right">Amount</Th>
                                            <Th>Status</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PENALTIES.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                                            >
                                                <Td className="whitespace-nowrap text-slate-500">
                                                    {formatDate(p.date)}
                                                </Td>
                                                <Td className="font-medium text-slate-800">
                                                    {p.description}
                                                </Td>
                                                <Td className="whitespace-nowrap text-right font-medium tabular-nums text-slate-800">
                                                    {peso(p.amount)}
                                                </Td>
                                                <Td>
                                                    <StatusBadge status={p.status} />
                                                </Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Panel>
                </div>
            </div>
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
    action,
    onAction,
}: {
    tone: keyof typeof TONE;
    icon: IconType;
    badgeIcon: IconType;
    title: string;
    subtitle: string;
    stats: { label: string; value: string; highlight?: boolean }[];
    action: string;
    onAction: () => void;
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

            <button
                type="button"
                onClick={onAction}
                className={`group mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors ${t.link}`}
            >
                {action}
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
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

function Th({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`bg-slate-50/70 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-400 ${className}`}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={`px-4 py-2.5 text-[12.5px] ${className}`}>{children}</td>;
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