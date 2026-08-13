"use client";

import { useEffect, useMemo, useState } from "react"
import {
    Wrench,
    X,
    Check,

    ImageOff,
    Maximize2,
    Info,
    Loader2,
    CircleCheck,
    Mail,
    Phone,
    UserRoundPlus,
    TriangleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"


export type MaintenanceStaff = {
    id: number
    name: string
    email: string
    contact_number?: string
    avatar_url?: string | null
    active_requests: number
    completed_requests: number
    closed_requests: number
}

export type AssignMaintenancePayload = {
    request_id: number;
    staff_id: number;
    notes: string;
}

type Props = {
    open: boolean
    request: MaintenanceRequest | null
    staff: MaintenanceStaff[]
    staffLoading?: boolean
    loading: boolean,
    onClose: () => void
    onAssign: (payload: AssignMaintenancePayload) => Promise<void> | void
    onViewImage?: (request: MaintenanceRequest) => void
}



const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    "in progress": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    cancelled: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
}

const formatDate = (date?: string) =>
    date
        ? new Date(date).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "—"

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()

type Workload = {
    label: string
    dot: string
    badge: string
}

const getWorkload = (activeRequests: number): Workload => {
    if (activeRequests <= 2) {
        return {
            label: "Available",
            dot: "bg-emerald-500",
            badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
        }
    }

    if (activeRequests <= 4) {
        return {
            label: "Moderate workload",
            dot: "bg-amber-500",
            badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        }
    }

    return {
        label: "Heavy workload",
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    }
}


const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="min-w-0">
        <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
            {label}
        </p>
        <div className="mt-1 truncate text-[12.5px] font-semibold text-slate-900">
            {children}
        </div>
    </div>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-2 text-[11.5px] font-semibold text-slate-700">{children}</p>
)

const Avatar = ({
    name,
    src,
    size = "sm",
}: {
    name: string
    src?: string | null
    size?: "sm" | "lg"
}) => {
    const dimensions = size === "lg" ? "h-11 w-11 text-[13px]" : "h-8 w-8 text-[11px]"

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={cn(
                    "shrink-0 rounded-full object-cover ring-1 ring-slate-200",
                    dimensions
                )}
            />
        )
    }

    return (
        <div
            aria-hidden="true"
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600 ring-1 ring-slate-200",
                dimensions
            )}
        >
            {getInitials(name)}
        </div>
    )
}

const Stat = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-lg bg-slate-50 px-2.5 py-2 text-center ring-1 ring-slate-200/80">
        <p className="text-[14px] font-semibold tabular-nums leading-none text-slate-900">
            {value}
        </p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {label}
        </p>
    </div>
)


