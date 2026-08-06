    "use client";

    import { useMemo, useState, useEffect } from "react"
    import {
        Search,
        ChevronDown,
        ChevronLeft,
        ChevronRight,
        Wrench,
        SearchX,
    } from "lucide-react"
    import MaintenanceRow from "./MaintenanceRow"
    import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path

    type Props = {
        request: MaintenanceRequest[]
        loading?: boolean
        onView?: (request: MaintenanceRequest) => void
        onAssign?: (request: MaintenanceRequest) => void
        onUpdateStatus?: (request: MaintenanceRequest) => void
    }

    const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"]
    const ITEMS_PER_PAGE = 7

    const MaintenanceTable = ({
        request,
        loading,
        onView,
        onAssign,
        onUpdateStatus,
    }: Props) => {
        const [search, setSearch] = useState("")
        const [status, setStatus] = useState("")
        const [category, setCategory] = useState("")
        const [currentPage, setCurrentPage] = useState(1)

        // Categories come from the data itself, so the dropdown never goes stale
        const categories = useMemo(
            () =>
                Array.from(new Set(request.map((r) => r.category).filter(Boolean))).sort(),
            [request]
        )

        const filtered = useMemo(() => {
            const q = search.toLowerCase()

            return request.filter((r) => {
                const matchesSearch =
                    r.request_number?.toLowerCase().includes(q) ||
                    r.boarder?.toLowerCase().includes(q) ||
                    r.room_number?.toLowerCase().includes(q) ||
                    r.description?.toLowerCase().includes(q)

                const matchesStatus = status === "" ? true : r.status === status
                const matchesCategory = category === "" ? true : r.category === category

                return matchesSearch && matchesStatus && matchesCategory
            })
        }, [request, search, status, category])

        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

        const paginated = useMemo(() => {
            const start = (currentPage - 1) * ITEMS_PER_PAGE
            return filtered.slice(start, start + ITEMS_PER_PAGE)
        }, [filtered, currentPage])

        useEffect(() => {
            //eslint-disable-next-line
            setCurrentPage((prev) => (prev !== 1 ? 1 : prev))
        }, [search, status, category])

        const isFiltered = search !== "" || status !== "" || category !== ""
        const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
        const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

        return (
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
                                Recent Requests
                            </h2>
                            <p className="text-[11px] leading-tight text-slate-400">
                                {filtered.length} of {request.length} requests
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Search requests..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 sm:w-56"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition focus:border-slate-900 sm:w-auto"
                            >
                                <option value="">All status</option>
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
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
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Image</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Room / Bed</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Category</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Submitted</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Status</th>
                                    <th className="whitespace-nowrap px-4 py-2.5 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3">
                                                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
                                                    <div className="space-y-1.5">
                                                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                                                        <div className="h-2.5 w-32 animate-pulse rounded bg-slate-100" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="ml-auto h-7 w-7 animate-pulse rounded-lg bg-slate-100" />
                                            </td>
                                        </tr>
                                    ))
                                ) : paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-14">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                                    <SearchX className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <p className="mt-3 text-[13px] font-semibold text-slate-900">
                                                    No maintenance requests found
                                                </p>
                                                <p className="mt-1 text-[11.5px] text-slate-400">
                                                    {isFiltered
                                                        ? "Try adjusting your search or filters."
                                                        : "New requests will appear here once submitted."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((request) => (
                                        <MaintenanceRow
                                            key={request.id}
                                            request={request}
                                            onView={onView}
                                            onAssign={onAssign}
                                            onUpdateStatus={onUpdateStatus}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`h-7 min-w-7 rounded-lg px-2 text-[12px] font-medium tabular-nums transition-colors ${currentPage === i + 1
                                            ? "bg-slate-900 text-white"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    export default MaintenanceTable