"use client";

import { useMemo, useState, useRef } from "react";
import { Search, SlidersHorizontal, Receipt, Banknote, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const STATUS_STYLES: Record<BillingStatus, string> = {
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-900",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

function StatusBadge({ status }: { status: BillingStatus }) {
    return (
        <Badge className={`rounded-full font-medium ${STATUS_STYLES[status]}`}>
            {status}
        </Badge>
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

                    `${p.first_name} ${p.last_name}`
                        .toLowerCase()
                        .includes(keyword);

                const matchesStatus =
                    statusFilter === "all" ||
                    p.status === statusFilter;

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
        <div className="overflow-hidden rounded border border-slate-100 bg-white shadow-sm">
            {/* Header row */}
            <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Payment History
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                        {filtered.length} payment{filtered.length === 1 ? "" : "s"} ·{" "}
                        {formatCurrency(totalReceived)} received
                    </p>
                </div>
            </div>

            {/* Toolbar row */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2.5">
                    <div className="relative w-full max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search billing no. or boarder"
                            className="h-9 rounded-xl pl-9 text-sm"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as BillingStatus | "all")}
                    >
                        <SelectTrigger className="h-9 w-40 rounded-xl text-sm">
                            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List */}
            <div className="max-h-140 overflow-y-auto">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 border-b border-slate-100 px-5 py-4"
                        >
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3.5 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-3.5 w-16" />
                        </div>
                    ))}

                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-slate-400">
                            No payments match your search.
                        </p>
                    </div>
                )}

                {!loading &&
                    grouped.map(([dateLabel, group]) => (
                        <div key={dateLabel}>
                            <div className="sticky top-0 z-10 bg-slate-50/90 px-5 py-2 text-xs font-medium uppercase tracking-wide text-slate-400 backdrop-blur">
                                {dateLabel}
                            </div>

                            {group.map((p) => {
                                const { time } = formatDateTime(p.received_at);
                                return (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/60"
                                    >
                                        {/* Received-by avatar */}
                                        <Avatar className="h-9 w-9 shrink-0">
                                            <AvatarImage
                                                src={p.avatar_url ?? undefined}
                                                alt={`${p.first_name} ${p.last_name}`}
                                            />
                                            <AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">
                                                {getInitials(p.first_name, p.last_name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Details */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-sm font-medium text-slate-900">
                                                    NO. {p.billing_no}
                                                </span>
                                                <span className="shrink-0 rounded-md bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                                                    {p.billing_type}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                Received by {p.first_name} {p.last_name} · {time}
                                            </p>
                                        </div>

                                        {/* Amount + status */}
                                        <div className="flex items-center gap-3">

                                            <div className="flex flex-col items-end gap-1">
                                                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                                                    <Banknote className="h-3.5 w-3.5" />
                                                    {formatCurrency(p.amount)}
                                                </span>

                                                <StatusBadge status={p.status} />
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg text-xs"
                                                onClick={() => {
                                                    setSelectedReceipt(p);

                                                    setTimeout(() => {
                                                        handlePrint();
                                                    }, 100);
                                                }}
                                            >
                                                <Printer className="mr-1 h-4 w-4" />
                                                Receipt
                                            </Button>

                                        </div>
                                    </div>
                                );
                            })}

                            <div className="hidden">
                                <div ref={receiptRef}>
                                    {selectedReceipt && (
                                        <Receipts data={selectedReceipt} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}