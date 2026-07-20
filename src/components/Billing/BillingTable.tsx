"use client";
import { Search, SlidersHorizontal, MoreVertical,
         Download, ChevronLeft, ChevronRight, Printer, Eye,
          Pencil, Tag, BanknoteArrowUp, BanknoteArrowDown 
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Billing } from "@/store/useBillingStore"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { FaMoneyBill } from "react-icons/fa6";

export type BillingStatus = "Pending" | "Paid" | "Partial" | "Overdue" | "Cancelled";



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
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

const STATUS_STYLES: Record<BillingStatus, string> = {
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-50",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

const STATUS_LABELS: Record<BillingStatus, string> = {
    Pending: "Pending",
    Paid: "Paid",
    Partial: "Partial",
    Overdue: "Overdue",
    Cancelled: "Cancelled",
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function StatusBadge({ status }: { status: BillingStatus }) {
    return (
        <Badge className={`rounded-full font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
        </Badge>
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
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-PH", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
};



export default function BillingTable({
    billings,
    loading,
    onExport,
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
        <div className="overflow-hidden rounded border border-slate-100 bg-white shadow-sm">
            {/* Header row */}
         
            {/* Toolbar row */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2.5">
                    <div className="relative w-full max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => updateSearch(e.target.value)}
                            placeholder="Search billing no. or boarder"
                            className="h-9 rounded-xl pl-9 text-sm"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => updateStatusFilter(v as BillingStatus | "all")}
                    >
                        <SelectTrigger className="h-9 w-40 rounded-xl text-sm">
                            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="default"
                        onClick={onExport}
                        className="h-9 rounded-xl text-sm font-medium text-slate-100"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="whitespace-nowrap">Billing No.</TableHead>
                            <TableHead className="whitespace-nowrap">Boarder</TableHead>
                            <TableHead className="whitespace-nowrap">Room</TableHead>
                            <TableHead className="whitespace-nowrap">Billing Month</TableHead>
                            <TableHead className="whitespace-nowrap">Due Date</TableHead>
                            <TableHead className="whitespace-nowrap">Total Amount</TableHead>
                            <TableHead className="whitespace-nowrap">Paid</TableHead>
                            <TableHead className="whitespace-nowrap">Balance</TableHead>
                            <TableHead className="whitespace-nowrap">Discount</TableHead>
                            <TableHead className="whitespace-nowrap">Status</TableHead>
                            <TableHead className="whitespace-nowrap text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 11 }).map((__, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-3.5 w-full max-w-20" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {!loading && filtered.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={11}
                                    className="py-10 text-center text-sm text-slate-400"
                                >
                                    No billings match your search.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            paginated.map((b) => (
                                <TableRow key={b.id} className="hover:bg-slate-50/60">
                                    <TableCell className="whitespace-nowrap">
                                        <button
                                            onClick={() => onViewBilling?.(b)}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            {b.billing_no}
                                        </button>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-700">
                                        {b.first_name} {b.last_name}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-700">
                                        {b.room_number} - {b.bed_number}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-500">
                                        {formatDate(b.billing_month)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-500">
                                        {new Date(b.due_date).toLocaleDateString("en-PH", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-medium text-slate-900">
                                        {formatCurrency(b.total_amount)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-700">
                                        {formatCurrency(b.paid_amount)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-slate-700">
                                        {formatCurrency(b.balance)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-green-700">
                                        {formatCurrency(b.discount)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <StatusBadge status={b.status} />
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-right">
                                        <Button>
                                            <Printer/>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700"
                                                >
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-56">

                                                <DropdownMenuItem
                                                    onClick={() => onViewBilling?.(b)}
                                                >
                                                    <Eye/>
                                                    View Billing Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => onRecordPayment?.(b)}
                                                >
                                                    <BanknoteArrowDown className="text-green-600"/>
                                                    Record Payment
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => console.log?.(b)}
                                                >
                                                    <FaMoneyBill/>
                                                    Record Partial Payment
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => console.log?.(b)}
                                                >
                                                    <Pencil/>
                                                    Update Billing Information
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => onApplyDiscount?.(b)}
                                                >
                                                    <Tag className="text-blue-600"/>
                                                    Apply Discount
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => onApplyLateFee?.(b)}
                                                >
                                                    <BanknoteArrowUp className="text-red-700" />
                                                    Apply Late Payment Fee
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination footer */}
            {!loading && filtered.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>
                            Showing{" "}
                            <span className="font-medium text-slate-700">{rangeStart}</span>
                            {"–"}
                            <span className="font-medium text-slate-700">{rangeEnd}</span> of{" "}
                            <span className="font-medium text-slate-700">{filtered.length}</span>
                        </span>

                        <Select
                            value={String(pageSize)}
                            onValueChange={(v) => updatePageSize(Number(v))}
                        >
                            <SelectTrigger className="h-8 w-26 rounded-lg text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size} / page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-8 w-8 rounded-lg text-slate-500 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {getPageNumbers(currentPage, totalPages).map((p, i) =>
                            p === "ellipsis" ? (
                                <span
                                    key={`ellipsis-${i}`}
                                    className="px-1.5 text-sm text-slate-400"
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`h-8 min-w-8 rounded-lg px-2.5 text-sm font-medium transition-colors ${p === currentPage
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="h-8 w-8 rounded-lg text-slate-500 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}