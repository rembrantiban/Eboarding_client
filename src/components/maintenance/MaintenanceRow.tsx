"use client";

import { MoreVertical, Eye, UserRoundPlus, RefreshCcw, ImageOff } from "lucide-react"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  request: MaintenanceRequest
  onView?: (request: MaintenanceRequest) => void
  onAssign?: (request: MaintenanceRequest) => void
  onUpdateStatus?: (request: MaintenanceRequest) => void
}

 const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  "in progress": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  cancelled: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
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

const MaintenanceRow = ({ request, onView, onAssign, onUpdateStatus }: Props) => {
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
            <img
              src={request.image_url}
              alt={request.category}
              onClick={() => onView?.(request)}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-lg object-cover ring-1 ring-slate-200 transition hover:ring-slate-400"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
              <ImageOff className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[11px] text-slate-400">
              {request.description}
            </p>
          </div>
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
          className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusClass}`}
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
              <DropdownMenuItem onClick={() => onView?.(request)} className="gap-2 rounded-lg">
                <Eye size={14} /> View details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onAssign?.(request)} className="gap-2 rounded-lg">
                <UserRoundPlus size={14} /> Assign staff
              </DropdownMenuItem>

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