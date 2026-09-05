"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    X,
    Printer,
    Home,
    ShieldCheck,
    ReceiptText,
    UserRound,
    BedDouble,
    CalendarDays,
} from "lucide-react";
import type { PaymentHistory } from "@/store/useBillingStore";

interface OfficialReceiptModalProps {
    payment: PaymentHistory | null;
    onClose: () => void;
    orgName?: string;
    orgTagline?: string;
}

const PRINT_PAGE_STYLE = `
  @page { size: A5 portrait; margin: 10mm; }
  @media print {
    html, body { background: #fff; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

const STATUS_ACCENT: Record<
    PaymentHistory["status"],
    { badge: string; bar: string; label: string }
> = {
    Paid: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "from-emerald-600 to-emerald-500", label: "PAID IN FULL" },
    Partial: { badge: "bg-amber-50 text-amber-700 ring-amber-200", bar: "from-amber-600 to-amber-500", label: "PARTIAL PAYMENT" },
    Pending: { badge: "bg-slate-100 text-slate-600 ring-slate-200", bar: "from-slate-700 to-slate-600", label: "PENDING" },
    Overdue: { badge: "bg-rose-50 text-rose-700 ring-rose-200", bar: "from-rose-600 to-rose-500", label: "OVERDUE" },
    Cancelled: { badge: "bg-slate-100 text-slate-500 ring-slate-200", bar: "from-slate-500 to-slate-400", label: "VOIDED" },
};

function peso(value?: number | string) {
    return `₱${Number(value ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatDateTime(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return `${d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString(
        "en-PH",
        { hour: "numeric", minute: "2-digit" }
    )}`;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 text-[13px] font-semibold text-slate-900">{value}</p>
    </div>
);

const OfficialReceiptModal = ({
    payment,
    onClose,
    orgName = "E-Boarding House",
    orgTagline = "Official record of payment",
}: OfficialReceiptModalProps) => {
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: payment ? `Official-Receipt-${payment.receipt_no}` : "Official-Receipt",
        pageStyle: PRINT_PAGE_STYLE,
    });

    if (!payment) return null;

    const accent = STATUS_ACCENT[payment.status] ?? STATUS_ACCENT.Pending;

    const breakdown = [
        { label: "Room fee", value: payment.room_fee },
        { label: "Utilities", value: payment.utilities_fee },
        { label: "Other charges", value: payment.other_charges },
    ].filter((row) => Number(row.value) > 0);

    return (
        <div
            className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Official receipt ${payment.receipt_no}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 duration-200 animate-in fade-in zoom-in-95 sm:rounded-3xl"
            >
                {/* Action bar — not part of the printed receipt */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                        <ReceiptText className="h-3.5 w-3.5" />
                        Official Receipt
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handlePrint()}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[12px] font-medium text-white transition hover:bg-slate-800"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Printable receipt */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100/60 p-4 sm:p-5">
                    <div
                        ref={printRef}
                        className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                    >
                        {/* Top accent */}
                        <div className={`h-1.5 w-full bg-linear-to-r ${accent.bar}`} />

                        <div className="px-6 py-6">
                            {/* Letterhead */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                                        <Home className="h-4.5 w-4.5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[13.5px] font-semibold leading-tight tracking-tight text-slate-900">
                                            {orgName}
                                        </p>
                                        <p className="text-[10px] leading-tight text-slate-400">{orgTagline}</p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-bold tracking-wide ring-1 ring-inset ${accent.badge}`}
                                >
                                    {accent.label}
                                </span>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            {/* Receipt identity */}
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                        Receipt No.
                                    </p>
                                    <p className="mt-0.5 font-mono text-[15px] font-bold tracking-wide text-slate-900">
                                        {payment.receipt_no}
                                    </p>
                                </div>
                                <p className="shrink-0 text-[11px] text-slate-400">{formatDateTime(payment.received_at)}</p>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-1.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                        <UserRound className="h-3 w-3" />
                                        Received From
                                    </p>
                                    <p className="truncate text-[13px] font-semibold text-slate-900">
                                        {payment.boarder_first_name} {payment.boarder_last_name}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                        <BedDouble className="h-3 w-3 text-slate-400" />
                                        Room {payment.room_number || "—"}
                                        {payment.bed_number ? ` · Bed ${payment.bed_number}` : ""}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                        <ShieldCheck className="h-3 w-3" />
                                        Received By
                                    </p>
                                    <p className="truncate text-[13px] font-semibold text-slate-900">
                                        {payment.first_name} {payment.last_name}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                        <CalendarDays className="h-3 w-3 text-slate-400" />
                                        {formatDate(payment.received_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            {/* Billing meta */}
                            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50/80 p-3.5">
                                <InfoRow label="Billing No." value={payment.billing_no} />
                                <InfoRow label="Type" value={payment.billing_type} />
                                <InfoRow label="Due Date" value={formatDate(payment.due_date)} />
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            {/* Breakdown */}
                            <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                Charges
                            </p>
                            <div className="space-y-1.5">
                                {breakdown.map((row) => (
                                    <div key={row.label} className="flex items-center justify-between text-[13px]">
                                        <span className="text-slate-600">{row.label}</span>
                                        <span className="font-medium tabular-nums text-slate-900">{peso(row.value)}</span>
                                    </div>
                                ))}
                                {Number(payment.late_fee) > 0 && (
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-slate-600">Late fee</span>
                                        <span className="font-medium tabular-nums text-rose-600">
                                            +{peso(payment.late_fee)}
                                        </span>
                                    </div>
                                )}
                                {Number(payment.discount) > 0 && (
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-slate-600">Discount</span>
                                        <span className="font-medium tabular-nums text-emerald-600">
                                            -{peso(payment.discount)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="my-3 border-t border-slate-200" />

                            {/* Amount paid — the headline figure of a receipt */}
                            <div className="rounded-xl bg-slate-900 px-4 py-3.5">
                                <p className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                    Amount Received
                                </p>
                                <p className="mt-0.5 font-mono text-[22px] font-bold tabular-nums text-white">
                                    {peso(payment.amount)}
                                </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-[12px]">
                                <span className="text-slate-500">Total bill amount</span>
                                <span className="font-medium tabular-nums text-slate-900">
                                    {peso(payment.total_amount)}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[12px]">
                                <span className="text-slate-500">Amount paid to date</span>
                                <span className="font-medium tabular-nums text-slate-900">
                                    {peso(payment.paid_amount)}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[12px]">
                                <span className="font-medium text-slate-700">Remaining balance</span>
                                <span
                                    className={`font-semibold tabular-nums ${Number(payment.balance) > 0 ? "text-rose-600" : "text-emerald-600"
                                        }`}
                                >
                                    {peso(payment.balance)}
                                </span>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            <p className="text-center text-[10px] leading-relaxed text-slate-400">
                                This receipt is proof of payment for the transaction above. Please keep it for
                                your records. Generated by {orgName} Management System.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialReceiptModal;
