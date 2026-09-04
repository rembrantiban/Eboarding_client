"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Calendar, Megaphone, Users } from "lucide-react";

import type { NotificationAnnouncement } from "@/store/useAnnouncementStore";

type Category = "Maintenance" | "Billing" | "General";

const categoryStyles: Record<Category, string> = {
  Maintenance: "bg-amber-50 text-amber-700 ring-amber-100",
  Billing: "bg-rose-50 text-rose-700 ring-rose-100",
  General: "bg-slate-100 text-slate-600 ring-slate-200/70",
};

interface Props {
  open: boolean;
  onClose: () => void;
  announcement: NotificationAnnouncement | null;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function ViewAnnouncementModal({
  open,
  onClose,
  announcement,
}: Props) {
  if (!announcement) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 sm:max-w-110">
        <DialogHeader className="sr-only">
          <DialogTitle>Announcement Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative overflow-hidden px-5 pt-5 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-slate-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900/10">
              <Megaphone className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                Announcement details
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                Full details of this announcement.
              </p>
            </div>
          </div>
        </div>

        {/* Author summary */}
        <div className="px-5">
          <div className="rounded-xl bg-slate-50/80 p-3 ring-1 ring-slate-200">
            <div className="flex items-center gap-2.5">
              {announcement.created_by_avatar ? (
                <img
                  src={announcement.created_by_avatar}
                  alt={announcement.created_by_name}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white ring-1 ring-slate-200">
                  {announcement.created_by_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] leading-tight font-semibold text-slate-900">
                  {announcement.created_by_name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] leading-tight text-slate-500">
                  <Calendar size={11} />
                  {formatDate(announcement.created_at)}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ring-1 ${
                  categoryStyles[announcement.category as Category] ??
                  categoryStyles.General
                }`}
              >
                {announcement.category}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 px-5">
          <h3 className="text-[14px] leading-snug font-semibold tracking-tight text-slate-900">
            {announcement.title}
          </h3>
          <p className="mt-2 max-h-64 overflow-y-auto text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-600">
            {announcement.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-slate-50/80 px-2.5 py-2 text-[11px] text-slate-500 ring-1 ring-slate-200">
            <Users size={12} className="text-slate-400" />
            Audience:
            <span className="font-medium text-slate-700">
              {announcement.audience}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 rounded-lg bg-slate-900 px-3 text-[12px] font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
