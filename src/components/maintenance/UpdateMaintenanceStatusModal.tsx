"use client";

import { useEffect, useMemo, useState } from "react"
import {
  RefreshCcw,
  X,
  Loader2,
  CircleCheck,
  TriangleAlert,
  Info,
  ArrowRight,
  Clock3,
  Hammer,
  CheckCheck,
  Archive,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"

export type MaintenanceStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Closed"

export type UpdateMaintenanceStatusPayload = {
    request_id: number;
    status: MaintenanceStatus;
    notes: string;
    resolved_at?: string;
    boarder_confirmed?: boolean;
}

type Props = {
  open: boolean
  request: MaintenanceRequest | null
  onClose: () => void
  onUpdate: (payload: UpdateMaintenanceStatusPayload) => Promise<void> | void
}


type StatusOption = {
  value: MaintenanceStatus
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
  selected: string
  iconTile: string
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "Pending",
    description: "Logged and waiting to be picked up.",
    icon: Clock3,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    selected: "border-amber-300 bg-amber-50/50 ring-1 ring-amber-200",
    iconTile: "bg-amber-100 text-amber-700",
  },
  {
    value: "In Progress",
    description: "Staff is actively working on the issue.",
    icon: Hammer,
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    selected: "border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200",
    iconTile: "bg-indigo-100 text-indigo-700",
  },
  {
    value: "Completed",
    description: "Repair is finished and ready for review.",
    icon: CheckCheck,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    selected: "border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200",
    iconTile: "bg-emerald-100 text-emerald-700",
  },
  {
    value: "Closed",
    description: "Confirmed by the boarder and archived.",
    icon: Archive,
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    selected: "border-slate-400 bg-slate-50 ring-1 ring-slate-300",
    iconTile: "bg-slate-200 text-slate-700",
  },
]

/** Which statuses a request can move to from where it is now. */
const TRANSITIONS: Record<string, MaintenanceStatus[]> = {
  pending: ["In Progress", "Completed"],
  "in progress": ["Completed"],
  completed: ["Closed", "In Progress"],
  closed: [],
}

const getOption = (status?: string) =>
  STATUS_OPTIONS.find((o) => o.value.toLowerCase() === status?.toLowerCase())

/** Statuses that require a written note before the update can be saved. */
const NOTE_REQUIRED: MaintenanceStatus[] = ["Completed"]

const NOTE_COPY: Record<string, { label: string; placeholder: string }> = {
  Pending: {
    label: "Status note",
    placeholder: "Why is this request going back to pending?",
  },
  "In Progress": {
    label: "Work note",
    placeholder: "What is being done, and what parts or help are needed?",
  },
  Completed: {
    label: "Resolution summary",
    placeholder: "Describe the repair, parts replaced, and any follow-up needed...",
  },
  Closed: {
    label: "Closing remarks",
    placeholder: "Any final remarks before this request is archived...",
  },
}

const toDateInput = (date: Date) => date.toISOString().slice(0, 10)

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"

/* -------------------------------------------------------------------------- */
/*                             Small building blocks                          */
/* -------------------------------------------------------------------------- */

const StatusPill = ({ status }: { status?: string }) => {
  const option = getOption(status)

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize",
        option?.badge ?? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      )}
    >
      {status || "—"}
    </span>
  )
}

const SummaryItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="min-w-0">
    <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <div className="mt-1 truncate text-[12.5px] font-semibold text-slate-900">{value}</div>
  </div>
)



const UpdateMaintenanceStatusModal = ({ open, request, onClose, onUpdate }: Props) => {
  const [status, setStatus] = useState<MaintenanceStatus | "">("")
  const [notes, setNotes] = useState("")
  const [resolvedAt, setResolvedAt] = useState(toDateInput(new Date()))
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStatus = request?.status ?? ""

  const allowed = useMemo(() => {
    const next = TRANSITIONS[currentStatus.toLowerCase()] ?? [
      "In Progress",
      "Completed",
      "Closed",
    ]
    return STATUS_OPTIONS.filter((o) => next.includes(o.value))
  }, [currentStatus])

  const locked = allowed.length === 0
  const selectedOption = getOption(status)
  const noteRequired = status !== "" && NOTE_REQUIRED.includes(status)
  const noteCopy = NOTE_COPY[status || "In Progress"]

  const canSubmit =
    status !== "" &&
    !locked &&
    !submitting &&
    !success &&
    (!noteRequired || notes.trim().length > 0) &&
    (status !== "Closed" || confirmed)

  // Reset each time a different request is opened
  useEffect(() => {
    if (!open) return

    setStatus("")
    setNotes("")
    setResolvedAt(toDateInput(new Date()))
    setConfirmed(false)
    setSubmitting(false)
    setSuccess(false)
    setError(null)
  }, [open, request?.id])

  // Escape to close + lock background scroll
  useEffect(() => {
    if (!open) return

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
  }, [open, submitting, onClose])

  if (!open || !request) return null

  const handleSubmit = async () => {
  if (!canSubmit) return;

    setSubmitting(true)
    setError(null)

    try {
      await onUpdate({
        request_id: request.id,
        status,
        notes: notes.trim(),
        ...(status === "Completed" ? { resolved_at: resolvedAt } : {}),
        ...(status === "Closed" ? { boarder_confirmed: confirmed } : {}),
      })

      setSuccess(true)
      setTimeout(onClose, 1400)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The status could not be updated. Try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-status-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl duration-200 animate-in fade-in zoom-in-95 sm:rounded-2xl"
      >
        {/* ------------------------------- Header ------------------------------ */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <RefreshCcw className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2
                id="update-status-title"
                className="text-[14px] font-semibold leading-tight text-slate-900"
              >
                Update Maintenance Status
              </h2>
              <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                Move this request forward and leave a record of what changed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* -------------------------------- Body ------------------------------- */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* Request summary */}
          <div className="rounded-xl border border-slate-200/80 p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 sm:grid-cols-4">
              <SummaryItem
                label="Request"
                value={<span className="tabular-nums">{request.request_number}</span>}
              />
              <SummaryItem label="Room" value={request.room_number || "—"} />
              <SummaryItem label="Category" value={request.category || "—"} />
              <SummaryItem
                label="Submitted"
                value={
                  <span className="tabular-nums">{formatDate(request.created_at)}</span>
                }
              />
            </div>

            <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-3">
              <StatusPill status={currentStatus} />
              {selectedOption && selectedOption.value !== currentStatus && (
                <>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                  <StatusPill status={selectedOption.value} />
                </>
              )}
              <span className="ml-auto truncate text-[11px] text-slate-400">
                {request.assigned_staff
                  ? `Assigned to ${request.assigned_staff}`
                  : "Unassigned"}
              </span>
            </div>
          </div>

          {/* Closed requests are read-only */}
          {locked && (
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-900">
                  This request is closed.
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Closed requests are archived and can no longer be updated. Ask the
                  boarder to file a new request if the issue comes back.
                </p>
              </div>
            </div>
          )}

          {/* Status picker */}
          {!locked && (
            <fieldset>
              <legend className="mb-2 text-[11.5px] font-semibold text-slate-700">
                New status
              </legend>

              <div className="grid gap-2 sm:grid-cols-2">
                {allowed.map((option) => {
                  const Icon = option.icon
                  const isSelected = status === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setStatus(option.value)}
                      disabled={submitting}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border p-3 text-left transition disabled:opacity-60",
                        isSelected
                          ? option.selected
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          isSelected ? option.iconTile : "bg-slate-100 text-slate-500"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold text-slate-900">
                          {option.value}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                          {option.description}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-900" />
                      )}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Completion date */}
          {status === "Completed" && (
            <div>
              <label
                htmlFor="resolved-at"
                className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
              >
                Date completed
              </label>
              <input
                id="resolved-at"
                type="date"
                value={resolvedAt}
                max={toDateInput(new Date())}
                onChange={(e) => setResolvedAt(e.target.value)}
                disabled={submitting}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[12.5px] tabular-nums text-slate-800 outline-none transition focus:border-slate-900 disabled:bg-slate-50 sm:w-48"
              />
            </div>
          )}

          {/* Notes */}
          {!locked && (
            <div>
              <label
                htmlFor="status-notes"
                className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
              >
                {noteCopy.label}{" "}
                <span className="font-normal text-slate-400">
                  {noteRequired ? "(required)" : "(optional)"}
                </span>
              </label>
              <Textarea
                id="status-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting || status === ""}
                placeholder={noteCopy.placeholder}
                className="resize-none rounded-lg border-slate-200 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
              />
            </div>
          )}

          {/* Closing confirmation */}
          {status === "Closed" && (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 p-3.5 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={submitting}
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
          )}
        </div>

        {/* ------------------------------- Footer ------------------------------ */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-4 text-[11.5px]">
            {success ? (
              <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                <CircleCheck className="h-3.5 w-3.5" />
                Maintenance status updated successfully.
              </p>
            ) : error ? (
              <p className="flex items-center gap-1.5 font-medium text-rose-700">
                <TriangleAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-slate-400">
                {locked
                  ? "No further updates are available."
                  : status === ""
                    ? "Pick a new status to continue."
                    : noteRequired && notes.trim().length === 0
                      ? `Add a ${noteCopy.label.toLowerCase()} to continue.`
                      : status === "Closed" && !confirmed
                        ? "Confirm the resolution to close this request."
                        : `This request will be marked ${status.toLowerCase()}.`}
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
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-9 flex-1 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 sm:flex-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save status"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateMaintenanceStatusModal