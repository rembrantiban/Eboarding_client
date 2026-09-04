"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CalendarClock, Receipt } from "lucide-react";

type EventColor = "coral" | "amber" | "green" | "blue";

export type PaymentCalendarEvent = {
  date: Date;
  title: string;
  subtitle: string;
  value: string;
  color: EventColor;
  statusLabel: string;
};

const badgeColor: Record<EventColor, string> = {
  coral: "bg-red-50 text-red-700 ring-red-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
};

const iconTone: Record<EventColor, string> = {
  coral: "bg-red-50 text-red-600 ring-red-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
};

const glowTone: Record<EventColor, string> = {
  coral: "var(--color-red-200)",
  amber: "var(--color-amber-200)",
  green: "var(--color-emerald-200)",
  blue: "var(--color-blue-200)",
};

interface Props {
  events: PaymentCalendarEvent[] | null;
  onClose: () => void;
}

export default function PaymentEventModal({ events, onClose }: Props) {
  const open = events !== null && events.length > 0;
  const primary = events?.[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 sm:max-w-100">
        <DialogHeader className="sr-only">
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        {primary && (
          <>
            {/* Header */}
            <div className="relative overflow-hidden px-5 pt-5 pb-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-70"
                style={{
                  background: `radial-gradient(ellipse at top, ${glowTone[primary.color]} 0%, transparent 70%)`,
                }}
              />
              <div className="relative flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${iconTone[primary.color]}`}
                >
                  <CalendarClock className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h2 className="text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                    {primary.subtitle}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                    {events && events.length > 1
                      ? `${events.length} payments due on this date`
                      : "Payment due on this date"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment cards */}
            <div className="max-h-[55vh] space-y-2.5 overflow-y-auto px-5">
              {events?.map((event, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-slate-50/80 p-3.5 ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                        <Receipt size={14} className="text-slate-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-slate-900">
                          {event.title}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {event.subtitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${badgeColor[event.color]}`}
                    >
                      {event.statusLabel}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between border-t border-slate-200/70 pt-2.5">
                    <span className="text-[11px] text-slate-400">
                      Amount Due
                    </span>
                    <span className="text-[16px] font-bold tabular-nums tracking-tight text-slate-900">
                      {event.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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
