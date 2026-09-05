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
import ViewImageModal from "./ViewImageModal"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path

type Props = {
  request: MaintenanceRequest[]
  loading?: boolean
  onView?: (request: MaintenanceRequest) => void
  onAssign?: (request: MaintenanceRequest) => void
  onUpdateStatus?: (request: MaintenanceRequest) => void
}

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"]
const ITEMS_PER_PAGE = 7
const COLUMN_COUNT = 8

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
  const [imageRequest, setImageRequest] = useState<MaintenanceRequest | null>(null)

  // Categories come from the data itself, so the dropdown never goes stale
  const categories = useMemo(
    () => Array.from(new Set(request.map((r) => r.category).filter(Boolean))).sort(),
    [request]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const s = status.toLowerCase()

    return request.filter((r) => {
      const matchesSearch =
        q === "" ||
        r.request_number?.toLowerCase().includes(q) ||
        r.room_number?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)

      // Compare lowercased — API casing ("in progress") won't match "In Progress"
      const matchesStatus = s === "" ? true : r.status?.toLowerCase() === s
      const matchesCategory = category === "" ? true : r.category === category

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [request, search, status, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  useEffect(() => {
    //eslint-disable-next-line
    setCurrentPage(1)
  }, [search, status, category])

  useEffect(() => {
    //eslint-disable-next-line
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const pageItems = useMemo<(number | "gap")[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const items: (number | "gap")[] = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) items.push("gap")
    for (let i = start; i <= end; i++) items.push(i)
    if (end < totalPages - 1) items.push("gap")
    items.push(totalPages)

    return items
  }, [totalPages, currentPage])

  const isFiltered = search !== "" || status !== "" || category !== ""
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)

  const clearFilters = () => {
    setSearch("")
    setStatus("")
    setCategory("")
  }

  return (
    <>
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
                aria-label="Filter by status"
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
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Room / Bed</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Category</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Submitted</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Status</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Assigned To</th>
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
                            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                            <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
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
                    <td colSpan={COLUMN_COUNT} className="px-4 py-14">
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
                    <MaintenanceRow
                      key={item.id}
                      request={item}
                      onView={onView}
                      onViewImage={setImageRequest}
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

              {pageItems.map((item, i) =>
                item === "gap" ? (
                  <span
                    key={`gap-${i}`}
                    className="px-1 text-[12px] text-slate-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    aria-current={currentPage === item ? "page" : undefined}
                    className={`h-7 min-w-7 rounded-lg px-2 text-[12px] font-medium tabular-nums transition-colors ${
                      currentPage === item
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

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
    </>
  )
}

export default MaintenanceTable