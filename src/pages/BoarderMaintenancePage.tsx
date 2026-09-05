"use client";

import { useEffect, useMemo, useState } from "react"
import {
  Wrench,
  Plus,
  Search,
  SearchX,
  ImageOff,
  Maximize2,
  Clock3,
  Hammer,
  CheckCheck,
  Archive,
  X,
  UserRound,
  MapPin,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SubmitMaintenanceRequestModal from "@/components/maintenance/SubmitMaintenanceRequestModal"
import ViewImageModal from "@/components/maintenance/ViewImageModal"
import { useMaintenance } from "@/hooks/useMaintenace";
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import { useAuth } from "@/hooks/useAuth";
import type { MaintenanceRequest, MaintenanceStatus } from "@/store/useMaintenanceStore"




const STATUS_META: Record<
  MaintenanceStatus,
  { badge: string; dot: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    dot: "bg-amber-500",
    icon: Clock3,
  },
  "In Progress": {
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    dot: "bg-indigo-500",
    icon: Hammer,
  },
  Completed: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dot: "bg-emerald-500",
    icon: CheckCheck,
  },
  Closed: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    icon: Archive,
  },
}

const TABS = ["All", "Pending", "In Progress", "Completed", "Closed"] as const
type Tab = (typeof TABS)[number]



const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—"

const formatDateTime = (date?: string) =>
  date
    ? new Date(date).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    : "—"

const relativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.round(diff / 60000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`

  return formatDate(date)
}



const StatusPill = ({ status }: { status: MaintenanceStatus }) => {
  const meta = STATUS_META[status] ?? STATUS_META.Pending

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
        meta.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {status}
    </span>
  )
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", tone)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
    </div>
    <p className="mt-2 text-[22px] font-semibold leading-none tabular-nums text-slate-900">
      {value}
    </p>
  </div>
)


const RequestDetailsModal = ({
  request,
  onClose,
  onViewImage,
}: {
  request: MaintenanceRequest | null
  onClose: () => void
  onViewImage: (request: MaintenanceRequest) => void
}) => {


  useEffect(() => {
    if (!request) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [request, onClose])

  if (!request) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for request ${request.request_number}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl duration-200 animate-in fade-in zoom-in-95 sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold leading-tight tabular-nums text-slate-900">
                {request.request_number}
              </h2>
              <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                Filed {formatDateTime(request.created_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={request.status} />
            <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 ring-1 ring-slate-200">
              {request.category}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-4">
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
              What you reported
            </p>
            <p className="mt-1.5 whitespace-pre-wrap wrap-break-words text-[12.5px] leading-relaxed text-slate-700">
              {request.description}
            </p>
          </div>

          {request.image_url && (
            <button
              type="button"
              onClick={() => onViewImage(request)}
              className="group relative block h-68 w-full overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-slate-400"
            >
              <img
                src={request.image_url}
                alt={request.description}
                className="h-full w-full cursor-zoom-in object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 transition group-hover:opacity-100">
                <Maximize2 className="h-5 w-5 text-white" />
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 rounded-xl border border-slate-200/80 p-4">
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                Room
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-slate-900">
                {request.room_number}
                {request.bed_number && ` · Bed ${request.bed_number}`}
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                Last update
              </p>
              <p className="mt-1 text-[12.5px] font-semibold tabular-nums text-slate-900">
                {formatDate(request.updated_at ?? request.created_at)}
              </p>
            </div>
         
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/80 px-5 py-3.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 w-full rounded-lg border-slate-200 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}



const BoarderMaintenancePage = () => {
  const [tab, setTab] = useState<Tab>("All")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [detailsRequest, setDetailsRequest] = useState<MaintenanceRequest | null>(null)
  const [imageRequest, setImageRequest] = useState<MaintenanceRequest | null>(null)
  const { createMaintenanceRequest, getMySubmittedRequest, loading, getBoarderRequestMaintenance, boarderRequest } = useMaintenance()
  const { getBoarderAssignedRoom, boarderAssignedRoom } = useRoomAssignment()
  const { user } = useAuth()


  useEffect(() => {
    getMySubmittedRequest();
    getBoarderRequestMaintenance()
    //eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (user?.id) {
      getBoarderAssignedRoom(user.id);
    }
    //eslint-disable-next-line
  }, [user]);

  const counts = useMemo(
    () => ({
      pending: boarderRequest.filter((r) => r.status === "Pending").length,
      inProgress: boarderRequest.filter((r) => r.status === "In Progress").length,
      completed: boarderRequest.filter((r) => r.status === "Completed").length,
      total: boarderRequest.length,
    }),
    [boarderRequest]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return boarderRequest
      .filter((r) => (tab === "All" ? true : r.status === tab))
      .filter(
        (r) =>
          q === "" ||
          r.request_number?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          String(r.category).toLowerCase().includes(q)
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }, [boarderRequest, tab, search])

  const isFiltered = tab !== "All" || search !== ""

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold leading-tight text-slate-900">
                Maintenance
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-slate-500">
                <MapPin className="h-3 w-3 text-slate-400" />
                Room {boarderAssignedRoom?.room_number}
                {boarderAssignedRoom?.bed_number && ` · Bed ${boarderAssignedRoom.bed_number}`}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New request
          </Button>
        </div>

        {/* ------------------------------- Stats ----------------------------- */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Pending"
            value={counts.pending}
            icon={Clock3}
            tone="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="In progress"
            value={counts.inProgress}
            icon={Hammer}
            tone="bg-indigo-50 text-indigo-700"
          />
          <StatCard
            label="Completed"
            value={counts.completed}
            icon={CheckCheck}
            tone="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="All requests"
            value={counts.total}
            icon={Wrench}
            tone="bg-slate-100 text-slate-700"
          />
        </div>

        {/* ------------------------------ Toolbar ---------------------------- */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs — horizontally scrollable on mobile */}
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="inline-flex gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm">
              {TABS.map((t) => {
                const isActive = tab === t

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    aria-pressed={isActive}
                    className={cn(
                      "whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search your requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search your requests"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 lg:w-64"
            />
          </div>
        </div>

        {/* ------------------------------- List ------------------------------ */}
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-2/3 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              {isFiltered ? (
                <SearchX className="h-5 w-5 text-slate-400" />
              ) : (
                <Wrench className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <p className="mt-3 text-[13px] font-semibold text-slate-900">
              {isFiltered ? "Nothing matches that" : "No requests yet"}
            </p>
            <p className="mt-1 max-w-xs text-[11.5px] leading-relaxed text-slate-400">
              {isFiltered
                ? "Try a different search or switch tabs."
                : "Something broken in your room? File a request and we will take it from there."}
            </p>

            {isFiltered ? (
              <button
                type="button"
                onClick={() => {
                  setTab("All")
                  setSearch("")
                }}
                className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Clear filters
              </button>
            ) : (
              <Button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New request
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((request) => (
              <article
                key={request.id}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {request.image_url ? (
                    <button
                      type="button"
                      onClick={() => setImageRequest(request)}
                      aria-label={`View image for ${request.request_number}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-slate-400"
                    >
                      <img
                        src={request.image_url}
                        alt={String(request.category)}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition hover:opacity-100">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      <ImageOff className="h-5 w-5 text-slate-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[12px] font-semibold tabular-nums text-slate-900">
                        {request.request_number}
                      </p>
                      <StatusPill status={request.status} />
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-600">
                      {request.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 ring-1 ring-slate-200">
                    {request.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-400">
                    <CalendarDays className="h-3 w-3" />
                    {relativeTime(request.created_at)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500">
                    <UserRound className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {request.assigned_staff?.trim() ? (
                        <>
                          Handled by <span className="font-medium">{request.assigned_staff}</span>
                        </>
                      ) : (
                        "Waiting for assignment"
                      )}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setDetailsRequest(request)}
                    className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <SubmitMaintenanceRequestModal
        open={open}
        roomId={boarderAssignedRoom?.room_id}
        roomNumber={boarderAssignedRoom?.room_number}
        onClose={() => setOpen(false)}
        onSubmit={async (formData) => {
          const ok = await createMaintenanceRequest(formData);
          if (ok) await getMySubmittedRequest();
          return ok;
        }}
      />
      <RequestDetailsModal
        request={detailsRequest}
        onClose={() => setDetailsRequest(null)}
        onViewImage={setImageRequest}
      />

      <ViewImageModal
        open={imageRequest !== null}
        request={imageRequest}
        onClose={() => setImageRequest(null)}
      />
    </div>
  )
}

export default BoarderMaintenancePage