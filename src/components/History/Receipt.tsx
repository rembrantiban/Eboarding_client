import  { useState } from "react";
import { Check, Printer, Download } from "lucide-react";
import type { PaymentHistory } from "@/store/useBillingStore";
import { IoHomeSharp } from "react-icons/io5";

const peso = (n: number ) =>
  `₱${Number(n ?? 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(
    "en-PH",
    opts || { year: "numeric", month: "long", day: "numeric" }
  );
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
};

const formattedBillingDate = (
    value: string | null,
    options?: Intl.DateTimeFormatOptions
) => {
    if (!value) return "—";

    const date = new Date(value);

    if (isNaN(date.getTime())) return value;

    return date.toLocaleDateString(
        "en-PH",
        options ?? {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
};

const statusClasses = {
  Paid: { text: "text-emerald-800", border: "border-emerald-800" },
  Pending: { text: "text-amber-700", border: "border-amber-700" },
  Partial: { text: "text-amber-700", border: "border-amber-700" },
  Overdue: { text: "text-rose-700", border: "border-rose-700" },
  Cancelled: { text: "text-stone-500", border: "border-stone-500" },
};



function Stamp({ status }: { status: PaymentHistory["status"] }) {
  const c = statusClasses[status] || statusClasses.Paid;
  return (
    <div className={`pointer-events-none select-none rotate-[-9deg] ${c.text}`}>
      <div
        className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 ${c.border} opacity-80`}
      >
        <span className="font-mono text-[15px] font-bold tracking-widest">
          {status.toUpperCase()}
        </span>
        <span className="mt-0.5 font-mono text-[8px] tracking-[0.15em]">
          ERMS · EBH
        </span>
      </div>
    </div>
  );
}

function Row({ label, value, strong, muted, negative }: { label: string; value: string; strong?: boolean; muted?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span
        className={
          "text-[13px] " +
          (muted ? "text-stone-500" : "text-stone-700") +
          (strong ? " font-semibold" : "")
        }
      >
        {label}
      </span>
      <span
        className={
          "font-mono text-[13.5px] tabular-nums " +
          (strong ? "font-bold" : "font-medium") +
          " " +
          (negative ? "text-emerald-700" : "text-stone-800")
        }
      >
        {negative ? "\u2212" : ""}
        {value}
      </span>
    </div>
  );
}


export default function Receipt({data}: {data: PaymentHistory;}) {
  const [copied, setCopied] = useState(false);
  const r = data;
  const boarderName = `${r.boarder_first_name} ${r.boarder_last_name}`;
  const staffName = `${r.first_name} ${r.last_name}`;
  const settled = r.status === "Paid";

  return (
    <div className="flex min-h-full w-full items-start justify-center bg-white p-6">
      <div className="w-full max-w-105">
        {/* Action bar */}
        <div className="mb-3 flex items-center justify-end gap-2 px-1 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            <Printer size={14} /> Print
          </button>
          <button
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            <Download size={14} /> {copied ? "Saved!" : "Save PDF"}
          </button>
        </div>

        <div className="relative rounded-md border border-stone-200 bg-white shadow-xl print:shadow-none">
          {/* Top edge accent */}
          <div className="h-1.5 w-full rounded-t-md bg-slate-800" />

          <div className="relative overflow-hidden px-7 pb-5 pt-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                  <IoHomeSharp size={20} className="text-white" strokeWidth={1.8} />
                </div>
                <div>
                  <h1 className="font-serif text-[19px] font-semibold leading-tight text-stone-900">
                    E-Boarding House
                  </h1>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-stone-500">
                    A COMPUTERIZED BOARDING HOUSE 
                    <br />
                   MANAGEMENT SYSTEM FOR ERMINGS
                  </p>
                </div>
              </div>
              <div className="-mr-2 -mt-2 shrink-0">
                <Stamp status={r.status} />
              </div>
            </div>

            <p className="mt-4 font-serif text-[12.5px] italic text-stone-400">
              Official Payment Receipt
            </p>

            {/* Receipt meta */}
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-stone-300 pt-3">
              <div className="flex">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  Payment No.
                </p>
                <p className="font-mono text-[10px] font-semibold text-stone-800">
                  {r.billing_no}
                </p>
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-stone-400">
              Issued {formatDate(r.received_at)} · {formatTime(r.received_at)}
            </p>

            {/* Boarder info */}
            <div className="mt-5 rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-stone-400">
                Boarder
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-stone-800">
                    {boarderName}
                  </p>
                  <p className="text-[11.5px] text-stone-500">
                    {r.boarder_user_id_no} · {r.boarder_email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[13px] font-semibold text-stone-700">
                    Rm {r.room_number} · Bed {r.bed_number}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {r.boarder_contact_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing meta */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  Billing type
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-stone-700">
                  {r.billing_type}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  Period
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-stone-700">
                  {formattedBillingDate(r.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  Due date
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-stone-700">
                  {formatDate(r.due_date, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-5 border-t border-dashed border-stone-300 pt-3">
              <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400">
                Payment breakdown
              </p>
              <Row label="Room fee" value={peso(r.room_fee)} />
              
               {r.late_fee > 0 && (
              <Row label="Late Fee" value={peso(r.late_fee)} strong />
               )}
              <div className="my-1.5 border-t border-stone-200" />
              {r.discount > 0 && (
                <Row label="Discount" value={peso(r.discount)} negative />
              )}
              {r.late_fee > 0 && <Row label="Late fee" value={peso(r.late_fee)} />}
              <div className="my-1.5 border-t border-stone-300" />
              <Row label="Total balance" value={peso(r.balance)} strong />
              <Row label="Amount paid" value={peso(r.amount)} strong />
            </div>

            {/* Balance callout */}
            <div
              className={`mt-3 flex items-center justify-between rounded-md px-4 py-2.5 ${
                settled ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <span
                className={`flex items-center gap-1.5 text-[12.5px] font-semibold ${
                  settled ? "text-emerald-800" : "text-amber-700"
                }`}
              >
                {settled && <Check size={14} strokeWidth={3} />}
                {settled ? "Fully settled" : "Remaining balance"}
              </span>
              <span
                className={`font-mono text-[15px] font-bold ${
                  settled ? "text-emerald-800" : "text-amber-700"
                }`}
              >
                {peso(r.balance)}
              </span>
            </div>

            {/* Received by */}
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-stone-300 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">
                  Received by
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-stone-800">
                  {staffName}
                </p>
                <p className="text-[11px] text-stone-400">Cashier · {r.user_id_no}</p>
              </div>
              <div className="rotate-3 font-serif text-[20px] italic text-stone-400">
                {r.first_name[0]}. {r.last_name}
              </div>
            </div>
          </div>

          {/* perforation divider */}
          <div className="flex items-center justify-center gap-1.5 border-t border-dashed border-stone-300 py-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-stone-200" />
            ))}
          </div>

          {/* Footer stub */}
          <div className="rounded-b-md px-7 pb-5 pt-1">
            <p className="mt-2 text-center text-[10.5px] leading-relaxed text-stone-400">
              This receipt is proof of payment for the transaction above.
              <br />
              Please keep it for your records. Generated by E-Boarding House
              Management System.
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-stone-400 print:hidden">
          Thank you for staying with us.
        </p>
      </div>
    </div>
  );
}