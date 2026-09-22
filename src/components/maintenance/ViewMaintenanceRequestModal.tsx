"use client";

import { useEffect } from "react"
import {
  Wrench,
  X,
  MapPin,
  UserRound,
  UserRoundCog,
  Tag,
  CalendarClock,
  Clock3,
  Hammer,
  CheckCheck,
  Archive,
  Maximize2,
  ImageOff,
  ShieldCheck,
  ClipboardCheck,
  RefreshCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MaintenanceRequest, MaintenanceStatus } from "@/store/useMaintenanceStore"

type Props = {
  request: MaintenanceRequest | null
  onClose: () => void
  onViewImage?: (request: MaintenanceRequest) => void
  onUpdateStatus?: (request: MaintenanceRequest) => void
  onCloseRequest?: (request: MaintenanceRequest) => void
}

const STATUS_META: Record<
  MaintenanceStatus,
  { badge: string; dot: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Pending: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    icon: Clock3,
  },
  "In Progress": {
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    dot: "bg-indigo-500",
    icon: Hammer,
  },
  Resolved: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCheck,
  },
  Closed: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-300",
    dot: "bg-slate-500",
    icon: Archive,
  },
}

const formatDateTime = (date?: string | null) =>
  date
    ? new Date(date).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—"

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"

const initials = (name?: string) => {
  if (!name?.trim()) return "?"
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

const InfoTile = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[12.5px] font-semibold text-slate-900">
        {value}
      </p>
    </div>
  </div>
)

const ViewMaintenanceRequestModal = ({ request, onClose, onViewImage, onUpdateStatus, onCloseRequest }: Props) => {
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

  const meta = STATUS_META[request.status] ?? STATUS_META.Pending
  const StatusIcon = meta.icon
  const isClosed = request.status === "Closed"
  const isCompleted = request.status === "Resolved"
  const requesterName = request.reporter || request.requested_by || "Unknown"
  const hasResolution = Boolean(request.remarks || request.resolved_at)

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for request ${request.request_number ?? request.id}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 duration-200 animate-in fade-in zoom-in-95 sm:rounded-3xl"
      >
        {/* ------------------------------- Header ------------------------------ */}
        <div className="relative shrink-0 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[15px] font-semibold tracking-tight tabular-nums text-slate-900">
                    {request.request_number ?? `Request #${request.id}`}
                  </h2>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-slate-500">
                  <CalendarClock className="h-3 w-3 text-slate-400" />
                  Filed {formatDateTime(request.created_at)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                meta.badge
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {request.status}
            </span>

            {request.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                <Tag className="h-3 w-3 text-slate-400" />
                {request.category}
              </span>
            )}
          </div>
        </div>

        {/* -------------------------------- Body ------------------------------- */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Description */}
          <div>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
              Reported issue
            </p>
            <p className="whitespace-pre-wrap wrap-break-words rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-[12.5px] leading-relaxed text-slate-700">
              {request.description || "No description provided."}
            </p>
          </div>

          {/* Attached image */}
          {request.image_url ? (
            <button
              type="button"
              onClick={() => onViewImage?.(request)}
              className="group relative block h-56 w-full overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-slate-400"
            >
              <img
                src={request.image_url}
                alt={request.category || "Attached photo"}
                className="h-full w-full cursor-zoom-in object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 transition group-hover:opacity-100">
                <Maximize2 className="h-5 w-5 text-white" />
              </span>
            </button>
          ) : (
            <div className="flex h-20 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-[11.5px] text-slate-400">
              <ImageOff className="h-4 w-4" />
              No photo attached
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoTile
              icon={MapPin}
              label="Location"
              value={
                request.room_number
                  ? `Room ${request.room_number}${request.bed_number ? ` · Bed ${request.bed_number}` : ""}`
                  : request.room ?? "—"
              }
            />
            <InfoTile icon={UserRound} label="Requested by" value={requesterName} />
            {request.created_by_name && request.created_by_name !== requesterName && (
              <InfoTile icon={UserRoundCog} label="Filed by" value={request.created_by_name} />
            )}
            <InfoTile
              icon={UserRoundCog}
              label="Assigned staff"
              value={
                request.assigned_staff?.trim() ? (
                  request.assigned_staff
                ) : (
                  <span className="font-medium text-slate-400">Unassigned</span>
                )
              }
            />
            <InfoTile
              icon={CalendarClock}
              label="Last update"
              value={formatDate(request.updated_at ?? request.created_at)}
            />
          </div>

          {/* Resolution / closing details */}
          {(isClosed || hasResolution) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                  <ClipboardCheck className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-[12px] font-semibold text-slate-900">
                  Resolution summary
                </p>
              </div>

              <p className="mt-3 whitespace-pre-wrap wrap-break-words text-[12.5px] leading-relaxed text-slate-700">
                {request.remarks || "No closing remarks were recorded for this request."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-3 w-3 text-slate-400" />
                  Closed {formatDate(request.resolved_at ?? request.updated_at)}
                </span>

                {request.boarder_confirmed && (
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    Confirmed by boarder
                  </span>
                )}

                {request.assigned_staff?.trim() && (
                  <span className="flex items-center gap-1.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[8px] font-semibold text-slate-600">
                      {initials(request.assigned_staff)}
                    </div>
                    {request.assigned_staff}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------- Footer ------------------------------ */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200/70 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 rounded-lg border-slate-200 px-4 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Close
          </Button>

          {isCompleted && onCloseRequest && (
            <Button
              type="button"
              onClick={() => onCloseRequest(request)}
              className="h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800"
            >
              <Archive className="mr-1.5 h-3.5 w-3.5" />
              Close request
            </Button>
          )}

          {!isClosed && !isCompleted && onUpdateStatus && (
            <Button
              type="button"
              onClick={() => onUpdateStatus(request)}
              className="h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800"
            >
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Update status
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewMaintenanceRequestModal
