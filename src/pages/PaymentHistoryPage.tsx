"use client";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    Receipt,
    Wallet,
    CalendarClock,
} from "lucide-react";
import { usePayment } from "@/hooks/usePayment";

// TODO: replace with real data from usePayment, e.g.
// const { getAllPayments, allPayments, isLoading } = usePayment();
// useEffect(() => { getAllPayments(); }, [getAllPayments]);

interface Payment {
    payment_id: number;
    month: string;
    amount: number;
    payment_penalty: number,
    dueDate: string;
    paidDate: string | null;
    status: "Paid" | "Pending" | "Overdue";
}


const statusConfig = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Overdue: "bg-rose-50 text-rose-700",
};



function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function groupByYear(payments: Payment[]) {
    const groups = new Map<string, Payment[]>();

    payments.forEach((payment) => {

        const date =
            payment.dueDate ??
            payment.paidDate;

        if (!date) return;

        const year = new Date(date)
            .getFullYear()
            .toString();

        if (!groups.has(year)) {
            groups.set(year, []);
        }

        groups.get(year)!.push(payment);
    });

    return [...groups.entries()].sort(
        (a, b) => Number(b[0]) - Number(a[0])
    );
}

export default function PaymentHistoryPage() {
    const navigate = useNavigate();
    const { paymentHistory, getPaymentHistory } = usePayment();
    const [search, setSearch] = useState("");

     useEffect(() => {
        getPaymentHistory()
     }, [getPaymentHistory]);

     console.log(paymentHistory)

    const filtered = useMemo(() => {
    return paymentHistory.filter((payment) => {

        const month =
            payment.month ??
            new Date(payment.dueDate ?? payment.paidDate ?? "")
                .toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                });

        return (
            search.trim() === "" ||
            month.toLowerCase().includes(search.toLowerCase())
        );
    });
}, [paymentHistory, search]);

    const grouped = useMemo(() => groupByYear(filtered), [filtered]);

    const totals = useMemo(() => {
        const totalPaid = paymentHistory.filter((p) => p.status === "Paid").reduce((s, p) => s + parseFloat(p.amount.toString()), 0);
      
        return { totalPaid, count: paymentHistory.length };

    }, [paymentHistory]);

    const paidCount = paymentHistory.filter(
    (payment) => payment.status === "Paid"
).length;

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Payment History
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            All your past and upcoming payments
                        </p>
                    </div>
                </div>

                {/* Summary stats */}
                <section className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-800 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-400">Total Paid</p>
                            <Wallet size={26} className="text-emerald-500" />
                        </div>
                        <p className="mt-2.5 text-lg font-semibold text-slate-100 sm:text-xl">
                            ₱{totals.totalPaid.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-800 p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-slate-400">Payments</p>
                            <CalendarClock size={26} className="text-slate-400" />
                        </div>
                        <p className="mt-2.5 text-lg font-semibold text-slate-100 sm:text-xl">
                            {totals.count}
                        </p>
                    </div>
                </section>

                {/* Toolbar */}
                <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by month"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs">Showing {paidCount} recent payments</span>
                    </div>

                </section>

                {/* Grouped payment list */}
                <section className="space-y-6">
                    {grouped.map(([year, yearPayments]) => (
                        <div key={year}>
                            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {year}
                            </p>

                            <div className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-3">
                                <div className="divide-y divide-slate-100">
                                    {yearPayments.map((payment) => (
                                        <div
                                            key={payment.payment_id}
                                            className="flex items-center justify-between gap-3 px-2 py-3 sm:px-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <Receipt size={16} className="text-slate-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-900">
                                                        {payment.month}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-500">
                                                        {payment.status === "Paid"
                                                            ? `Paid ${formatDate(payment.paidDate)}`
                                                            : `Due ${formatDate(payment.dueDate)}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="text-sm text-red-700 font-medium">{payment.payment_penalty > 0 ? `+₱${payment.payment_penalty.toLocaleString()}` : null}</span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    ₱{payment.amount.toLocaleString()}
                                                </span>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[payment.status]}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {grouped.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
                            No payments match your filters.
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}