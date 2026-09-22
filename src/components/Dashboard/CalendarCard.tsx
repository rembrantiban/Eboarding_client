import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Wallet, ArrowRight, CalendarDays } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";

type CalendarCell = {
  day: number;
  current: boolean;
  year: number;
  month: number;
};

type PaymentStatus = "Pending" | "Upcoming" | "Overdue" | "Paid";

type CalendarEvent = {
  label: string;
  color: string;
  type: "payment" | "event";
  amount?: number;
  Boarder?: string;
  room?: string;
  status?: PaymentStatus;
  note?: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_STYLES: Record<PaymentStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  Upcoming: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  Overdue: "bg-red-50 text-red-700 ring-1 ring-red-100",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
};

const LEGEND: { label: PaymentStatus; dot: string; text: string }[] = [
  { label: "Pending", dot: "bg-amber-500", text: "text-amber-700" },
  { label: "Upcoming", dot: "bg-indigo-500", text: "text-indigo-700" },
  { label: "Overdue", dot: "bg-red-500", text: "text-red-700" },
  { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700" },
];

const VISIBLE_PAYMENTS = 6;

function formatCurrency(v: number) {
  return `₱${v.toLocaleString("en-PH")}`;
}

function formatFullDate(year: number, month: number, day: number) {
  return new Date(year, month, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getCalendarGrid(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false, year, month: month - 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, year, month });
  }
  while (cells.length % 7 !== 0) {
    const day: number = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({ day, current: false, year, month: month + 1 });
  }

  return cells;
}

/* ---------- Payment row (shared by panel + "view all" modal) ---------- */

function PaymentRow({
  cell,
  event,
  onClick,
}: {
  cell: CalendarCell;
  event: CalendarEvent;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-2.5 py-2.5 text-left transition-all hover:border-gray-300 hover:bg-gray-50/80"
    >
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-900 text-white">
        <span className="text-[9px] font-medium uppercase leading-none tracking-wide text-slate-400">
          {MONTHS[cell.month].slice(0, 3)}
        </span>
        <span className="mt-0.5 text-[13px] font-semibold leading-none tabular-nums">
          {cell.day}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-gray-900">
          {event.Boarder ?? event.label}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-gray-500">
          {event.room ? `${event.room} · ` : ""}
          {event.amount ? formatCurrency(event.amount) : event.label}
        </p>
      </div>

      {event.status && (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[event.status]}`}
        >
          {event.status}
        </span>
      )}
    </button>
  );
}

export default function CalendarCard() {

  const { calendarEvents, getCalendarEvents } = useBilling()

  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<{ cell: CalendarCell; event: CalendarEvent } | null>(null);
  const [showAllPayments, setShowAllPayments] = useState(false);

  const cells = getCalendarGrid(view.year, view.month);


  useEffect(() => {
    getCalendarEvents();
  }, [getCalendarEvents]);


  const events = useMemo(() => {
  const map: Record<string, CalendarEvent> = {};

  calendarEvents.forEach((event) => {
    const date = new Date(event.date);

    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    map[key] = {
      label: event.label,
      color: event.color,
      type: event.type,
      amount: event.amount,
      Boarder: event.boarder,
      room: event.room,
      status: event.status,
    };
  });

  return map;
}, [calendarEvents]);

  const isToday = (cell: CalendarCell) =>
    cell.current &&
    cell.year === today.getFullYear() &&
    cell.month === today.getMonth() &&
    cell.day === today.getDate();

  function goToMonth(offset: number) {
    const d = new Date(view.year, view.month + offset, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  function goToday() {
    setView({ year: today.getFullYear(), month: today.getMonth() });
  }

  function openCell(cell: CalendarCell, event: CalendarEvent | null) {
    if (!cell.current || !event) return;
    setSelected({ cell, event });
  }

  useEffect(() => {
    if (!selected && !showAllPayments) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selected) setSelected(null);
      else setShowAllPayments(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, showAllPayments]);

const upcomingPayments = calendarEvents
  .filter(
    (event) =>
      event.type === "payment" &&
      event.status !== "Paid"
  )
  .map((event) => {
    const date = new Date(event.date);

    return {
      key: String(event.id),
      cell: {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        current: true,
      },
      event: {
        label: event.label,
        color: event.color,
        type: event.type,
        amount: event.amount,
        Boarder: event.boarder,
        room: event.room,
        status: event.status,
      },
    };
  })
  .sort((a, b) => {
    return (
      new Date(a.cell.year, a.cell.month, a.cell.day).getTime() -
      new Date(b.cell.year, b.cell.month, b.cell.day).getTime()
    );
  });

  const visiblePayments = upcomingPayments.slice(0, VISIBLE_PAYMENTS);
  const hiddenCount = upcomingPayments.length - visiblePayments.length;

  return (
    <div className="w-full rounded-md border border-gray-200 bg-white p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Calendar */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold leading-tight text-gray-900">
                  Calendar
                </h3>
                <p className="text-[11px] leading-tight text-gray-400">
                  Billing schedule overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-32 text-center text-[13px] font-semibold tabular-nums text-gray-900">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="mx-1 h-5 w-px bg-gray-200" />
              <button
                type="button"
                onClick={goToday}
                className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Today
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {LEGEND.map((l) => (
              <span
                key={l.label}
                className={`flex items-center gap-1.5 text-[11px] font-medium ${l.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${l.dot}`} />
                {l.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-2">
            <div className="grid grid-cols-7">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="pb-2 text-center text-[10.5px] font-semibold uppercase tracking-wider text-gray-400"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                const key = `${cell.year}-${cell.month + 1}-${cell.day}`;
                const event = cell.current ? events[key] : null;
                const todayCell = isToday(cell);
                const clickable = cell.current && !!event;

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!clickable}
                    onClick={() => openCell(cell, event ?? null)}
                    className={`flex min-h-16 flex-col items-center gap-1 rounded-lg border p-1.5 transition-all ${
                      todayCell
                        ? "border-slate-900/15 bg-white shadow-sm"
                        : event
                          ? "border-gray-200/80 bg-white"
                          : "border-transparent bg-transparent"
                    } ${
                      clickable
                        ? "cursor-pointer hover:border-gray-300 hover:shadow-sm"
                        : "cursor-default"
                    }`}
                  >
                    <div
                      className={
                        todayCell
                          ? "flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[12px] font-semibold text-white"
                          : `flex h-6 w-6 items-center justify-center text-[12.5px] font-medium tabular-nums ${
                              cell.current ? "text-gray-800" : "text-gray-300"
                            }`
                      }
                    >
                      {cell.day}
                    </div>

                    {event ? (
                      <span className="flex w-full min-w-0 items-center justify-center gap-1 rounded-md bg-gray-50 px-1 py-0.5">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <span className="truncate text-[9.5px] font-medium text-gray-600">
                          {event.label}
                        </span>
                      </span>
                    ) : (
                      todayCell && (
                        <span className="text-[9.5px] font-medium text-gray-500">Today</span>
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-auto pt-5 text-center text-[11px] text-gray-400">
            Boardinghouse Management System. All rights reserved.
          </p>
        </div>

        {/* Payments panel */}
        <div className="lg:border-l lg:border-gray-100 lg:pl-6">
          <div className="mb-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-400" />
              <h4 className="text-[13px] font-semibold text-gray-900">Payments</h4>
            </div>
            {upcomingPayments.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-semibold tabular-nums text-gray-600">
                {upcomingPayments.length}
              </span>
            )}
          </div>

          {upcomingPayments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
              <Wallet className="mx-auto h-5 w-5 text-gray-300" />
              <p className="mt-2 text-[12px] text-gray-400">
                No pending or upcoming payments.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                {visiblePayments.map(({ key, cell, event }) => (
                  <PaymentRow
                    key={key}
                    cell={cell as CalendarCell}
                    event={event}
                    onClick={() => setSelected({ cell: cell as CalendarCell, event })}
                  />
                ))}
              </div>

              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllPayments(true)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
                >
                  View all payments
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* View all payments modal */}
      {showAllPayments && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-[2px]"
          onClick={() => setShowAllPayments(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold leading-tight text-gray-900">
                    All Payments
                  </h4>
                  <p className="text-[11.5px] leading-tight text-gray-400">
                    {upcomingPayments.length} pending or upcoming
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllPayments(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
              {upcomingPayments.map(({ key, cell, event }) => (
                <PaymentRow
                  key={key}
                  cell={cell as CalendarCell}
                  event={event}
                  onClick={() => {
                    setShowAllPayments(false);
                    setSelected({ cell: cell as CalendarCell, event });
                  }}
                />
              ))}
            </div>

            <div className="border-t border-gray-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setShowAllPayments(false)}
                className="w-full rounded-xl border border-gray-200 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: selected.event.color }}
                />
                <h4 className="text-[15px] font-semibold text-gray-900">
                  {selected.event.label}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1 text-[12.5px] text-gray-400">
              {formatFullDate(selected.cell.year, selected.cell.month, selected.cell.day)}
            </p>

            <div className="my-4 border-t border-gray-100" />

            {selected.event.type === "payment" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-3">
                  <span className="text-[12.5px] text-gray-500">Amount</span>
                  <span className="text-lg font-bold tabular-nums text-gray-900">
                    {formatCurrency(selected.event.amount ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-gray-500">Status</span>
                  {selected.event.status && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[selected.event.status]}`}
                    >
                      {selected.event.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-gray-500">Boarder</span>
                  <span className="text-[12.5px] font-medium text-gray-900">
                    {selected.event.Boarder}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-gray-500">Room</span>
                  <span className="text-[12.5px] font-medium text-gray-900">
                    {selected.event.room}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-gray-600">{selected.event.note}</p>
            )}

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl border border-gray-200 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}