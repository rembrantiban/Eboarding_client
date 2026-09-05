import { useEffect, useState } from "react";
import {
  Download,
  Mail,
  Phone,
  BedDouble,
  DoorOpen,
  CalendarClock,
  CalendarCheck,
  ChevronRight,
  ReceiptText,
  PhilippinePeso,
} from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import PrintModal from "@/components/BillingStatement/PrintModal";
import StatementReceipt from "@/components/BillingStatement/StatementReceipt";
import OfficialReceiptModal from "@/components/Billing/OfficialReceiptModal";


const peso = (n: number) =>
  `₱${Math.abs(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (iso: string | null) => {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const STATUS_STYLE: Record<string, { text: string; bg: string; dot: string }> = {
  Upcoming: {
    text: "text-indigo-700",
    bg: "bg-indigo-100",
    dot: "bg-indigo-500",
  },

  Pending: {
    text: "text-amber-700",
    bg: "bg-amber-100",
    dot: "bg-amber-500",
  },

  Partial: {
    text: "text-sky-700",
    bg: "bg-sky-100",
    dot: "bg-sky-500",
  },

  Paid: {
    text: "text-green-700",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },

  Overdue: {
    text: "text-red-700",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },

  Cancelled: {
    text: "text-gray-700",
    bg: "bg-gray-200",
    dot: "bg-gray-500",
  },
};

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}


export default function BillingStatement() {

  const { myPendingBilling, getMyPendingBilling, myPaymentHistory, getMyPaymentHistory } = useBilling();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    getMyPendingBilling();
    getMyPaymentHistory();
  }, [getMyPendingBilling, getMyPaymentHistory]);


  useEffect(() => {
    if (
      myPendingBilling.length > 0 &&
      activeId === null
    ) {
      //eslint-disable-next-line
      setActiveId(myPendingBilling[0].id);
    }
  }, [myPendingBilling, activeId]);


  const bill =
    myPendingBilling.find(
      (b) => b.id === activeId
    ) ?? myPendingBilling[0];


  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="relative overflow-hidden w-full max-w-lg rounded-lg border border-slate-300 bg-white">

          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-indigo-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-sky-100 blur-3xl opacity-60" />

          <div className="relative flex flex-col items-center px-10 py-14 text-center">

            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
              <ReceiptText
                size={30}
                className="text-slate-600"
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900">
              No Active Billing
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Great news! You don't have any pending,
              overdue, or partial billing statements at the moment.
            </p>

            {/* Status Card */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <PhilippinePeso
                size={26}
                className="text-slate-600"
              />

              <div className="text-left">
                <p className="text-sm font-semibold text-emerald-700">
                  Account Status
                </p>
                <p className="text-xs text-emerald-600">
                  Your account currently has no outstanding balance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const st = STATUS_STYLE[bill.status];

  const latestPayment = myPaymentHistory
    .filter((p) => p.billing_id === bill.id)
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())[0];

  const lineItems = [
    {
      label: "Room fee",
      value: bill.room_fee,
    },  
    ...(bill.discount > 0
      ? [
        {
          label: "Discount",
          value: -bill.discount,
          tone: "good",
        },
      ]
      : []),
    ...(bill.late_fee > 0
      ? [
        {
          label: "Late fee",
          value: bill.late_fee,
          tone: "bad",
        },
      ]
      : []),
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
              {myPendingBilling ? 1 : 0} records
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {myPendingBilling?.map((b) => {
              const s = STATUS_STYLE[b.status];
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveId(b.id)}
                  className={`text-left rounded-xl p-3 flex items-center gap-3 border transition-colors ${activeId === b.id
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="flex-1 min-w-0">
                    <span
                      className={`text-xs block truncate tabular-nums ${activeId === b.id
                          ? "text-slate-400"
                          : "text-slate-500"
                        }`}
                    >
                      {b.billing_no}
                    </span>
                    <span
                      className={`text-sm font-medium block truncate ${activeId === b.id ? "text-white" : "text-slate-900"
                        }`}
                    >
                      {b.first_name} {b.last_name}
                    </span>
                  </span>
                  <ChevronRight
                    size={15}
                    className={activeId === b.id ? "text-slate-600" : "text-slate-300"}
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
                    {formatDate(bill.billing_month) ?? "—"}
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
                    className={`text-sm font-medium tabular-nums ${item.tone === "bad"
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
            {latestPayment && (
              <button
                onClick={() => setReceiptOpen(true)}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100"
              >
                <ReceiptText size={15} /> Official Receipt
              </button>
            )}
            <button
              onClick={() => setPrintOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
            >
              <Download size={15} /> Download
            </button>
          </div>
        </div>
      </div>

      {/* Print view lives in its own modal — this is the only thing that ever prints */}
      <PrintModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        rootId="statement-print-root"
        printLabel="Print Statement"
        maxWidthClassName="max-w-xl"
      >
        <StatementReceipt bill={bill} />
      </PrintModal>

      {receiptOpen && (
        <OfficialReceiptModal
          payment={latestPayment ?? null}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  );
}