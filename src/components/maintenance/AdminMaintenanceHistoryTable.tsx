"use client";

import { useMemo, useState } from "react"
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Archive,
    SearchX,
    ImageOff,
    Maximize2,
} from "lucide-react"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"
import ViewImageModal from "./ViewImageModal"
import ViewMaintenanceRequestModal from "./ViewMaintenanceRequestModal"

type Props = {
    request: MaintenanceRequest[]
    loading?: boolean
}

const ITEMS_PER_PAGE = 8
const COLUMN_COUNT = 6

const formatDate = (date?: string) =>
    date
        ? new Date(date).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "—"

const AdminMaintenanceHistoryTable = ({ request, loading }: Props) => {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [imageRequest, setImageRequest] = useState<MaintenanceRequest | null>(null)
    const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null)

    const categories = useMemo(
        () => Array.from(new Set(request.map((r) => r.category).filter(Boolean))).sort(),
        [request]
    )

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()

        return request.filter((r) => {
            const matchesSearch =
                q === "" ||
                r.request_number?.toLowerCase().includes(q) ||
                r.room_number?.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q)

            const matchesCategory = category === "" ? true : r.category === category

            return matchesSearch && matchesCategory
        })
    }, [request, search, category])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filtered.slice(start, start + ITEMS_PER_PAGE)
    }, [filtered, currentPage])

    const isFiltered = search !== "" || category !== ""
    const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
    const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

    const clearFilters = () => {
        setSearch("")
        setCategory("")
        setCurrentPage(1)
    }

    return (
        <>
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <Archive className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
                                Closed Requests
                            </h2>
                            <p className="text-[11px] leading-tight text-slate-400">
                                {filtered.length} of {request.length} archived requests
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Search history..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 sm:w-56"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value)
                                    setCurrentPage(1)
                                }}
                                aria-label="Filter by category"
                                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition focus:border-slate-900 sm:w-auto"
                            >
                                <option value="">All categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-200/80 bg-slate-50/70">
                                <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Request ID</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Request</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Requested By</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Room</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Closed On</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-right">Details</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3" colSpan={COLUMN_COUNT}>
                                                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={COLUMN_COUNT} className="px-4 py-14">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                                    <SearchX className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <p className="mt-3 text-[13px] font-semibold text-slate-900">
                                                    No closed requests found
                                                </p>
                                                <p className="mt-1 text-[11.5px] text-slate-400">
                                                    {isFiltered
                                                        ? "Try adjusting your search or filters."
                                                        : "Closed maintenance requests will be archived here."}
                                                </p>
                                                {isFiltered && (
                                                    <button
                                                        type="button"
                                                        onClick={clearFilters}
                                                        className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                                    >
                                                        Clear filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                                            <td className="whitespace-nowrap px-4 py-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewRequest(item)}
                                                    className="text-[12px] font-semibold tabular-nums text-slate-900 underline-offset-2 transition hover:underline"
                                                >
                                                    {item.request_number}
                                                </button>
                                            </td>

                                            <td className="px-4 py-2.5">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    {item.image_url ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageRequest(item)}
                                                            aria-label={`View image for ${item.request_number}`}
                                                            className="group relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-slate-400"
                                                        >
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.category}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/55 opacity-0 transition group-hover:opacity-100">
                                                                <Maximize2 className="h-3.5 w-3.5 text-white" />
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                                            <ImageOff className="h-3.5 w-3.5 text-slate-400" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 max-w-65">
                                                        <p
                                                            title={item.description}
                                                            className="truncate text-[12px] font-medium text-slate-800"
                                                        >
                                                            {item.description || "—"}
                                                        </p>
                                                        <span className="inline-flex rounded-full bg-slate-50 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-500 ring-1 ring-slate-200">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-medium text-slate-900">
                                                        {item.requested_by}
                                                    </span>
                                                    <span className="text-[10.5px] text-slate-400">Requester</span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-slate-600">
                                                Room {item.room_number}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-2.5">
                                                <p className="text-[12px] tabular-nums text-slate-700">
                                                    {formatDate(item.resolved_at ?? item.updated_at)}
                                                </p>
                                                {item.closed_by && (
                                                    <p className="text-[10.5px] text-slate-400">
                                                        by {item.closed_by}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-4 py-2.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewRequest(item)}
                                                    className="rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-[11.5px] text-slate-500">
                            Showing{" "}
                            <span className="font-medium tabular-nums text-slate-900">
                                {rangeStart}–{rangeEnd}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium tabular-nums text-slate-900">
                                {filtered.length}
                            </span>{" "}
                            requests
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>

                            <span className="px-2 text-[12px] font-medium tabular-nums text-slate-700">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ViewImageModal
                open={imageRequest !== null}
                request={imageRequest}
                onClose={() => setImageRequest(null)}
            />

            <ViewMaintenanceRequestModal
                request={viewRequest}
                onClose={() => setViewRequest(null)}
                onViewImage={setImageRequest}
            />
        </>
    )
}

export default AdminMaintenanceHistoryTable
