"use client";
import { Mail, Phone, BedDouble, DoorOpen, LogIn, LogOut } from "lucide-react";
import { RECEIPT_MONO, TornEdge, DotRow, Barcode } from "@/components/receipt/ReceiptPrimitives";

export interface StatementBill {
    billing_no: string;
    billing_type: string;
    billing_month: string | null;
    due_date: string;
    created_at?: string;

    room_fee: number;
    discount: number;
    late_fee: number;

    total_amount: number;
    paid_amount: number;
    balance: number;

    status: "Upcoming" | "Pending" | "Partial" | "Paid" | "Overdue" | "Cancelled";

    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    user_id_no: string;

    room_number: string | null;
    bed_number: string | null;
    assigned_date: string | null;
    expected_checkout: string | null;
}

interface StatementReceiptProps {
    bill?: StatementBill;
    companyName?: string;
    tagline?: string;
}

const accentByStatus: Record<
    StatementBill["status"],
    { text: string; border: string; dot: string }
> = {
    Upcoming: { text: "text-slate-900", border: "border-slate-900", dot: "bg-slate-900" },
    Pending: { text: "text-slate-900", border: "border-slate-900", dot: "bg-slate-900" },
    Partial: { text: "text-slate-900", border: "border-slate-900", dot: "bg-slate-900" },
    Paid: { text: "text-slate-900", border: "border-slate-900", dot: "bg-slate-900" },
    Overdue: { text: "text-slate-900", border: "border-slate-900", dot: "bg-slate-900" },
    Cancelled: { text: "text-slate-500", border: "border-slate-400", dot: "bg-slate-400" },
};

function peso(n: number) {
    return `P ${Math.abs(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null | undefined) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function initials(first: string, last: string) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "—";
}

const sampleBill: StatementBill = {
    billing_no: "SOA-2026-00842",
    billing_type: "Monthly Rent",
    billing_month: "2026-08-01",
    due_date: "2026-08-10",
    created_at: "2026-08-01",
    room_fee: 6500,
    discount: 300,
    late_fee: 0,
    total_amount: 6200,
    paid_amount: 2000,
    balance: 4200,
    status: "Partial",
    first_name: "Juan",
    last_name: "Dela Cruz",
    email: "juan.delacruz@email.com",
    contact_number: "0917 123 4567",
    user_id_no: "BH-1042",
    room_number: "204",
    bed_number: "B",
    assigned_date: "2026-02-01",
    expected_checkout: null,
};

export default function StatementReceipt({
    bill = sampleBill,
    companyName = "E-Boarding House",
    tagline = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
}: StatementReceiptProps) {
    const accent = accentByStatus[bill.status];
    const isDue = bill.status === "Pending" || bill.status === "Partial" || bill.status === "Overdue";
    const headline = isDue ? "Amount due" : bill.status === "Paid" ? "Amount paid" : "Balance";
    const headlineValue = bill.balance > 0 ? bill.balance : bill.total_amount;

    return (
        <div className="mx-auto w-full max-w-md bg-white px-4 py-8" style={{ fontFamily: RECEIPT_MONO }}>
            <div className="relative mx-auto max-w-105 ">
                <TornEdge position="top" />

                <div className="bg-white px-6 pb-6 pt-5">
                    {/* Letterhead */}
                    <div className="flex flex-col items-center text-center">
                        <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-slate-900">
                            {companyName}
                        </p>
                        <p className="text-[10px] uppercase max-w-xs tracking-[0.15em] text-slate-400">{tagline}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-slate-400">
                        <span>No. {bill.billing_no}</span>
                        <span>{formatDate(bill.created_at)}</span>
                    </div>

                    <div className="my-4 border-t border-dashed border-slate-300" />

                    {/* Status stamp */}
                    <div className="relative">
                        <div
                            className={`absolute -right-1 -top-1 -rotate-[9deg] rounded border-[3px] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.15em] ${accent.border} ${accent.text}`}
                        >
                            {bill.status}
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{headline}</p>
                        <p className={`mt-1 text-3xl font-bold tabular-nums ${accent.text}`}>{peso(headlineValue)}</p>
                        <p className="mt-1 text-[11px] text-slate-400">Due {formatDate(bill.due_date)}</p>
                    </div>

                    <div className="my-4 border-t border-dashed border-slate-300" />

                    {/* Guest */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] font-bold text-slate-600">
                            {initials(bill.first_name, bill.last_name)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-slate-900">
                                {bill.first_name} {bill.last_name}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">ID {bill.user_id_no}</p>
                        </div>
                    </div>

                    <div className="mt-3 space-y-0.5">
                        <DotRow label="Email" icon={<Mail size={11} />} value={<span className="truncate text-[12px]">{bill.email}</span>} tone="muted" />
                        <DotRow label="Phone" icon={<Phone size={11} />} value={bill.contact_number} tone="muted" />
                    </div>

                    <div className="my-4 border-t border-dashed border-slate-300" />

                    {/* Room + stay */}
                    <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Room detail</p>
                    <DotRow label="Room" icon={<DoorOpen size={11} />} value={bill.room_number ?? "Unassigned"} />
                    <DotRow label="Bed" icon={<BedDouble size={11} />} value={bill.bed_number ?? "—"} />
                    <DotRow label="Billing type" value={bill.billing_type} />
                    <DotRow label="Billing month" value={formatDate(bill.billing_month)} />
                    {bill.assigned_date && (
                        <DotRow label="Check-in" icon={<LogIn size={11} />} value={formatDate(bill.assigned_date)} />
                    )}
                    {bill.expected_checkout && (
                        <DotRow label="Check-out" icon={<LogOut size={11} />} value={formatDate(bill.expected_checkout)} />
                    )}

                    <div className="my-4 border-t border-dashed border-slate-300" />

                    {/* Charges */}
                    <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-400">Charges</p>
                    <DotRow label="Room fee" value={peso(bill.room_fee)} />
                    {bill.discount > 0 && <DotRow label="Discount" value={`- ${peso(bill.discount)}`} tone="good" />}
                    {bill.late_fee > 0 && <DotRow label="Late fee" value={`+ ${peso(bill.late_fee)}`} tone="bad" />}

                    <div className="my-4 border-t-2 border-dashed border-slate-900" />

                    {/* Totals */}
                    <DotRow label="Total amount" value={peso(bill.total_amount)} />
                    <DotRow label="Paid amount" value={peso(bill.paid_amount)} tone="good" />

                    <div className="mt-3 flex items-baseline justify-between rounded-md bg-slate-900 px-4 py-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">Balance due</span>
                        <span className="text-xl font-bold tabular-nums text-white">{peso(bill.balance)}</span>
                    </div>

                    <div className="my-5 border-t border-dashed border-slate-300" />

                    {/* Footer */}
                    <p className="text-center text-[11px] leading-relaxed text-slate-500">
                        Please settle this statement on or before the due date to avoid late fees.
                    </p>

                    <div className="mt-4 flex flex-col items-center gap-1">
                        <Barcode seed={bill.billing_no} />
                        <p className="text-[10px] tracking-[0.2em] text-slate-400">{bill.billing_no}</p>
                    </div>

                    <p className="mt-3 text-center text-[9px] uppercase tracking-[0.15em] text-slate-300">
                        {companyName} · thank you
                    </p>
                </div>

                <TornEdge position="bottom" />
            </div>
        </div>
    );
}