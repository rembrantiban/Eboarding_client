"use client";

import { useMemo, useState, useRef } from "react";
import { Search, SlidersHorizontal, Receipt, Printer, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { useReactToPrint } from "react-to-print";
import Receipts from "./Receipt";
import type { PaymentHistory } from "@/store/useBillingStore";

type BillingStatus = PaymentHistory["status"];

interface PaymentHistoryListProps {
    payments: PaymentHistory[];
    loading?: boolean;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDateTime(value: string) {
    const date = new Date(value);
    return {
        date: date.toLocaleDateString("en-PH", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        time: date.toLocaleTimeString("en-PH", {
            hour: "numeric",
            minute: "2-digit",
        }),
    };
}

function getInitials(first: string, last: string) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

const STATUS_STYLES: Record<BillingStatus, { chip: string; dot: string }> = {
    Pending: {
        chip: "border-slate-200 bg-slate-50 text-slate-600",
        dot: "bg-slate-400",
    },
    Paid: {
        chip: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    Partial: {
        chip: "border-amber-200/70 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    Overdue: {
        chip: "border-rose-200/70 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
    Cancelled: {
        chip: "border-red-200/70 bg-red-50 text-red-700",
        dot: "bg-red-500",
    },
};

function StatusBadge({ status }: { status: BillingStatus }) {
    const style = STATUS_STYLES[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${style.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {status}
        </span>
    );
}

function groupByDate(payments: PaymentHistory[]) {
    const groups = new Map<string, PaymentHistory[]>();
    for (const p of payments) {
        const key = new Date(p.received_at).toLocaleDateString("en-PH", {
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
    }
    return Array.from(groups.entries());
}

export default function PaymentHistoryList({
    payments,
    loading,
}: PaymentHistoryListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BillingStatus | "all">("all");
    const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistory | null>(null);

    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: "Payment Receipt",
    });

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return payments
            .filter((p) => {
                const matchesSearch =
                    keyword === "" ||
                    p.billing_no.toLowerCase().includes(keyword) ||
                    `${p.boarder_first_name} ${p.boarder_last_name}`
                        .toLowerCase()
                        .includes(keyword) ||
                    `${p.first_name} ${p.last_name}`.toLowerCase().includes(keyword);

                const matchesStatus =
                    statusFilter === "all" || p.status === statusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort(
                (a, b) =>
                    new Date(b.received_at).getTime() -
                    new Date(a.received_at).getTime()
            );
    }, [payments, search, statusFilter]);

    const totalReceived = useMemo(
        () =>
            filtered.reduce(
                (sum, p) => sum + parseFloat(p.amount as unknown as string),
                0
            ),
        [filtered]
    );

    const grouped = useMemo(() => groupByDate(filtered), [filtered]);

    return (
        <div className="h-full overflow-y-auto bg-slate-50/70 pb-15">
            {/* Header */}
            <div className="border-b border-slate-200/80 bg-white/80 px-10 py-4 backdrop-blur-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <Receipt className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Payment History
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                {filtered.length} payment
                                {filtered.length === 1 ? "" : "s"} recorded
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2">
                        <div className="text-right">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                Total received
                            </p>
                            <p className="text-sm font-semibold tabular-nums tracking-tight text-slate-900">
                                {formatCurrency(totalReceived)}
                            </p>
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-2.5 border-b border-slate-200/80 bg-white px-10 py-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search billing no. or boarder"
                        className="h-9 rounded-xl border-slate-200 bg-slate-50/80 pl-9 text-[12.5px] placeholder:text-slate-400 focus-visible:bg-white"
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as BillingStatus | "all")}
                >
                    <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/80 text-[12.5px] sm:w-40">
                        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem className="text-[12.5px]" value="all">
                            All
                        </SelectItem>
                        <SelectItem className="text-[12.5px]" value="Paid">
                            Paid
                        </SelectItem>
                        <SelectItem className="text-[12.5px]" value="Partial">
                            Partial
                        </SelectItem>
                          <SelectItem className="text-[12.5px]" value="Cancelled">
                            Cancelled   
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="max-h-140 overflow-y-auto bg-white">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3.5 border-b border-slate-100 px-10 py-3.5"
                        >
                            <Skeleton className="h-9 w-9 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-40 rounded-full" />
                                <Skeleton className="h-2.5 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                    ))}

                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-20 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-300">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <p className="text-[12.5px] font-medium text-slate-600">
                            No payments to show
                        </p>
                        <p className="text-[11.5px] text-slate-400">
                            Adjust the search or status filter to see more results.
                        </p>
                    </div>
                )}

                {!loading &&
                    grouped.map(([dateLabel, group]) => {
                        const dayTotal = group.reduce(
                            (sum, p) => sum + parseFloat(p.amount as unknown as string),
                            0
                        );

                        return (
                            <div key={dateLabel}>
                                <div className="sticky top-0 z-10 flex items-center justify-between border-y border-slate-100 bg-slate-50/85 px-15 py-2 backdrop-blur">
                                    <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                                        {dateLabel}
                                    </span>
                                    <span className="text-[10.5px] font-medium tabular-nums text-slate-400">
                                        {formatCurrency(dayTotal)}
                                    </span>
                                </div>

                                {group.map((p) => {
                                    const { time } = formatDateTime(p.received_at);
                                    return (
                                        <div
                                            key={p.id}
                                            className="group relative flex items-center gap-3.5 border-b border-slate-100 px-10 py-3.5 transition-colors last:border-b-0 hover:bg-slate-50/70"
                                        >
                                            <span className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-slate-900 transition-transform duration-200 group-hover:scale-y-100" />

                                            {/* Received-by avatar */}
                                            {p.avatar_url ? (
                                                <Avatar className="h-9 w-9 shrink-0 rounded-xl ring-1 ring-slate-200">
                                                    <AvatarImage
                                                        className="rounded-xl"
                                                        src={p.avatar_url}
                                                        alt={`${p.first_name} ${p.last_name}`}
                                                    />
                                                    <AvatarFallback className="rounded-xl bg-slate-100 text-[11px] font-semibold text-slate-600">
                                                        {getInitials(p.first_name, p.last_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-900">
                                                    <span className="text-[11px] font-semibold text-white">
                                                        {getInitials(p.first_name, p.last_name)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-[12.5px] font-semibold tracking-tight text-slate-900">
                                                        No. {p.billing_no}
                                                    </span>
                                                    <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-500">
                                                        {p.billing_type}
                                                    </span>
                                                </div>

                                                <p className="mt-1 flex items-center gap-1.5 truncate text-[11.5px] text-slate-400">
                                                    <span className="truncate">
                                                        Received by{" "}
                                                        <span className="font-medium text-slate-500">
                                                            {p.first_name} {p.last_name}
                                                        </span>
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="shrink-0 tabular-nums">
                                                        {time}
                                                    </span>
                                                </p>

                                                {p.status === "Cancelled" && (
                                                    <div className="mt-2 rounded-xl border border-red-100 bg-red-50/70 px-2.5 py-2">
                                                        <p className="text-[11.5px] font-medium text-red-700">
                                                            Cancellation reason:{" "}
                                                            <span className="font-normal">
                                                                {p.reason ?? "Not specified"}
                                                            </span>
                                                        </p>
                                                        {p.notes && (
                                                            <p className="mt-1 text-[11.5px] text-red-500">
                                                                Notes: {p.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Amount + status */}
                                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                                <span className="text-[13px] font-semibold tabular-nums tracking-tight text-slate-900">
                                                    {formatCurrency(p.amount)}
                                                </span>
                                                <StatusBadge status={p.status} />
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-2.5 text-[11.5px] font-medium text-slate-600 opacity-0 transition-opacity hover:bg-slate-900 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
                                                onClick={() => {
                                                    setSelectedReceipt(p);

                                                    setTimeout(() => {
                                                        handlePrint();
                                                    }, 100);
                                                }}
                                            >
                                                <Printer className="mr-1 h-3.5 w-3.5" />
                                                Receipt
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
            </div>

            {/* Print target — rendered once, outside the group loop */}
            <div className="hidden">
                <div ref={receiptRef}>
                    {selectedReceipt && <Receipts data={selectedReceipt} />}
                </div>
            </div>
        </div>
    );
}