"use client";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Receipt as ReceiptIcon,
    Printer,
    Wallet,
    CalendarClock,
    AlertCircle,
} from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import type { PaymentHistory } from "@/store/useBillingStore";
import ReceiptModal from "@/components/BoarderHistory/ReceiptModal";


function useLedgerFonts() {
    useEffect(() => {
        const id = "ledger-fonts";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
        document.head.appendChild(link);
    }, []);
}

const statusConfig: Record<
    PaymentHistory["status"],
    { text: string; bg: string; dot: string; stub: string }
> = {
    Paid: { text: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500", stub: "border-emerald-400" },
    Pending: { text: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500", stub: "border-amber-400" },
    Partial: { text: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500", stub: "border-orange-400" },
    Overdue: { text: "text-rose-700", bg: "bg-rose-50", dot: "bg-rose-500", stub: "border-rose-400" },
    Cancelled: { text: "text-stone-500", bg: "bg-stone-100", dot: "bg-stone-400", stub: "border-stone-300" },
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(value: string | null) {
    if (!value) return "";
    return new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}

function peso(n: number) {
    return `₱${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function initials(first: string, last: string) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "—";
}

function monthLabel(b: PaymentHistory) {
    const date = b.billing_month ?? b.due_date;

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
}

function paymentDateLabel(b: PaymentHistory) {
    return new Date(b.received_at).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    });
}

function yearOf(b: PaymentHistory) {
    if (b.billing_month) {
        const parts = b.billing_month.split(" ");
        const y = parts[parts.length - 1];
        if (/^\d{4}$/.test(y)) return y;
    }
    return new Date(b.due_date).getFullYear().toString();
}

function groupByYear(bills: PaymentHistory[]) {
    const groups = new Map<string, PaymentHistory[]>();
    bills.forEach((b) => {
        const y = yearOf(b);
        if (!groups.has(y)) groups.set(y, []);
        groups.get(y)!.push(b);
    });
    return [...groups.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}

export default function BillingHistoryPage() {
    useLedgerFonts();
    const navigate = useNavigate();
    const { myPaymentHistory, getMyPaymentHistory } = useBilling();
    const [search, setSearch] = useState("");
    const [activeReceipt, setActiveReceipt] = useState<PaymentHistory | null>(null);

    useEffect(() => {
        getMyPaymentHistory();
    }, [getMyPaymentHistory]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return myPaymentHistory;
        return myPaymentHistory.filter((b) => {
            const haystack = [monthLabel(b), b.billing_no, b.billing_type, b.room_number, b.bed_number]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [myPaymentHistory, search]);

    const grouped = useMemo(() => groupByYear(filtered), [filtered]);

    const totals = useMemo(() => {
        const totalPaid = myPaymentHistory.reduce((s, b) => s + Number(b.paid_amount || 0), 0);
        const totalDue = myPaymentHistory
            .filter((b) => b.status !== "Paid" && b.status !== "Cancelled")
            .reduce((s, b) => s + Number(b.balance || 0), 0);
        return { totalPaid, totalDue, count: myPaymentHistory.length };
    }, [myPaymentHistory]);

    return (
        <div className="min-h-screen bg-white px-6 py-8" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
                            Billing History
                        </h1>
                        <p className="mt-0.5 text-sm text-stone-500">Every charge, receipt, and balance on record</p>
                    </div>
                </div>

                {/* Summary stats */}
                <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-stone-200 bg-stone-900 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-stone-400">Total Paid</p>
                            <Wallet size={22} className="text-emerald-500" />
                        </div>
                        <p
                            className="mt-2.5 text-lg font-semibold text-stone-50 sm:text-xl"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            {peso(totals.totalPaid)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-900 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-stone-400">Outstanding</p>
                            <AlertCircle size={22} className="text-rose-500" />
                        </div>
                        <p
                            className="mt-2.5 text-lg font-semibold text-stone-50 sm:text-xl"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            {peso(totals.totalDue)}
                        </p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-stone-200 bg-stone-900 p-4 sm:col-span-1 sm:p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-stone-400">Billing Records</p>
                            <CalendarClock size={22} className="text-stone-400" />
                        </div>
                        <p
                            className="mt-2.5 text-lg font-semibold text-stone-50 sm:text-xl"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            {totals.count}
                        </p>
                    </div>
                </section>

                {/* Toolbar */}
                <section className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by month, receipt no., or room"
                            className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100"
                        />
                    </div>
                    <span className="text-xs text-stone-400">
                        Showing {filtered.length} of {myPaymentHistory.length} records
                    </span>
                </section>

                {/* Grouped ledger */}
                <section className="space-y-6">
                    {grouped.map(([year, yearBills]) => (
                        <div key={year}>
                            <p
                                className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-400"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                {year}
                            </p>

                            <div className="space-y-2">
                                {yearBills.map((b) => {
                                    const cfg = statusConfig[b.status];
                                    const subtitle =
                                        b.status === "Paid"
                                            ? `Paid ${formatDate(b.updated_at)}${formatTime(b.updated_at) ? " · " + formatTime(b.updated_at) : ""}`
                                            : b.status === "Cancelled"
                                              ? `Cancelled ${formatDate(b.updated_at)}`
                                              : `Due ${formatDate(b.due_date)}`;
                                    const location = b.room_number
                                        ? `Room ${b.room_number}${b.bed_number ? ` · Bed ${b.bed_number}` : ""}`
                                        : null;

                                    return (
                                        <div
                                            key={b.id}
                                            className={`flex items-stretch gap-0 overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-sm ${
                                                b.status === "Cancelled" ? "opacity-60" : ""
                                            }`}
                                        >
                                            {/* ticket-stub edge, colored by status */}
                                            <div className={`w-1.5 shrink-0 border-r-2 border-dashed ${cfg.stub}`} />

                                            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {b.avatar_url ? (
                                                        <img
                                                            src={b.avatar_url}
                                                            alt={`${b.first_name} ${b.last_name}`}
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
                                                            {initials(b.first_name, b.last_name)}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p
                                                                className="truncate text-[11px] tracking-wide text-stone-400"
                                                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                                            >
                                                                NO. {b.billing_no}
                                                            </p>
                                                            <span className="truncate text-[11px] font-medium text-stone-400">
                                                                {b.billing_type}
                                                            </span>
                                                        </div>
                                                        <p className="truncate text-sm font-medium text-stone-900">
                                                          Paid on {paymentDateLabel(b)}
                                                        </p>
                                                        <p className="truncate text-xs text-stone-500">
                                                            {subtitle}
                                                            {location && <span className="text-stone-400"> · {location}</span>}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-3">
                                                    <div className="text-right">
                                                        {b.late_fee > 0 && (
                                                            <p
                                                                className="text-xs font-medium text-rose-600"
                                                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                                            >
                                                                +{peso(b.late_fee)} late fee
                                                            </p>
                                                        )}
                                                        {b.discount > 0 && (
                                                            <p
                                                                className="text-xs font-medium text-emerald-600"
                                                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                                            >
                                                                -{peso(b.discount)} discount
                                                            </p>
                                                        )}
                                                        <p
                                                            className="text-sm font-semibold text-stone-900"
                                                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                                        >
                                                            {peso(b.total_amount)}
                                                        </p>
                                                        {b.status !== "Paid" && b.balance > 0 && b.status !== "Cancelled" && (
                                                            <p className="text-[11px] text-stone-400">
                                                                Bal {peso(b.balance)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                                        {b.status}
                                                    </span>

                                                    <button
                                                        onClick={() => setActiveReceipt(b)}
                                                        className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                                                    >
                                                        <Printer size={13} />
                                                        Receipt
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {grouped.length === 0 && (
                        <div className="rounded-2xl border border-stone-200 bg-white py-16 text-center">
                            <ReceiptIcon size={22} className="mx-auto mb-2 text-stone-300" />
                            <p className="text-sm text-stone-400">No billing records match your search.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Receipt lives in its own modal — this is the only thing that ever prints */}
            <ReceiptModal payment={activeReceipt} onClose={() => setActiveReceipt(null)} />
        </div>
    );
}