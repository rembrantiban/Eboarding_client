"use client";

import { useEffect, useState } from "react"
import {
  Archive,
  X,
  Loader2,
  CircleCheck,
  TriangleAlert,
  MapPin,
  UserRound,
  Tag,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"

export type CloseMaintenanceRequestPayload = {
  request_id: number
  notes: string
}

type Props = {
  request: MaintenanceRequest | null
  onClose: () => void
  onConfirm: (payload: CloseMaintenanceRequestPayload) => Promise<void> | void
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
  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
    <Icon className="h-3 w-3 text-slate-400" />
    {children}
  </span>
)

const CloseMaintenanceRequestModal = ({ request, onClose, onConfirm }: Props) => {
  const [notes, setNotes] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!request) return

    setNotes("")
    setConfirmed(false)
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

  const canConfirm = confirmed && !submitting && !success

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
        err instanceof Error ? err.message : "Could not close this request. Try again."
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
      aria-labelledby="close-request-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/5 duration-200 animate-in fade-in zoom-in-95 sm:rounded-3xl"
      >
        {/* ------------------------------- Header ------------------------------ */}
        <div className="relative shrink-0 overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20">
                <Archive className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2
                  id="close-request-title"
                  className="text-[15px] font-semibold leading-tight tracking-tight text-slate-900"
                >
                  Close Maintenance Request
                </h2>
                <p className="mt-0.5 text-[11.5px] leading-tight text-slate-500">
                  Archive this request now that the repair is done.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
                Resolved {formatDate(request.updated_at ?? request.created_at)}
              </span>
            </div>
          </div>

          {/* Closing notes */}
          <div>
            <label
              htmlFor="close-notes"
              className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
            >
              Closing notes{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              id="close-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting || success}
              placeholder="Any final remarks before this request is archived..."
              className="resize-none rounded-lg border-slate-200 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
            />
          </div>

          {/* Confirmation */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 p-3.5 transition hover:bg-slate-50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={submitting || success}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold text-slate-900">
                The boarder confirmed the issue is resolved.
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                Closing archives the request. It will no longer accept status updates.
              </span>
            </span>
          </label>
        </div>

        {/* ------------------------------- Footer ------------------------------ */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-4 text-[11.5px]">
            {success ? (
              <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                <CircleCheck className="h-3.5 w-3.5" />
                Request closed and archived.
              </p>
            ) : error ? (
              <p className="flex items-center gap-1.5 font-medium text-rose-700">
                <TriangleAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-slate-400">
                {confirmed
                  ? "Ready to close this request."
                  : "Confirm the resolution to continue."}
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
              className="h-9 flex-1 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 sm:flex-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Closing...
                </>
              ) : (
                <>
                  <Archive className="mr-1.5 h-3.5 w-3.5" />
                  Close request
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CloseMaintenanceRequestModal
