"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import PaymentEventModal from "./PaymentEventModal";

type EventColor = "coral" | "amber" | "green" | "blue";

type CalendarEvent = {
  date: Date;
  title: string;
  subtitle: string;
  value: string;
  color: EventColor;
  statusLabel: string;
};

const dotColor: Record<EventColor, string> = {
  coral: "bg-red-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
};

const textColor: Record<EventColor, string> = {
  coral: "text-red-600",
  amber: "text-amber-600",
  green: "text-gray-500",
  blue: "text-blue-600",
};

const badgeColor: Record<EventColor, string> = {
  coral: "bg-red-50 text-red-700 ring-red-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
};

const cellHighlight: Record<EventColor, string> = {
  coral: "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean; date: Date }[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({ day, currentMonth: false, date: new Date(year, month - 1, day) });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, currentMonth: true, date: new Date(year, month, day) });
  }
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    for (let day = 1; day <= 7 - remainder; day++) {
      cells.push({ day, currentMonth: false, date: new Date(year, month + 1, day) });
    }
  }
  return cells;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const colorForDueLabel = (label: string): EventColor => {
  if (label === "Overdue") return "coral";
  if (label === "Due Today") return "amber";
  return "blue";
};

const peso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);

const parseLocalDate = (value: string) => {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const formatMonthYear = (value: string) =>
  parseLocalDate(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const FullCalendar = () => {
  const { upcomingPayments, getUpcomingPayments } = useRoomAssignment();

  useEffect(() => {
    getUpcomingPayments();
  }, [getUpcomingPayments]);

  const events: CalendarEvent[] = useMemo(
    () =>
      upcomingPayments.map((p) => {
        const date = parseLocalDate(p.due_date);
        const color = colorForDueLabel(p.due_label);
        return {
          date,
          title: p.billing_month
            ? `${formatMonthYear(p.billing_month)} Rent Due`
            : p.billing_no,
          subtitle: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          value: peso(Number(p.balance)),
          color,
          statusLabel: p.due_label,
        };
      }),
    [upcomingPayments]
  );

  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);
  const [modalEvents, setModalEvents] = useState<CalendarEvent[] | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  };

  const eventsByDay = (date: Date) => events.filter((e) => isSameDay(e.date, date));

  return (
    <Card className="w-full max-w-4xl rounded-md border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">Calendar</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Your upcoming payment due dates
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-[1fr_300px]">
        {/* Calendar grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToday}
              className="rounded-lg text-sm font-medium"
            >
              Today
            </Button>

            <p className="text-base font-semibold text-gray-900">{monthLabel}</p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous month"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next month"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {DAY_LABELS.map((label) => (
              <span key={label} className="text-xs font-medium text-gray-400">
                {label}
              </span>
            ))}

            {cells.map((cell, idx) => {
              const dayEvents = eventsByDay(cell.date);
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selected);

              const hasEvents = dayEvents.length > 0;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(cell.date);
                      if (hasEvents) setModalEvents(dayEvents);
                    }}
                    title={hasEvents ? "View payment details" : undefined}
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition",
                      !cell.currentMonth
                        ? "text-gray-300"
                        : isSelected
                        ? "bg-gray-900 font-semibold text-white"
                        : hasEvents
                        ? cellHighlight[dayEvents[0].color]
                        : isToday
                        ? "font-semibold text-blue-600"
                        : "font-normal text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    {cell.day}
                  </button>
                  <div className="flex h-1.5 gap-0.5">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${dotColor[e.color]}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event list */}
        <div className="flex flex-col gap-1 border-gray-100 pt-1 md:border-l md:pl-6">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                <CalendarCheck size={18} className="text-emerald-500" />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">
                No upcoming payments
              </p>
              <p className="mt-1 text-xs text-gray-500">
                You&rsquo;re all caught up.
              </p>
            </div>
          ) : (
            events
              .slice()
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setModalEvents([event])}
                  className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-gray-50"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor[event.color]}`} />
                  <div className="flex flex-1 items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.subtitle}</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ${badgeColor[event.color]}`}
                      >
                        {event.statusLabel}
                      </span>
                    </div>
                    <span className={`whitespace-nowrap text-sm font-medium ${textColor[event.color]}`}>
                      {event.value}
                    </span>
                  </div>
                </button>
              ))
          )}
        </div>
      </CardContent>

      <PaymentEventModal
        events={modalEvents}
        onClose={() => setModalEvents(null)}
      />
    </Card>
  );
};

export default FullCalendar;
