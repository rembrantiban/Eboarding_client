"use client";

import {
    MoreVertical,
    UserRoundPlus,
    RefreshCcw,
    ImageOff,
    Maximize2,
    ImageIcon,
    Eye,
    Archive,
} from "lucide-react"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"


type Props = {
    request: MaintenanceRequest
    onView?: (request: MaintenanceRequest) => void
    onViewImage?: (request: MaintenanceRequest) => void
    onAssign?: (request: MaintenanceRequest) => void
    onUpdateStatus?: (request: MaintenanceRequest) => void
    onCloseRequest?: (request: MaintenanceRequest) => void
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    "in progress": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    resolved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
}

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
    })

const MAX_DESCRIPTION_PREVIEW = 20

const truncateDescription = (text?: string) =>
    text && text.length > MAX_DESCRIPTION_PREVIEW
        ? `${text.slice(0, MAX_DESCRIPTION_PREVIEW).trimEnd()}...`
        : text

const MaintenanceRow = ({
    request,
    onView,
    onViewImage,
    onAssign,
    onUpdateStatus,
    onCloseRequest,
}: Props) => {

    const { user } = useAuth()
    const isAssigned = request.assigned_staff?.trim() !== "";
    const isCompleted = request.status?.toLowerCase() === "resolved";

    const statusClass =
        STATUS_STYLES[request.status?.toLowerCase()] ??
        "bg-slate-100 text-slate-600 ring-1 ring-slate-200"

    return (
        <tr className="transition-colors hover:bg-slate-50/70">
            <td className="whitespace-nowrap px-4 py-2.5">
                <button
                    type="button"
                    onClick={() => onView?.(request)}
                    className="text-[12px] font-semibold tabular-nums text-slate-900 underline-offset-2 transition hover:underline"
                >
                    {request.request_number}
                </button>
            </td>

            <td className="px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                    {request.image_url ? (
                        <button
                            type="button"
                            onClick={() => onViewImage?.(request)}
                            aria-label={`View image for ${request.request_number}`}
                            className="group relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-slate-400"
                        >
                            <img
                                src={request.image_url}
                                alt={request.category}
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
                            title={request.description}
                            className="truncate text-[12px] font-medium text-slate-800"
                        >
                            {truncateDescription(request.description) || "—"}
                        </p>
                    </div>
                </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2.5">
                <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-slate-900">
                        {request.requested_by}
                    </span>

                    <span className="text-[10.5px] text-slate-400">
                        Requester
                    </span>
                </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-slate-600">
                Room {request.room_number}
            </td>

            <td className="whitespace-nowrap px-4 py-2.5">
                <span className="inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 ring-1 ring-slate-200">
                    {request.category}
                </span>
            </td>

            <td className="whitespace-nowrap px-4 py-2.5">
                <p className="text-[12px] tabular-nums text-slate-700">
                    {formatDate(request.created_at)}
                </p>
                <p className="text-[10.5px] tabular-nums text-slate-400">
                    {formatTime(request.created_at)}
                </p>
            </td>

            <td className="whitespace-nowrap px-4 py-2.5">
                <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize ${statusClass}`}
                >
                    {request.status}
                </span>
            </td>

            <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-slate-600">
                {request.assigned_staff ? (
                    request.assigned_staff
                ) : (
                    <span className="text-slate-300">Unassigned</span>
                )}
            </td>

            <td className="px-4 py-2.5 text-right">
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Open request actions"
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <MoreVertical size={15} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44 rounded-xl border-slate-200 p-1 text-[12.5px]"
                        >
                            {user?.user_type === "Staff" && (
                                <DropdownMenuItem
                                    onClick={() => onView?.(request)}
                                    className="gap-2 rounded-lg"
                                >
                                    <Eye size={14} />
                                    View details
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                                onClick={() => onViewImage?.(request)}
                                disabled={!request.image_url}
                                className="gap-2 rounded-lg"
                            >
                                <ImageIcon size={14} /> View image
                            </DropdownMenuItem>

                            {user?.user_type === "Admin" && (
                                <>
                                    <DropdownMenuItem
                                        disabled={isAssigned}
                                        onClick={() => onAssign?.(request)}
                                        className="gap-2 rounded-lg"
                                    >
                                        <UserRoundPlus size={14} />
                                        {isAssigned ? "Already Assigned" : "Assign Staff"}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        disabled={!isCompleted}
                                        onClick={() => onCloseRequest?.(request)}
                                        className="gap-2 rounded-lg"
                                    >
                                        <Archive size={14} />
                                        Close request
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuItem
                                onClick={() => onUpdateStatus?.(request)}
                                className="gap-2 rounded-lg"
                            >
                                <RefreshCcw size={14} /> Update status
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    )
}

export default MaintenanceRow