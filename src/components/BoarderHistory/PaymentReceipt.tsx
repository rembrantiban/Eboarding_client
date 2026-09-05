    "use client";
    import { useEffect } from "react";
    import { Home } from "lucide-react";
    import type { PaymentHistory } from "@/store/useBillingStore";



    interface PaymentReceiptProps {
        payment: PaymentHistory;
        companyName?: string;
        tagline?: string;
        stampSubtext?: string;
    }

    const accentByStatus: Record<
        PaymentHistory["status"],
        { text: string; border: string; bg: string; label: string }
    > = {
        Paid: { text: "text-emerald-700", border: "border-emerald-400", bg: "bg-emerald-50", label: "PAID" },
        Pending: { text: "text-amber-700", border: "border-amber-400", bg: "bg-amber-50", label: "PENDING" },
        Partial: { text: "text-orange-700", border: "border-orange-400", bg: "bg-orange-50", label: "PARTIAL" },
        Overdue: { text: "text-rose-700", border: "border-rose-400", bg: "bg-rose-50", label: "OVERDUE" },
        Cancelled: { text: "text-stone-500", border: "border-stone-300", bg: "bg-stone-100", label: "CANCELLED" },
    };

    function useReceiptFonts() {
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

    function peso(n: number | undefined) {
        return `₱${Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function formatDate(value?: string) {
        if (!value) return "—";
        return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }


    function formatMonth(value?: string | null): string {
        if (!value) return "—";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        });
    }

    function formatIssued(value?: string) {
        if (!value) return "—";
        const d = new Date(value);
        const date = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        return `${date} · ${time}`;
    }

    function signatureOf(first: string, last: string) {
        const initial = first?.[0] ? `${first[0].toUpperCase()}.` : "";
        return `${initial} ${last ?? ""}`.trim() || "—";
    }

    export default function PaymentReceipt({
        payment: p,
        companyName = "E-Boarding House",
        tagline = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
        stampSubtext = "EBH",
    }: PaymentReceiptProps) {
        useReceiptFonts();
        const accent = accentByStatus[p.status];

        const breakdown = [
            { label: "Room fee", value: p.room_fee, show: (p.room_fee ?? 0) > 0 },
            { label: "Utilities", value: p.utilities_fee, show: (p.utilities_fee ?? 0) > 0 },
            { label: "Other charges", value: p.other_charges, show: (p.other_charges ?? 0) > 0 },
        ].filter((row) => row.show);

        const fullyPaid = p.status === "Paid" && p.balance <= 0;

        const paymentDate = new Date(p.received_at);
        const now = new Date();

        const label = paymentDate <= now ? "Paid On" : "Due On";

        return (
            <div
                className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border-t-4 border-stone-900 bg-white shadow-sm"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
                <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900">
                                <Home size={18} className="text-white" />
                            </div>
                            <div className="min-w-0 pt-0.5">
                                <h2
                                    className="text-base font-semibold leading-tight text-stone-900"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {companyName}
                                </h2>
                                <p className="mt-0.5 max-w-47.5 text-[10px] font-medium uppercase leading-snug tracking-wide text-stone-400">
                                    {tagline}
                                </p>
                            </div>
                        </div>

                        {/* Stamp */}
                        <div
                            className={`flex h-18 w-18 shrink-0 rotate-[-8deg] flex-col items-center justify-center rounded-full border-2 border-dashed ${accent.border}`}
                        >
                            <span className={`text-[12px] font-bold tracking-wide ${accent.text}`}>{accent.label}</span>
                            <span className={`mt-0.5 text-[7px] font-medium tracking-[0.2em] ${accent.text} opacity-70`}>
                                {stampSubtext}
                            </span>
                        </div>
                    </div>

                    <p
                        className={`mt-4 text-sm italic ${accent.text}`}
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Official Payment Receipt
                    </p>

                    <div className="my-4 border-t border-dashed border-stone-200" />

                    {/* Payment no. */}
                    <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Payment No.</p>
                    <p
                        className={`text-sm font-bold tracking-wide ${accent.text}`}
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        {p.billing_no}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                        {label} {formatIssued(p.received_at)}
                    </p>

                    <div className="my-4 border-t border-dashed border-stone-200" />

                    {/* Boarder */}
                    <div className="rounded-xl bg-stone-50 p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Boarder</p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-stone-900">
                                {p.boarder_first_name} {p.boarder_last_name}
                            </p>
                            {(p.room_number || p.bed_number) && (
                                <p
                                    className={`shrink-0 text-xs font-semibold ${accent.text}`}
                                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                >
                                    {p.room_number ? `Rm ${p.room_number}` : ""}
                                    {p.bed_number ? ` · Bed ${p.bed_number}` : ""}
                                </p>
                            )}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-stone-500">
                            <p className="truncate">
                                {[p.user_id_no, p.boarder_email].filter(Boolean).join(" · ") || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="my-4 border-t border-dashed border-stone-200" />

                    {/* Billing meta */}
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Billing Type</p>
                            <p className="mt-0.5 text-sm font-semibold text-stone-900">{p.billing_type}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Period</p>
                            <p className="mt-0.5 text-sm font-semibold text-stone-900">
                                {formatMonth(p.billing_month) ?? formatDate(p.due_date)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Due Date</p>
                            <p className="mt-0.5 text-sm font-semibold text-stone-900">{formatDate(p.due_date)}</p>
                        </div>
                    </div>

                    <div className="my-4 border-t border-dashed border-stone-200" />

                    {/* Breakdown */}
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-stone-400">
                        Payment Breakdown
                    </p>
                    <div className="space-y-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {breakdown.map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-sm text-stone-700">
                                <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{row.label}</span>
                                <span>{peso(row.value)}</span>
                            </div>
                        ))}
                        {(p.late_fee ?? 0) > 0 && (
                            <div className="flex items-center justify-between text-sm text-rose-600">
                                <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Late fee</span>
                                <span>+{peso(p.late_fee)}</span>
                            </div>
                        )}
                        {(p.discount ?? 0) > 0 && (
                            <div className="flex items-center justify-between text-sm text-emerald-600">
                                <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Discount</span>
                                <span>-{peso(p.discount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="my-3 border-t border-stone-200" />

                    <div
                        className="flex items-center justify-between text-sm font-semibold text-stone-900"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Total balance</span>
                        <span>{peso(p.total_amount)}</span>
                    </div>


                    <div
                        className="mt-1.5 flex items-center justify-between text-sm font-semibold text-stone-900"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Amount paid</span>
                        <span>{peso(p.paid_amount)}</span>
                    </div>



                    {fullyPaid ? (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 p-3">
                            <span className="text-sm font-semibold text-emerald-700">Paid in full</span>
                            <span
                                className="text-sm font-bold text-emerald-700"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                {peso(0)}
                            </span>
                        </div>
                    ) : (
                        p.balance > 0 && (
                            <div className={`mt-3 flex items-center justify-between rounded-xl ${accent.bg} p-3`}>
                                <span className={`text-sm font-semibold ${accent.text}`}>Remaining balance</span>
                                <span
                                    className={`text-sm font-bold ${accent.text}`}
                                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                >
                                    {peso(p.balance)}
                                </span>
                            </div>
                        )
                    )}



                    <div className="my-4 border-t border-dashed border-stone-200" />

                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Received By</p>
                            <p className="mt-0.5 text-sm font-semibold text-stone-900">
                                {p.first_name} {p.last_name}
                            </p>

                        </div>
                        <p
                            className="text-lg text-stone-400"
                            style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic" }}
                        >
                            {signatureOf(p.first_name?.charAt(0) ?? "F", p.last_name ?? "Desk")}
                        </p>
                    </div>

                    <div className="my-4 border-t border-dotted border-stone-300" />

                    <p className="text-center text-[11px] leading-relaxed text-stone-400">
                        This receipt is proof of payment for the transaction above. Please keep it for your records.
                        Generated by {companyName} Management System.
                    </p>
                </div>
            </div>
        );
    }