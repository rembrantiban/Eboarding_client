"use client";

import { useEffect, useState } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download, ImageOff } from "lucide-react"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path

type Props = {
  open: boolean
  request: MaintenanceRequest | null
  onClose: () => void
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/25",
  "in progress": "bg-indigo-400/15 text-indigo-300 ring-1 ring-indigo-400/25",
  completed: "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/25",
  cancelled: "bg-white/10 text-slate-300 ring-1 ring-white/15",
  rejected: "bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/25",
}

const ViewImageModal = ({ open, request, onClose }: Props) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  // Reset transforms whenever a different request is opened
  useEffect(() => {
    if (open) {
    //eslint-disable-next-line
      setZoom(1)
      setRotation(0)
    }
  }, [open, request?.id])

  // Escape to close + lock background scroll
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
    "bg-white/10 text-slate-300 ring-1 ring-white/15"

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col bg-slate-950/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Image for request ${request.request_number}`}
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex shrink-0 items-start justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold tabular-nums text-white">
              {request.request_number}
            </p>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusClass}`}
            >
              {request.status}
            </span>
            <span className="inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-medium text-slate-300 ring-1 ring-white/15">
              {request.category}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 max-w-xl text-[11.5px] leading-relaxed text-slate-400">
            Room {request.room_number} · {request.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Image stage */}
      <div
        onClick={onClose}
        className="flex flex-1 items-center justify-center overflow-auto px-4 pb-2"
      >
        {request.image_url ? (
          <img
            src={request.image_url}
            alt={request.description || request.category}
            onClick={(e) => e.stopPropagation()}
            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            className="max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl transition-transform duration-200"
          />
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-10 py-12 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <ImageOff className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-white">No image attached</p>
            <p className="mt-1 text-[11.5px] text-slate-400">
              This request was submitted without a photo.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      {request.image_url && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex shrink-0 justify-center px-4 pb-5 pt-2"
        >
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
              disabled={zoom <= 0.5}
              aria-label="Zoom out"
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1)
                setRotation(0)
              }}
              className="min-w-13 rounded-lg px-2 py-1.5 text-[11.5px] font-medium tabular-nums text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
              disabled={zoom >= 3}
              aria-label="Zoom in"
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10" />

            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              aria-label="Rotate image"
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <RotateCw className="h-4 w-4" />
            </button>

              <a
              href={request.image_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open image in new tab"
              className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewImageModal