"use client";
import {
    Search, SlidersHorizontal, MoreVertical,
     ChevronLeft, ChevronRight,  Eye,
    Tag, BanknoteArrowUp, BanknoteArrowDown
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Billing } from "@/store/useBillingStore"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { FaMoneyBill } from "react-icons/fa6";
import PrintBillingButton from "./PrintBillingButton"
import PrintPaymentsReportButton from "./Printpaymentsreportbutton";

export type BillingStatus = "Upcoming" | "Pending" | "Paid" | "Partial" | "Overdue" | "Cancelled";

interface BillingTableProps {
    billings: Billing[];
    loading?: boolean;
    onAddBilling?: () => void;
    onExport?: () => void;
    onViewBilling?: (billing: Billing) => void;
    onRecordPayment?: (billing: Billing) => void;
    onDeleteBilling?: (billing: Billing) => void;
    onApplyDiscount?: (billing: Billing) => void;
    onApplyLateFee?: (billing: Billing) => void;
}

function formatCurrency(value: number) {
    return `₱${Number(value).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

const STATUS_STYLES: Record<BillingStatus, { chip: string; dot: string }> = {
    Upcoming: { chip: "bg-blue-50 text-blue-700 ring-blue-100", dot: "bg-blue-500" },
    Pending: { chip: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
    Paid: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-100", dot: "bg-emerald-500" },
    Partial: { chip: "bg-amber-50 text-amber-700 ring-amber-100", dot: "bg-amber-500" },
    Overdue: { chip: "bg-rose-50 text-rose-700 ring-rose-100", dot: "bg-rose-500" },
    Cancelled: { chip: "bg-slate-50 text-slate-500 ring-slate-200", dot: "bg-slate-300" },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function StatusBadge({ status }: { status: BillingStatus }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${style.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {status}
        </span>
    );
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [1];

    if (current > 3) pages.push("ellipsis");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("ellipsis");
    pages.push(total);

    return pages;
}

const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const HEAD = "h-9 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500";
const CELL = "px-3 py-2 text-[13px] whitespace-nowrap";

export default function BillingTable({
    billings,
    loading,
    onViewBilling,
    onRecordPayment,
    onApplyDiscount,
    onApplyLateFee,
    //onDeleteBilling,
}: BillingTableProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BillingStatus | "all">("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filtered = useMemo(() => {
        return billings.filter((b) => {
            const matchesSearch =
                search.trim() === "" ||
                b.billing_no.toLowerCase().includes(search.toLowerCase()) ||
                `${b.first_name} ${b.last_name}`.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || b.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [billings, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, filtered.length);

    function updateSearch(value: string) {
        setSearch(value);
        setPage(1);
    }

    function updateStatusFilter(value: BillingStatus | "all") {
        setStatusFilter(value);
        setPage(1);
    }

    function updatePageSize(value: number) {
        setPageSize(value);
        setPage(1);
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {/* Toolbar */}
            <div className="flex flex-col gap-2 border-b border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full max-w-65">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => updateSearch(e.target.value)}
                            placeholder="Search billing no. or boarder"
                            className="h-8 rounded-lg border-slate-200 pl-8 text-[13px] shadow-none placeholder:text-slate-400"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => updateStatusFilter(v as BillingStatus | "all")}
                    >
                        <SelectTrigger className="h-8 w-37 rounded-lg border-slate-200 text-[13px] shadow-none">
                            <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-slate-400" />
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent className="text-[13px]">
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>

                    {!loading && (
                        <span className="hidden text-[12px] text-slate-400 md:inline">
                            {filtered.length} record{filtered.length === 1 ? "" : "s"}
                        </span>
                    )}
                </div>

                <PrintPaymentsReportButton billings={filtered} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 bg-slate-50/60 hover:bg-slate-50/60">
                            <TableHead className={HEAD}>Billing No.</TableHead>
                            <TableHead className={HEAD}>Boarder</TableHead>
                            <TableHead className={HEAD}>Room</TableHead>
                            <TableHead className={HEAD}>Billing Month</TableHead>
                            <TableHead className={HEAD}>Due Date</TableHead>
                            <TableHead className={`${HEAD} text-right`}>Total</TableHead>
                            <TableHead className={`${HEAD} text-right`}>Paid</TableHead>
                            <TableHead className={`${HEAD} text-right`}>Balance</TableHead>
                            <TableHead className={`${HEAD} text-right`}>Discount</TableHead>
                            <TableHead className={HEAD}>Status</TableHead>
                            <TableHead className={`${HEAD} text-right`}>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading &&
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-100">
                                    {Array.from({ length: 11 }).map((__, j) => (
                                        <TableCell key={j} className={CELL}>
                                            <Skeleton className="h-3 w-full max-w-72 rounded" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {!loading && filtered.length === 0 && (
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableCell colSpan={11} className="px-3 py-12 text-center">
                                    <p className="text-[13px] font-medium text-slate-600">
                                        No billings found
                                    </p>
                                    <p className="mt-1 text-[12px] text-slate-400">
                                        Adjust your search or status filter to see results.
                                    </p>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            paginated.map((b) => (
                                <TableRow
                                    key={b.id}
                                    className="border-slate-100 transition-colors hover:bg-slate-50/70"
                                >
                                    <TableCell className={CELL}>
                                        <button
                                            onClick={() => onViewBilling?.(b)}
                                            className="font-medium text-slate-900 underline-offset-2 hover:text-emerald-700 hover:underline"
                                        >
                                            {b.billing_no}
                                        </button>
                                    </TableCell>
                                    <TableCell className={`${CELL} text-slate-700`}>
                                        {b.first_name} {b.last_name}
                                    </TableCell>
                                    <TableCell className={`${CELL} text-slate-500`}>
                                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                                            {b.room_number} · {b.bed_number}
                                        </span>
                                    </TableCell>
                                    <TableCell className={`${CELL} text-slate-500`}>
                                        {formatDate(b.billing_month)}
                                    </TableCell>
                                    <TableCell className={`${CELL} text-slate-500`}>
                                        {formatDate(b.due_date)}
                                    </TableCell>
                                    <TableCell
                                        className={`${CELL} text-right font-medium tabular-nums text-slate-900`}
                                    >
                                        {formatCurrency(b.total_amount)}
                                    </TableCell>
                                    <TableCell
                                        className={`${CELL} text-right tabular-nums text-slate-600`}
                                    >
                                        {formatCurrency(b.paid_amount)}
                                    </TableCell>
                                    <TableCell
                                        className={`${CELL} text-right font-medium tabular-nums ${Number(b.balance) > 0 ? "text-rose-600" : "text-slate-400"
                                            }`}
                                    >
                                        {formatCurrency(b.balance)}
                                    </TableCell>
                                    <TableCell
                                        className={`${CELL} text-right tabular-nums ${Number(b.discount) > 0 ? "text-emerald-600" : "text-slate-300"
                                            }`}
                                    >
                                        {formatCurrency(b.discount)}
                                    </TableCell>
                                    <TableCell className={CELL}>
                                        <StatusBadge status={b.status} />
                                    </TableCell>
                                    <TableCell className={`${CELL} text-right`}>
                                        <div className="flex items-center justify-end gap-0.5">
                                            <PrintBillingButton billing={b} />

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                    >
                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-52 rounded-lg p-1 text-[13px]"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => onViewBilling?.(b)}
                                                        className="gap-2 rounded-md py-1.5 text-[13px]"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                                                        View details
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onRecordPayment?.(b)}
                                                        className="gap-2 rounded-md py-1.5 text-[13px]"
                                                    >
                                                        <BanknoteArrowDown className="h-3.5 w-3.5 text-emerald-600" />
                                                        Record payment
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => console.log?.(b)}
                                                        className="gap-2 rounded-md py-1.5 text-[13px]"
                                                    >
                                                        <FaMoneyBill className="h-3.5 w-3.5 text-emerald-600" />
                                                        Record partial payment
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="my-1 bg-slate-100" />

                                                    <DropdownMenuItem
                                                        onClick={() => onApplyDiscount?.(b)}
                                                        className="gap-2 rounded-md py-1.5 text-[13px]"
                                                    >
                                                        <Tag className="h-3.5 w-3.5 text-blue-600" />
                                                        Apply discount
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onApplyLateFee?.(b)}
                                                        className="gap-2 rounded-md py-1.5 text-[13px]"
                                                    >
                                                        <BanknoteArrowUp className="h-3.5 w-3.5 text-rose-600" />
                                                        Apply late payment fee
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination footer */}
            {!loading && filtered.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5 text-[12px] text-slate-500">
                        <span>
                            <span className="font-medium text-slate-700">{rangeStart}</span>
                            {"–"}
                            <span className="font-medium text-slate-700">{rangeEnd}</span> of{" "}
                            <span className="font-medium text-slate-700">{filtered.length}</span>
                        </span>

                        <Select
                            value={String(pageSize)}
                            onValueChange={(v) => updatePageSize(Number(v))}
                        >
                            <SelectTrigger className="h-7 w-23 rounded-md border-slate-200 text-[12px] shadow-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <SelectItem
                                        key={size}
                                        value={String(size)}
                                        className="text-[12px]"
                                    >
                                        {size} / page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-7 w-7 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>

                        {getPageNumbers(currentPage, totalPages).map((p, i) =>
                            p === "ellipsis" ? (
                                <span
                                    key={`ellipsis-${i}`}
                                    className="px-1 text-[12px] text-slate-300"
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`h-7 min-w-7 rounded-md px-2 text-[12px] font-medium transition-colors ${p === currentPage
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="h-7 w-7 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}