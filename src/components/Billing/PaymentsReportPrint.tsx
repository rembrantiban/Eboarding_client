"use client";
import { forwardRef } from "react";
import { Home } from "lucide-react";
import type { Billing } from "@/store/useBillingStore";

interface PaymentsReportPrintProps {
    billings: Billing[];
    month?: Date;
    preparedBy?: { name: string; role?: string };
    verifiedBy?: { name: string; role?: string };
    org?: { name: string; tagline: string; code: string };
}

const ORG_DEFAULT = {
    name: "E-Boarding House",
    tagline: "A computerized boarding house management system for Ermings",
    code: "ERMS · EBH",
};

function peso(value: number | string) {
    return `₱${Number(value ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function shortDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

const DOT: Record<string, string> = {
    Paid: "bg-emerald-500",
    Partial: "bg-amber-500",
    Overdue: "bg-rose-500",
    Pending: "bg-slate-400",
    Upcoming: "bg-blue-500",
    Cancelled: "bg-slate-300",
};

const TH =
    "border-b border-slate-300 px-2 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-slate-500";
const TD = "border-b border-slate-100 px-2 py-1.5 text-[10px] align-top";

const PaymentsReportPrint = forwardRef<HTMLDivElement, PaymentsReportPrintProps>(
    function PaymentsReportPrint(
        { billings, month = new Date(), preparedBy, verifiedBy, org = ORG_DEFAULT },
        ref
    ) {
        const monthLabel = month.toLocaleDateString("en-PH", {
            month: "long",
            year: "numeric",
        });

        /* Bucketed by billing_month. If you later add a payments table with a
           real payment_date, filter on that instead for true cash-basis. */
        const rows = billings
            .filter((b) => {
                const src = b.billing_month ?? b.due_date;
                if (!src) return false;
                const d = new Date(src);
                return (
                    d.getMonth() === month.getMonth() &&
                    d.getFullYear() === month.getFullYear()
                );
            })
            .sort(
                (a, b) =>
                    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            );

        const sum = (fn: (b: Billing) => number) =>
            rows.reduce((acc, b) => acc + Number(fn(b) ?? 0), 0);

        const totalBilled = sum((b) => b.total_amount);
        const totalCollected = sum((b) => b.paid_amount);
        const totalDiscount = sum((b) => b.discount);
        const totalOutstanding = sum((b) => b.balance);
        const settledCount = rows.filter((b) => Number(b.balance) <= 0).length;
        const rate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

        return (
            <div
                ref={ref}
                className="w-full bg-white p-8 font-sans text-slate-900 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
            >
                {/* Letterhead */}
                <div className="h-1.5 w-24 rounded-sm bg-slate-900" />
                <div className="mt-3 flex items-start justify-between gap-8">
                    <div className="flex gap-2.5">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <Home className="h-4 w-4" />
                        </div>
                        <div>
                            <h1 className="font-serif text-[17px] font-bold leading-tight tracking-tight">
                                {org.name}
                            </h1>
                            <p className="mt-0.5 text-[8.5px] font-medium uppercase tracking-widest text-slate-400">
                                {org.tagline}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-emerald-800">
                            MONTHLY COLLECTION REPORT
                        </p>
                        <p className="mt-1 font-serif text-[15px] italic text-amber-700/70">
                            {monthLabel}
                        </p>
                        <p className="mt-1 text-[9px] text-slate-400">
                            Generated{" "}
                            {new Date().toLocaleDateString("en-PH", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}{" "}
                            ·{" "}
                            {new Date().toLocaleTimeString("en-PH", {
                                hour: "numeric",
                                minute: "2-digit",
                            })}{" "}
                            · {org.code}
                        </p>
                    </div>
                </div>

                <div className="mt-3 border-t border-dashed border-slate-300" />

                {/* Headline figure + summary */}
                <div className="mt-4 flex items-stretch gap-3">
                    <div className="flex-1 rounded-lg bg-emerald-50 px-4 py-3">
                        <p className="text-[8.5px] font-medium uppercase tracking-[0.14em] text-emerald-700/60">
                            Total amount to collect this month
                        </p>
                        <p className="mt-1 font-mono text-[24px] font-bold leading-none tabular-nums text-emerald-700">
                            {peso(totalCollected)}
                        </p>
                        <p className="mt-1.5 text-[9.5px] text-emerald-700/70">
                            {rate.toFixed(1)}% of {peso(totalBilled)} billed · {settledCount} of{" "}
                            {rows.length} accounts fully settled
                        </p>
                    </div>

                    <div className="grid w-[46%] grid-cols-3 gap-2">
                        {[
                            { label: "Total Billed", value: peso(totalBilled), tone: "text-slate-900" },
                            { label: "Discounts", value: peso(totalDiscount), tone: "text-slate-600" },
                            {
                                label: "Outstanding",
                                value: peso(totalOutstanding),
                                tone: totalOutstanding > 0 ? "text-rose-600" : "text-slate-400",
                            },
                        ].map((t) => (
                            <div
                                key={t.label}
                                className="rounded-lg border border-slate-200 px-3 py-2.5"
                            >
                                <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">
                                    {t.label}
                                </p>
                                <p
                                    className={`mt-1 font-mono text-[12px] font-semibold tabular-nums ${t.tone}`}
                                >
                                    {t.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ledger */}
                <p className="mt-5 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Payment Ledger
                </p>

                <table className="mt-2 w-full border-collapse">
                    <thead className="table-header-group bg-slate-50">
                        <tr>
                            <th className={`${TH} w-8 text-left`}>#</th>
                            <th className={`${TH} text-left`}>Billing No.</th>
                            <th className={`${TH} text-left`}>Boarder</th>
                            <th className={`${TH} text-left`}>Room</th>
                            <th className={`${TH} text-left`}>Due Date</th>
                            <th className={`${TH} text-right`}>Total</th>
                            <th className={`${TH} text-right`}>Discount</th>
                            <th className={`${TH} text-right`}>Paid</th>
                            <th className={`${TH} text-right`}>Balance</th>
                            <th className={`${TH} text-left`}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="border-b border-slate-100 px-2 py-8 text-center text-[10px] text-slate-400"
                                >
                                    No billing records fall within {monthLabel}.
                                </td>
                            </tr>
                        )}

                        {rows.map((b, i) => (
                            <tr key={b.id} className="break-inside-avoid">
                                <td className={`${TD} text-slate-400`}>{i + 1}</td>
                                <td className={`${TD} font-mono font-medium`}>{b.billing_no}</td>
                                <td className={`${TD} whitespace-nowrap`}>
                                    {b.first_name} {b.last_name}
                                </td>
                                <td className={`${TD} whitespace-nowrap text-slate-500`}>
                                    {b.room_number} · {b.bed_number}
                                </td>
                                <td className={`${TD} whitespace-nowrap text-slate-500`}>
                                    {shortDate(b.due_date)}
                                </td>
                                <td className={`${TD} text-right font-mono tabular-nums`}>
                                    {peso(b.total_amount)}
                                </td>
                                <td
                                    className={`${TD} text-right font-mono tabular-nums ${Number(b.discount) > 0 ? "text-emerald-600" : "text-slate-300"
                                        }`}
                                >
                                    {peso(b.discount)}
                                </td>
                                <td
                                    className={`${TD} text-right font-mono font-semibold tabular-nums`}
                                >
                                    {peso(b.paid_amount)}
                                </td>
                                <td
                                    className={`${TD} text-right font-mono tabular-nums ${Number(b.balance) > 0 ? "text-rose-600" : "text-slate-300"
                                        }`}
                                >
                                    {peso(b.balance)}
                                </td>
                                <td className={`${TD} whitespace-nowrap`}>
                                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${DOT[b.status] ?? DOT.Pending
                                                }`}
                                        />
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {rows.length > 0 && (
                        <tfoot>
                            <tr className="break-inside-avoid">
                                <td
                                    colSpan={5}
                                    className="border-t-2 border-slate-900 px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                                >
                                    Totals — {rows.length} record{rows.length === 1 ? "" : "s"}
                                </td>
                                <td className="border-t-2 border-slate-900 px-2 py-2 text-right font-mono text-[11px] font-bold tabular-nums">
                                    {peso(totalBilled)}
                                </td>
                                <td className="border-t-2 border-slate-900 px-2 py-2 text-right font-mono text-[11px] font-bold tabular-nums text-emerald-600">
                                    {peso(totalDiscount)}
                                </td>
                                <td className="border-t-2 border-slate-900 bg-emerald-50 px-2 py-2 text-right font-mono text-[11px] font-bold tabular-nums text-emerald-700">
                                    {peso(totalCollected)}
                                </td>
                                <td className="border-t-2 border-slate-900 px-2 py-2 text-right font-mono text-[11px] font-bold tabular-nums text-rose-600">
                                    {peso(totalOutstanding)}
                                </td>
                                <td className="border-t-2 border-slate-900" />
                            </tr>
                        </tfoot>
                    )}
                </table>

                {/* Signatories */}
                <div className="mt-10 flex break-inside-avoid items-end justify-between gap-16">
                    {[
                        { cap: "Prepared by", who: preparedBy, fallback: "Cashier" },
                        { cap: "Verified by", who: verifiedBy, fallback: "Owner / Manager" },
                    ].map((s) => (
                        <div key={s.cap} className="w-[38%]">
                            <div className="border-b border-slate-400" />
                            <p className="mt-1.5 text-[10.5px] font-semibold">
                                {s.who?.name ?? "\u00A0"}
                            </p>
                            <p className="text-[8.5px] uppercase tracking-[0.12em] text-slate-400">
                                {s.cap} · {s.who?.role ?? s.fallback}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t-2 border-dotted border-slate-200" />
                <p className="mt-2.5 text-center text-[8.5px] leading-relaxed text-slate-400">
                    System-generated collection report for {monthLabel}. Figures reflect
                    records at time of printing. Generated by E-Boarding.
                </p>
            </div>
        );
    }
);

export default PaymentsReportPrint;