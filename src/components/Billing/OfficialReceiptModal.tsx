"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
    X,
    Printer,
    ReceiptText,
    ShieldCheck,
    UserRound,
    BedDouble,
    CalendarDays,
} from "lucide-react";
import type { PaymentHistory } from "@/store/useBillingStore";
import { RECEIPT_MONO, TornEdge, DotRow, Barcode } from "@/components/receipt/ReceiptPrimitives";

interface OfficialReceiptModalProps {
    payment: PaymentHistory | null;
    onClose: () => void;
    orgName?: string;
    orgTagline?: string;
}

const RECEIPT_WIDTH_MM = 80;
// A fixed (rather than "auto") height is what actually makes browsers register
// this as a real custom receipt-roll paper size in the print dialog/PDF output.
const RECEIPT_HEIGHT_MM = 250;

const PRINT_PAGE_STYLE = `
  @page { size: ${RECEIPT_WIDTH_MM}mm ${RECEIPT_HEIGHT_MM}mm; margin: 0; }
  @media print {
    html, body {
      background: #fff;
      margin: 0;
    }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    /* position:fixed is relative to the page box itself, so this keeps the
       receipt centered even when the printer/driver ignores the custom
       @page size above and falls back to a larger default sheet (A4/Letter) —
       sizing the body to match the receipt and centering it inside there
       (the previous approach) only works when the fallback doesn't happen. */
    body > .max-w-md {
      position: fixed;
      inset: 0;
      margin: 0 !important;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100% !important;
    }
    .max-w-105 {
      width: ${RECEIPT_WIDTH_MM}mm;
      max-width: 100% !important;
    }
  }
`;

const STATUS_LABEL: Record<PaymentHistory["status"], string> = {
    Paid: "PAID IN FULL",
    Partial: "PARTIAL PAYMENT",
    Pending: "PENDING",
    Overdue: "OVERDUE",
    Cancelled: "VOIDED",
};

function peso(value?: number | string) {
    return `P ${Number(value ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
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

const OfficialReceiptModal = ({
    payment,
    onClose,
    orgName = "E-Boarding House",
    orgTagline = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
}: OfficialReceiptModalProps) => {
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: payment ? `Official-Receipt-${payment.receipt_no}` : "Official-Receipt",
        pageStyle: PRINT_PAGE_STYLE,
    });

    if (!payment) return null;

    const label = STATUS_LABEL[payment.status] ?? STATUS_LABEL.Pending;

    const breakdown = [
        { label: "Room fee", value: payment.room_fee },
        { label: "Utilities", value: payment.utilities_fee },
        { label: "Other charges", value: payment.other_charges },
    ].filter((row) => Number(row.value) > 0);

    return (
        <div
            className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-8 backdrop-blur-sm duration-200 animate-in fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Official receipt ${payment.receipt_no}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md duration-200 animate-in fade-in zoom-in-95"
            >
                {/* Action bar — not part of the printed receipt */}
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-300">
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
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Printable receipt */}
                <div
                    ref={printRef}
                    className="mx-auto w-full max-w-md bg-white px-4 py-8"
                    style={{ fontFamily: RECEIPT_MONO }}
                >
                    <div className="relative mx-auto max-w-105">
                        <TornEdge position="top" />

                        <div className="bg-white px-6 pb-6 pt-5">
                            {/* Letterhead */}
                            <div className="flex flex-col items-center text-center">
                                <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-slate-900">
                                    {orgName}
                                </p>
                                <p className="max-w-xs text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                    {orgTagline}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                <span>Receipt {payment.receipt_no}</span>
                                <span>{formatDateTime(payment.received_at)}</span>
                            </div>

                            <div className="my-4 border-t border-dashed border-slate-300" />

                            {/* Status stamp + headline amount */}
                            <div className="relative">
                                <div className="absolute -right-1 -top-1 -rotate-[9deg] border-[3px] border-slate-900 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900">
                                    {label}
                                </div>

                                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                    Amount received
                                </p>
                                <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
                                    {peso(payment.amount)}
                                </p>
                            </div>

                            <div className="my-4 border-t border-dashed border-slate-300" />

                            {/* Parties */}
                            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                <UserRound size={11} />
                                Received from
                            </p>
                            <p className="truncate text-[13px] font-bold text-slate-900">
                                {payment.boarder_first_name} {payment.boarder_last_name}
                            </p>

                            <div className="mt-2 space-y-0.5">
                                <DotRow
                                    label="Room"
                                    icon={<BedDouble size={11} />}
                                    value={
                                        <>
                                            {payment.room_number || "Unassigned"}
                                            {payment.bed_number ? ` · Bed ${payment.bed_number}` : ""}
                                        </>
                                    }
                                />
                                <DotRow
                                    label="Received by"
                                    icon={<ShieldCheck size={11} />}
                                    value={`${payment.first_name} ${payment.last_name}`}
                                />
                                <DotRow
                                    label="Date"
                                    icon={<CalendarDays size={11} />}
                                    value={formatDate(payment.received_at)}
                                />
                            </div>

                            <div className="my-4 border-t border-dashed border-slate-300" />

                            {/* Billing meta */}
                            <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                Billing detail
                            </p>
                            <DotRow label="Billing no." value={payment.billing_no} />
                            <DotRow label="Type" value={payment.billing_type} />
                            <DotRow label="Due date" value={formatDate(payment.due_date)} />

                            <div className="my-4 border-t border-dashed border-slate-300" />

                            {/* Charges */}
                            <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400">
                                Charges
                            </p>
                            {breakdown.map((row) => (
                                <DotRow key={row.label} label={row.label} value={peso(row.value)} />
                            ))}
                            {Number(payment.late_fee) > 0 && (
                                <DotRow label="Late fee" value={`+ ${peso(payment.late_fee)}`} />
                            )}
                            {Number(payment.discount) > 0 && (
                                <DotRow label="Discount" value={`- ${peso(payment.discount)}`} />
                            )}

                            <div className="my-4 border-t-2 border-dashed border-slate-900" />

                            {/* Totals */}
                            <DotRow label="Total bill" value={peso(payment.total_amount)} />
                            <DotRow label="Paid to date" value={peso(payment.paid_amount)} />

                            <div className="mt-3 flex items-baseline justify-between bg-slate-900 px-4 py-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                                    Remaining balance
                                </span>
                                <span className="text-xl font-bold tabular-nums text-white">
                                    {peso(payment.balance)}
                                </span>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-300" />

                            {/* Footer */}
                            <p className="text-center text-[11px] leading-relaxed text-slate-500">
                                This receipt is proof of payment for the transaction above. Please keep it
                                for your records.
                            </p>

                            <div className="mt-4 flex flex-col items-center gap-1">
                                <Barcode seed={payment.receipt_no} />
                                <p className="text-[10px] tracking-[0.2em] text-slate-400">
                                    {payment.receipt_no}
                                </p>
                            </div>

                            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.15em] text-slate-300">
                                {orgName} · thank you
                            </p>
                        </div>

                        <TornEdge position="bottom" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialReceiptModal;
