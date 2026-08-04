"use client";
import { forwardRef } from "react";
import { Home, Check } from "lucide-react";
import type { Billing } from "@/store/useBillingStore";

/* Billing already carries the core fields. The extras are optional so you can
   pass them later without touching this component. */
export type BillingStatementData = Billing & {
    email?: string;
    contact_number?: string;
    student_id?: string;
    billing_type?: string;
};

interface BillingStatementPrintProps {
    billing: BillingStatementData;
    issuedAt?: Date;
    receivedBy?: {
        name: string;
        role?: string;
        id?: string;
    };
    org?: {
        name: string;
        tagline: string;
        code: string;
    };
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

function longDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

const STAMP: Record<string, { label: string; ring: string; text: string }> = {
    Paid: { label: "PAID", ring: "border-emerald-600", text: "text-emerald-700" },
    Partial: { label: "PARTIAL", ring: "border-amber-600", text: "text-amber-700" },
    Overdue: { label: "OVERDUE", ring: "border-rose-600", text: "text-rose-700" },
    Pending: { label: "UNPAID", ring: "border-slate-400", text: "text-slate-500" },
    Upcoming: { label: "UNPAID", ring: "border-slate-400", text: "text-slate-500" },
    Cancelled: { label: "VOID", ring: "border-slate-300", text: "text-slate-400" },
};

const Rule = () => <div className="my-3 border-t border-dashed border-slate-200" />;

const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400">
        {children}
    </p>
);

const BillingStatementPrint = forwardRef<HTMLDivElement, BillingStatementPrintProps>(
    function BillingStatementPrint(
        { billing, issuedAt = new Date(), receivedBy, org = ORG_DEFAULT },
        ref
    ) {
        const stamp = STAMP[billing.status] ?? STAMP.Pending;
        const settled = Number(billing.balance) <= 0;

        const roomFee =
            Number(billing.total_amount) +
            Number(billing.discount ?? 0) -
            Number(billing.late_fee ?? 0);

        return (
            <div
                ref={ref}
                className="mx-auto w-85 bg-white font-sans text-slate-900 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
            >
                {/* cap bar */}
                <div className="mx-4 h-1.5 rounded-b-sm bg-slate-900" />

                <div className="border-x border-b border-slate-200/80 px-5 pb-5 pt-4">
                    {/* Masthead */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-2.5">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                                <Home className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-serif text-[17px] font-bold leading-[1.15] tracking-tight">
                                    {org.name}
                                </h1>
                                <p className="mt-1 max-w-32.5 text-[9px] font-medium uppercase leading-normal tracking-[0.08em] text-slate-400">
                                    {org.tagline}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex h-17 w-17 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-2 ${stamp.ring} ${stamp.text}`}
                        >
                            <span className="font-mono text-[13px] font-bold tracking-[0.12em]">
                                {stamp.label}
                            </span>
                            <span className="mt-0.5 font-mono text-[7px] tracking-[0.16em] opacity-70">
                                {org.code}
                            </span>
                        </div>
                    </div>

                    <p className="mt-5 font-serif text-[13px] italic text-amber-700/70">
                        Official Billing Statement
                    </p>

                    <Rule />

                    {/* Reference */}
                    <Label>Statement No.</Label>
                    <p className="mt-1 font-mono text-[13px] font-bold tracking-tight text-emerald-800">
                        {billing.billing_no}
                    </p>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                        Issued{" "}
                        {issuedAt.toLocaleDateString("en-PH", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}{" "}
                        ·{" "}
                        {issuedAt.toLocaleTimeString("en-PH", {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </p>

                    {/* Boarder */}
                    <div className="mt-4 rounded-lg bg-slate-50 px-3.5 py-3">
                        <Label>Boarder</Label>
                        <div className="mt-1.5 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[14px] font-semibold leading-tight">
                                    {billing.first_name} {billing.last_name}
                                </p>
                                {billing.student_id && (
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        {billing.student_id}
                                    </p>
                                )}
                                {billing.email && (
                                    <p className="mt-0.5 break-all text-[11px] text-slate-500">
                                        {billing.email}
                                    </p>
                                )}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="font-mono text-[11px] font-semibold tracking-tight text-amber-700">
                                    Rm {billing.room_number} · Bed {billing.bed_number}
                                </p>
                                {billing.contact_number && (
                                    <p className="mt-1 font-mono text-[10px] text-slate-400">
                                        {billing.contact_number}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Meta triplet */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        <div>
                            <Label>Billing Type</Label>
                            <p className="mt-1 text-[12px] font-medium leading-snug">
                                {billing.billing_type ?? "Monthly Rent"}
                            </p>
                        </div>
                        <div className="text-center">
                            <Label>Period</Label>
                            <p className="mt-1 text-[12px] font-medium leading-snug">
                                {longDate(billing.billing_month)}
                            </p>
                        </div>
                        <div className="text-right">
                            <Label>Due Date</Label>
                            <p className="mt-1 text-[12px] font-medium leading-snug">
                                {longDate(billing.due_date)}
                            </p>
                        </div>
                    </div>

                    <Rule />

                    {/* Breakdown */}
                    <Label>Payment Breakdown</Label>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px]">Room fee</span>
                            <span className="font-mono text-[13px] tabular-nums">
                                {peso(roomFee)}
                            </span>
                        </div>

                        {Number(billing.late_fee ?? 0) > 0 && (
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="text-[13px]">Late payment fee</span>
                                <span className="font-mono text-[13px] tabular-nums text-rose-600">
                                    +{peso(billing.late_fee ?? 0)}
                                </span>
                            </div>
                        )}

                        {Number(billing.discount ?? 0) > 0 && (
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="text-[13px]">Discount</span>
                                <span className="font-mono text-[13px] tabular-nums text-emerald-600">
                                    −{peso(billing.discount ?? 0)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="my-2.5 border-t border-dashed border-slate-200" />

                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px]">Total amount</span>
                            <span className="font-mono text-[13px] font-semibold tabular-nums">
                                {peso(billing.total_amount)}
                            </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px]">Amount paid</span>
                            <span className="font-mono text-[13px] tabular-nums">
                                {peso(billing.paid_amount)}
                            </span>
                        </div>
                    </div>

                    {/* Settlement band */}
                    <div
                        className={`mt-3 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${settled ? "bg-emerald-50" : "bg-rose-50"
                            }`}
                    >
                        <span
                            className={`flex items-center gap-1.5 text-[13px] font-medium ${settled ? "text-emerald-700" : "text-rose-700"
                                }`}
                        >
                            {settled && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            {settled ? "Fully settled" : "Outstanding balance"}
                        </span>
                        <span
                            className={`font-mono text-[14px] font-bold tabular-nums ${settled ? "text-emerald-700" : "text-rose-700"
                                }`}
                        >
                            {peso(billing.balance)}
                        </span>
                    </div>

                    <Rule />

                    {/* Signatory */}
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <Label>Received by</Label>
                            <p className="mt-1 text-[13px] font-semibold">
                                {receivedBy?.name ?? "—"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                                {[receivedBy?.role, receivedBy?.id].filter(Boolean).join(" · ") ||
                                    "Cashier"}
                            </p>
                        </div>
                        <p
                            className="pb-1 text-[19px] leading-none text-slate-400"
                            style={{
                                fontFamily:
                                    '"Segoe Script","Brush Script MT","Snell Roundhand",cursive',
                            }}
                        >
                            {receivedBy?.name
                                ? `${receivedBy.name.charAt(0)}. ${receivedBy.name
                                    .split(" ")
                                    .slice(-1)}`
                                : ""}
                        </p>
                    </div>

                    <div className="mt-4 border-t-2 border-dotted border-slate-200" />

                    <p className="mt-3 text-center text-[10px] leading-[1.7] text-slate-400">
                        This statement reflects the transaction above. Please keep it for your
                        records. Generated by E-Boarding.
                    </p>
                </div>
            </div>
        );
    }
);

export default BillingStatementPrint;