import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EVENTS = {
  "2025-5-5": { label: "Payment Due", color: "#a855f7" },
  "2025-5-12": { label: "Inspection", color: "#22c55e" },
  "2025-5-20": { label: "House Meeting", color: "#eab308" },
  "2025-5-28": { label: "Deadline", color: "#ef4444" },
};

function getCalendarGrid(year, month) {
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
    const day = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({ day, current: false, year, month: month + 1 });
  }

  return cells;
}

export default function CalendarCard() {
  const today = new Date();
  const [view, setView] = useState({ year: 2025, month: 4 });

  const cells = getCalendarGrid(view.year, view.month);

  const isToday = (cell) =>
    cell.current &&
    cell.year === today.getFullYear() &&
    cell.month === today.getMonth() &&
    cell.day === today.getDate();

  function goToMonth(offset) {
    const d = new Date(view.year, view.month + offset, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  function goToday() {
    setView({ year: today.getFullYear(), month: today.getMonth() });
  }

  return (
    <div className="w-full max-w-5xl rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">Calendar</h3>
        <button
          type="button"
          onClick={goToday}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Today
        </button>
      </div>

      <div className="mb-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="w-36 text-center text-[14px] font-semibold text-gray-900">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-100 pb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11.5px] font-semibold uppercase tracking-wide text-gray-500"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const key = `${cell.year}-${cell.month + 1}-${cell.day}`;
          const event = cell.current ? EVENTS[key] : null;
          const todayCell = isToday(cell);

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1 border-b border-gray-50 py-3"
            >
              <div
                className={
                  todayCell
                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-[13px] font-semibold text-white"
                    : `flex h-7 w-7 items-center justify-center text-[13px] font-medium ${
                        cell.current ? "text-gray-900" : "text-gray-300"
                      }`
                }
              >
                {cell.day}
              </div>

              {todayCell && (
                <span className="text-[10px] font-medium text-gray-900">Today</span>
              )}

              {event && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  {event.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400">
        Boardinghouse Management System. All rights reserved.
      </p>
    </div>
  );
}