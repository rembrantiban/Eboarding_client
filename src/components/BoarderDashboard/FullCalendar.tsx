"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CalendarEvent = {
  date: Date;
  title: string;
  subtitle: string;
  value: string;
  color: "coral" | "green" | "blue";
};

const dotColor: Record<CalendarEvent["color"], string> = {
  coral: "bg-red-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
};

const textColor: Record<CalendarEvent["color"], string> = {
  coral: "text-gray-900",
  green: "text-gray-500",
  blue: "text-gray-500",
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

const sampleEvents: CalendarEvent[] = [
  {
    date: new Date(2025, 4, 24),
    title: "Payment Due",
    subtitle: "May 24, 2025",
    value: "₱1,250.00",
    color: "coral",
  },
  {
    date: new Date(2025, 4, 30),
    title: "Room Inspection",
    subtitle: "May 30, 2025",
    value: "Scheduled",
    color: "green",
  },
  {
    date: new Date(2025, 8, 24),
    title: "Contract Renewal",
    subtitle: "Sep 24, 2025",
    value: "Upcoming",
    color: "blue",
  },
];

const FullCalendar = ({ events = sampleEvents }: { events?: CalendarEvent[] }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2025, 4, 1));
  const [selected, setSelected] = useState<Date>(new Date(2025, 4, 24));

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
        <CardDescription className="text-sm text-gray-500">Your important dates</CardDescription>
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

              return (
                <div key={idx} className="flex flex-col items-center gap-1 py-1">
                  <button
                    type="button"
                    onClick={() => setSelected(cell.date)}
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm transition",
                      !cell.currentMonth
                        ? "text-gray-300"
                        : isSelected
                        ? "bg-gray-900 font-semibold text-white"
                        : isToday
                        ? "font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-gray-100",
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
          {events
            .slice()
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-gray-50"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor[event.color]}`} />
                <div className="flex flex-1 items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.subtitle}</p>
                  </div>
                  <span className={`whitespace-nowrap text-sm font-medium ${textColor[event.color]}`}>
                    {event.value}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FullCalendar;