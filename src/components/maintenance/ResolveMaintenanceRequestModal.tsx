"use client";

import { useEffect, useState } from "react"
import {
  CheckCheck,
  X,
  Loader2,
  CircleCheck,
  TriangleAlert,
  MapPin,
  UserRound,
  Tag,
  CalendarClock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"

export type ResolveMaintenanceRequestPayload = {
  request_id: number
  notes: string
}

type Props = {
  request: MaintenanceRequest | null
  onClose: () => void
  onConfirm: (payload: ResolveMaintenanceRequestPayload) => Promise<void> | void
}

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"

const SummaryChip = ({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200/70">
    <Icon className="h-3 w-3 text-emerald-500" />
    {children}
  </span>
)

const ResolveMaintenanceRequestModal = ({ request, onClose, onConfirm }: Props) => {
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!request) return

    setNotes("")
    setSubmitting(false)
    setSuccess(false)
    setError(null)
  }, [request])

  useEffect(() => {
    if (!request) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [request, submitting, onClose])

  if (!request) return null

  const canConfirm = notes.trim().length > 0 && !submitting && !success

  const handleConfirm = async () => {
    if (!canConfirm) return

    setSubmitting(true)
    setError(null)

    try {
      await onConfirm({ request_id: request.id, notes: notes.trim() })
      setSuccess(true)
      setTimeout(onClose, 1200)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not resolve this request. Try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolve-request-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-200/70 bg-white shadow-2xl shadow-emerald-900/10 ring-1 ring-black/5 duration-200 animate-in fade-in zoom-in-95 sm:rounded-3xl"
      >
        {/* ------------------------------- Header ------------------------------ */}
        <div className="relative shrink-0 overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white px-6 py-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm shadow-emerald-600/30">
                <CheckCheck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2
                  id="resolve-request-title"
                  className="text-[15px] font-semibold leading-tight tracking-tight text-slate-900"
                >
                  Resolve Maintenance Request
                </h2>
                <p className="mt-0.5 text-[11.5px] leading-tight text-slate-500">
                  Confirm the fix and mark this request as resolved.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
            <SummaryChip icon={Tag}>{request.request_number ?? `#${request.id}`}</SummaryChip>
            {request.category && <SummaryChip icon={Tag}>{request.category}</SummaryChip>}
            {request.room_number && (
              <SummaryChip icon={MapPin}>Room {request.room_number}</SummaryChip>
            )}
          </div>
        </div>

        {/* -------------------------------- Body ------------------------------- */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
              <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">
                {request.assigned_staff?.trim() || "Unassigned"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-slate-600">
              <CalendarClock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">
                Filed {formatDate(request.created_at)}
              </span>
            </div>
          </div>

          {/* Reported issue recap */}
          {request.description && (
            <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5">
              <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                Reported issue
              </p>
              <p className="line-clamp-3 text-[12px] leading-relaxed text-slate-600">
                {request.description}
              </p>
            </div>
          )}

          {/* Resolution summary */}
          <div>
            <label
              htmlFor="resolve-notes"
              className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-medium text-slate-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Resolution summary{" "}
              <span className="font-normal text-slate-400">(required)</span>
            </label>
            <Textarea
              id="resolve-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting || success}
              placeholder="Describe the repair, parts replaced, and any follow-up needed..."
              className="resize-none rounded-lg border-slate-200 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* ------------------------------- Footer ------------------------------ */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-4 text-[11.5px]">
            {success ? (
              <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                <CircleCheck className="h-3.5 w-3.5" />
                Request marked as resolved.
              </p>
            ) : error ? (
              <p className="flex items-center gap-1.5 font-medium text-rose-700">
                <TriangleAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-slate-400">
                {notes.trim().length === 0
                  ? "Add a resolution summary to continue."
                  : "Ready to mark this request resolved."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-9 flex-1 rounded-lg border-slate-200 px-4 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="h-9 flex-1 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 text-[12.5px] font-medium text-white shadow-sm shadow-emerald-600/20 transition hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-40 sm:flex-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Resolving...
                </>
              ) : (
                <>
                  <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                  Mark as Resolved
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResolveMaintenanceRequestModal
