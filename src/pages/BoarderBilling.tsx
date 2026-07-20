import { useState } from "react";
import {
  Printer,
  Mail,
  Phone,
  BedDouble,
  DoorOpen,
  CalendarClock,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import type { Billing } from "@/store/useBillingStore";

const billings : Billing[] = [
  {
    id: 417,
    billing_no: "BILL-2026-0417",
    billing_type: "Monthly rent",
    billing_month: "July 2026",
    due_date: "2026-07-25",
    room_fee: 6500,
    utilities_fee: 850,
    other_charges: 300,
    discount: 0,
    late_fee: 150,
    total_amount: 7800,
    paid_amount: 4000,
    balance: 3800,
    status: "Partial",
    created_at: "2026-07-01",
    updated_at: "2026-07-18",
    user_id: 2024182,
    user_id_no: "BR-2024-0182",
    first_name: "Jomar",
    last_name: "Dela Cruz",
    email: "jomar.delacruz@email.com",
    contact_number: "+63 917 123 4567",
    avatar_url: null,
    assignment_id: 88,
    assigned_date: "2026-01-12",
    expected_checkout: "2026-12-12",
    room_id: 4,
    room_number: "R-204",
    bed_id: 2,
    bed_number: "Bed B",
  },
];



const peso = (n: number) =>
  `₱${Math.abs(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const STATUS_STYLE = {
  Pending: { text: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
  Partial: { text: "text-sky-700", bg: "bg-sky-100", dot: "bg-sky-500" },
  Paid: { text: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" },
  Overdue: { text: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  Cancelled: { text: "text-gray-700", bg: "bg-gray-200", dot: "bg-gray-500" },
};

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}


export default function BillingStatement() {
  const [activeId, setActiveId] = useState(billings[0].id);
  const bill = billings.find((b) => b.id === activeId) ?? billings[0];
  const st = STATUS_STYLE[bill.status];

  const lineItems = [
    { label: "Room fee", value: bill.room_fee },
    { label: "Utilities fee", value: bill.utilities_fee },
    { label: "Other charges", value: bill.other_charges },
    ...(bill.discount ? [{ label: "Discount", value: -bill.discount, tone: "good" }] : []),
    ...(bill.late_fee ? [{ label: "Late fee", value: bill.late_fee, tone: "bad" }] : []),
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-50 p-4 md:p-8 font-sans">
      <div
        className="w-full max-w-6xl grid gap-6"
        style={{ gridTemplateColumns: "280px 1fr" }}
      >
        <aside className="hidden sticky top-0 md:flex flex-col gap-3">
          <div className="px-1">
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
              Statements
            </p>
            <p className="text-sm mt-0.5 text-slate-500">
              {billings.length} records
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {billings.map((b) => {
              const s = STATUS_STYLE[b.status];
              const active = b.id === activeId;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveId(b.id)}
                  className={`text-left rounded-xl p-3 flex items-center gap-3 border transition-colors ${
                    active
                      ? "bg-slate-900 border-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="flex-1 min-w-0">
                    <span
                      className={`text-xs block truncate tabular-nums ${
                        active ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {b.billing_no}
                    </span>
                    <span
                      className={`text-sm font-medium block truncate ${
                        active ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {b.first_name} {b.last_name}
                    </span>
                  </span>
                  <ChevronRight
                    size={15}
                    className={active ? "text-slate-600" : "text-slate-300"}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="relative px-6 py-6 md:px-8 md:py-7 flex items-start justify-between gap-4 bg-slate-900 overflow-hidden">
            <span className="select-none absolute right-6 top-1/2 -translate-y-1/2 font-bold text-6xl tracking-tight pointer-events-none hidden md:block text-white/5">
              {bill.billing_no.split("-").pop()}
            </span>

            <div className="relative">
              <p className="text-lg font-semibold text-white">
                Billing statement
              </p>
              <p className="text-xs mt-1 text-slate-400 tabular-nums">
                Statement no. <span className="text-white">{bill.billing_no}</span>
              </p>
            </div>

            <span
              className={`relative shrink-0 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 ${st.bg} ${st.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {bill.status}
            </span>
          </div>

          {/* Billed to / statement details */}
          <div className="px-6 py-6 md:px-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-slate-400">
                Billed to
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-teal-100 text-teal-700">
                  {initials(bill.first_name, bill.last_name)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">
                    {bill.first_name} {bill.last_name}
                  </p>
                  <p className="text-xs text-teal-600 tabular-nums">
                    ID No. {bill.user_id_no}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Mail size={14} /> {bill.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} /> {bill.contact_number}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-slate-400">
                Statement details
              </p>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex sm:justify-end gap-2">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-medium text-slate-900">{bill.billing_type}</dd>
                </div>
                <div className="flex sm:justify-end gap-2">
                  <dt className="text-slate-500">Billing month</dt>
                  <dd className="font-medium text-slate-900">
                    {bill.billing_month ?? "—"}
                  </dd>
                </div>
                <div className="flex sm:justify-end gap-2">
                  <dt className="text-slate-500">Due date</dt>
                  <dd className="font-medium text-slate-900">
                    {formatDate(bill.due_date)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Room info */}
          <div className="mx-6 md:mx-8 rounded-xl px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50">
            <div>
              <p className="text-xs uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                <DoorOpen size={12} /> Room
              </p>
              <p className="font-semibold mt-1 text-slate-900">
                {bill.room_number ?? "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                <BedDouble size={12} /> Bed
              </p>
              <p className="font-semibold mt-1 text-slate-900">
                {bill.bed_number ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                <CalendarClock size={12} /> Move-in
              </p>
              <p className="font-semibold mt-1 text-slate-900">
                {formatDate(bill.assigned_date)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                <CalendarCheck size={12} /> Checkout
              </p>
              <p className="font-semibold mt-1 text-slate-900">
                {formatDate(bill.expected_checkout)}
              </p>
            </div>
          </div>

          {/* Charges */}
          <div className="px-6 pt-6 pb-2 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-slate-400">
              Charges
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-200 divide-y divide-slate-200">
              {lineItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span
                    className={`text-sm font-medium tabular-nums ${
                      item.tone === "bad"
                        ? "text-red-600"
                        : item.tone === "good"
                        ? "text-green-600"
                        : "text-slate-900"
                    }`}
                  >
                    {item.value < 0 ? "−" : item.tone === "bad" ? "+" : ""}
                    {peso(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 pb-6 pt-4 md:px-8">
            <div className="rounded-xl px-5 py-5 bg-slate-900">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total amount</span>
                <span className="text-white font-medium tabular-nums">
                  {peso(bill.total_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-400">Paid amount</span>
                <span className="font-medium tabular-nums text-teal-300">
                  {peso(bill.paid_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="font-medium text-white">Balance due</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  {peso(bill.balance)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 md:px-8 flex justify-end gap-2 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
            >
              <Printer size={15} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}