const AssignMaintenanceRequestModal = ({
    open,
    request,
    staff,
    loading,
    onClose,
    onAssign,
    onViewImage,
}: Props) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [notes, setNotes] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const alreadyAssigned = Boolean(request?.assigned_staff)
    const locked = false

    const selectedStaff = useMemo(
        () => staff.find((s) => s.id === selectedId) ?? null,
        [staff, selectedId]
    )

    useEffect(() => {
        if (!open) return

        //eslint-disable-next-line
        setSelectedId(null)
        setNotes("")
        setSuccess(false)
        setError(null)
    }, [open, request?.id])

    useEffect(() => {
        if (!open) return

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
    }, [open, onClose])

    if (!open || !request) return null

    const statusClass =
        STATUS_STYLES[request.status?.toLowerCase()] ??
        "bg-slate-100 text-slate-600 ring-1 ring-slate-200"

    const handleAssign = async () => {
        if (!selectedStaff) return

        setError(null)

        try {
            await onAssign({
                request_id: request.id,
                staff_id: selectedStaff.id,
                notes: notes.trim(),
            })

            setSuccess(true)
            setTimeout(onClose, 1400)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "The request could not be assigned. Try again."
            )
        }
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
            onClick={() => !loading && onClose()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-maintenance-title"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl duration-200 animate-in fade-in zoom-in-95 sm:rounded-2xl"
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                            <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2
                                id="assign-maintenance-title"
                                className="text-[14px] font-semibold leading-tight text-slate-900"
                            >
                                Assign Maintenance Request
                            </h2>
                            <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                                Assign an available maintenance staff member to handle this request.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-3">
                            <SectionLabel>Request details</SectionLabel>

                            <div className="rounded-xl border border-slate-200/80 p-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                                    <Field label="Request number">
                                        <span className="tabular-nums">{request.request_number}</span>
                                    </Field>

                                    <Field label="Requested by">{request.requested_by || "—"}</Field>

                                    <Field label="Room">{request.room_number || "—"}</Field>

                                    <Field label="Category">{request.category || "—"}</Field>

                                    <Field label="Status">
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize",
                                                statusClass
                                            )}
                                        >
                                            {request.status}
                                        </span>
                                    </Field>

                                    <Field label="Submitted">
                                        <span className="tabular-nums">{formatDate(request.created_at)}</span>
                                    </Field>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="rounded-xl border border-slate-200/80 p-4">
                                <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                                    Description
                                </p>
                                <p className="mt-1.5 whitespace-pre-wrap wrap-break-words text-[12.5px] leading-relaxed text-slate-700">
                                    {request.description || "No description was provided."}
                                </p>
                            </div>

                            {/* Image */}
                            <div className="rounded-xl border border-slate-200/80 p-4">
                                <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                                    Attached image
                                </p>

                                {request.image_url ? (
                                    <div className="mt-2.5 space-y-2.5">
                                        <button
                                            type="button"
                                            onClick={() => onViewImage?.(request)}
                                            aria-label="View full image"
                                            className="group relative block h-40 w-full overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-slate-400"
                                        >
                                            <img
                                                src={request.image_url}
                                                alt={request.description || request.category}
                                                className="h-full w-full cursor-zoom-in object-cover"
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45 opacity-0 transition group-hover:opacity-100">
                                                <Maximize2 className="h-5 w-5 text-white" />
                                            </span>
                                        </button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => onViewImage?.(request)}
                                            className="h-8 w-full rounded-lg border-slate-200 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                                            View full image
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-2.5 flex flex-col items-center rounded-lg bg-slate-50 py-8 ring-1 ring-slate-200/80">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                            <ImageOff className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <p className="mt-2.5 text-[12px] font-semibold text-slate-900">
                                            No image attached
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            This request was submitted without a photo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ----------------------- Staff assignment ----------------------- */}
                        <div className="space-y-3">
                            <SectionLabel>Staff assignment</SectionLabel>

                            {/* Already-assigned banner */}
                            {alreadyAssigned && (
                                <div className="flex items-start gap-2.5 rounded-xl bg-indigo-50 p-3.5 ring-1 ring-indigo-100">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[12px] font-semibold text-indigo-900">
                                            This request is currently assigned to {request.assigned_staff}.
                                        </p>

                                    </div>
                                </div>
                            )}

                            {/* Searchable staff picker */}
                            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                                <p className="px-3 py-2 text-sm font-medium text-slate-700">Select Staff</p>
                                {staff.map((member) => {
                                    const selected = selectedId === member.id;

                                    return (
                                        <button
                                            key={member.id}
                                            type="button"
                                            onClick={() => setSelectedId(member.id)}
                                            className={cn(
                                                "flex w-full items-center gap-3 p-3 hover:bg-slate-50",
                                                selected && "bg-slate-100"
                                            )}
                                        >
                                            <Avatar
                                                name={member.name}
                                                src={member.avatar_url}
                                            />

                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-sm">
                                                    {member.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {member.email}
                                                </p>
                                            </div>

                                            {selected && (
                                                <Check className="h-4 w-4 text-green-600" />
                                            )}
                                        </button>
                                    );
                                })}

                            </div>

                            {/* Selected staff preview */}
                            {selectedStaff ? (
                                (() => {
                                    const workload = getWorkload(selectedStaff.active_requests)

                                    return (
                                        <div className="rounded-xl border border-slate-200/80 p-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar
                                                    name={selectedStaff.name}
                                                    src={selectedStaff.avatar_url}
                                                    size="lg"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[13px] font-semibold text-slate-900">
                                                        {selectedStaff.name}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1.5 truncate text-[11.5px] text-slate-500">
                                                        <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                                                        {selectedStaff.email}
                                                    </p>

                                                    {selectedStaff.contact_number && (
                                                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11.5px] tabular-nums text-slate-500">
                                                            <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                                                            {selectedStaff.contact_number}
                                                        </p>
                                                    )}
                                                </div>

                                                <span
                                                    className={cn(
                                                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
                                                        workload.badge
                                                    )}
                                                >
                                                    <span className={cn("h-1.5 w-1.5 rounded-full", workload.dot)} />
                                                    {workload.label}
                                                </span>
                                            </div>

                                            <div className="mt-3.5 grid grid-cols-3 gap-2">
                                                <Stat label="Active" value={selectedStaff.active_requests} />
                                                <Stat label="Completed" value={selectedStaff.completed_requests} />
                                                <Stat label="Closed" value={selectedStaff.closed_requests} />
                                            </div>
                                        </div>
                                    )
                                })()
                            ) : (
                                <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-8 text-center">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                        <UserRoundPlus className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="mt-2.5 text-[12px] font-semibold text-slate-900">
                                        No staff selected
                                    </p>
                                    <p className="mt-0.5 max-w-55 text-[11px] leading-relaxed text-slate-400">
                                        {locked
                                            ? "Choose Reassign staff above to pick a different assignee."
                                            : "Pick a staff member to see their current workload."}
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label
                                    htmlFor="assignment-notes"
                                    className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
                                >
                                    Assignment notes{" "}
                                    <span className="font-normal text-slate-400">(optional)</span>
                                </label>
                                <Textarea
                                    id="assignment-notes"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={locked || loading}
                                    placeholder="Additional instructions for the assigned staff..."
                                    className="resize-none rounded-lg border-slate-200 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------------------- Footer ------------------------------ */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-h-4 text-[11.5px]">
                        {success ? (
                            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                                <CircleCheck className="h-3.5 w-3.5" />
                                Maintenance request assigned successfully.
                            </p>
                        ) : error ? (
                            <p className="flex items-center gap-1.5 font-medium text-rose-700">
                                <TriangleAlert className="h-3.5 w-3.5" />
                                {error}
                            </p>
                        ) : (
                            <p className="text-slate-400">
                                {selectedStaff
                                    ? `${selectedStaff.name} will be notified of this assignment.`
                                    : "Select a staff member to continue."}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="h-9 flex-1 rounded-lg border-slate-200 px-4 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleAssign}
                            disabled={locked || loading}
                            className="h-9 flex-1 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 sm:flex-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                "Assign request"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignMaintenanceRequestModal