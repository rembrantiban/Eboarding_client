"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { CalendarDays, CreditCard, Clock, ChevronRight } from "lucide-react"
import { usePayment } from "@/hooks/usePayment"
import { useEffect, useState } from "react"
import type { Payment } from "@/store/usePaymentStore"




const statusConfig = {
  overdue: { label: "Overdue", classes: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
  "due-soon": { label: "Pending", classes: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  upcoming: { label: "Paid", classes: "bg-green-50 text-green-600 border-green-200", dot: "bg-green-500" },
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
}

const daysUntil = (dateStr: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return "Due today"
  return `in ${diff}d`
}


const BoardingFullCalendar = () => {
  const { payments, getPayments } = usePayment();
  const totalDue = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getPayments();
  }, [getPayments]);



  const calendarEvents = payments.map((p) => ({
    id: String(p.payment_id),
    title: `${p.first_name} — ₱${p.amount}`,
    date: p.due_date,
    color:
       p.status === "Overdue"
      ? "#ef4444"   
      : p.status === "Pending"
      ? "#f59e0b"   
      : "#22c55e",
  }));

  return (
    <div className="flex flex-col gap-6 p-6 overflow-x-auto">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track payments and Monitor boarding house operations in real time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-700">Monthly View</span>
          </div>

          <div className="p-4">
            <style>{`
              .fc .fc-toolbar-title       { font-size: 1rem; font-weight: 700; color: #0f172a; }
              .fc .fc-button              { background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; font-size: 0.75rem; font-weight: 600; border-radius: 8px; padding: 4px 12px; text-transform: capitalize; box-shadow: none; }
              .fc .fc-button:hover        { background: #242D2E; border-color: #cbd5e1; margin-bottom: 2px; }
              .fc .fc-button-active,
              .fc .fc-button-primary:not(:disabled).fc-button-active { background: #242D2E; border-color: #2563eb; color: #fff; }
              .fc .fc-button-group        { gap: 4px; display: flex; }
              .fc .fc-toolbar              { gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
              .fc .fc-daygrid-day-number  { color: #475569; font-size: 0.8rem; padding: 4px 6px; }
              .fc .fc-col-header-cell-cushion { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; color: #94a3b8; text-transform: uppercase; }
              .fc .fc-event               { border-radius: 6px; border: none; padding: 2px 6px; font-size: 0.72rem; font-weight: 500; }
              .fc .fc-day-today           { background: #eff6ff !important; }
              .fc td, .fc th              { border-color: #f1f5f9 !important; }
              .fc .fc-scrollgrid         { border-color: #f1f5f9 !important; }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              selectable
              editable
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
              events={calendarEvents}
              eventContent={(eventInfo) => {
                return (
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventInfo.event.backgroundColor }}></span>
                    <span>{eventInfo.event.title}</span>
                  </div>
                );
              }}
              dateClick={(info) => alert("Clicked: " + info.dateStr)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">

          {/* SUMMARY CARD */}
          <div className="bg-slate-700 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <CreditCard size={15} />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Total Due Next This Month
              </span>
            </div>

            <p className="text-3xl font-bold tracking-tight">
              ₱{totalDue.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            {/* ✅ FIXED */}
            <p className="text-xs opacity-70 mt-1">
              {payments.length} payments
            </p>
          </div>

          {/* PAYMENT LIST */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col">

            {/* HEADER */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Clock size={15} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                Upcoming Payments
              </span>
            </div>

            {/* LIST */}
            <div
              className={`divide-y divide-slate-50 transition-all duration-300 ${showAll ? "max-h-120 overflow-y-auto" : ""
                }`}
            >
              {payments
                .slice()
                .sort((a: Payment, b: Payment) =>
                  new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
                )
                .slice(0, showAll ? payments.length : 5) // ✅ LIMIT
                .map((p: Payment) => {
                  const status =
                    p.status === "Overdue"
                      ? "overdue"
                      : p.status === "Pending"
                        ? "due-soon"
                        : "upcoming";

                  const s = statusConfig[status];

                  return (
                    <div
                      key={p.payment_id}
                      className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">

                        {/* LEFT */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-700 text-blue-100 flex items-center justify-center font-bold text-xs shrink-0">
                            {p.first_name.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {p.first_name} {p.last_name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {p.room_number}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            ₱{Number(p.amount).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {daysUntil(p.due_date)}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.classes}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {formatDate(p.due_date)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* FOOTER BUTTON */}
            <div className="px-5 py-3 border-t border-slate-100">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showAll ? "Show less" : "View all payments"}
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardingFullCalendar