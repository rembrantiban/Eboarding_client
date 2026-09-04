"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FileText, Receipt, Search, Wallet } from "lucide-react";

import { useBilling } from "@/hooks/useBilling";

interface Props {
  open: boolean;
  onClose: () => void;
}

const peso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

const STATUS_STYLE: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Partial: "bg-amber-50 text-amber-700 ring-amber-100",
  Pending: "bg-slate-100 text-slate-600 ring-slate-200",
  Overdue: "bg-rose-50 text-rose-700 ring-rose-100",
  Cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function AllPaymentsModal({ open, onClose }: Props) {
  const { myPaymentHistory, getMyPaymentHistory, loading } = useBilling();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) getMyPaymentHistory();
  }, [open, getMyPaymentHistory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return myPaymentHistory;
    return myPaymentHistory.filter(
      (p) =>
        p.billing_no?.toLowerCase().includes(q) ||
        p.billing_type?.toLowerCase().includes(q) ||
        p.receipt_no?.toLowerCase().includes(q)
    );
  }, [myPaymentHistory, search]);

  const totalPaid = useMemo(
    () =>
      myPaymentHistory.reduce(
        (sum, p) => sum + (Number(p.amount) || 0),
        0
      ),
    [myPaymentHistory]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-1.5rem)] max-w-2xl! flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200">
        <DialogHeader className="sr-only">
          <DialogTitle>All Payments</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative shrink-0 overflow-hidden px-5 pt-5 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-blue-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex items-start justify-between gap-3 px-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Wallet className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                  All Payments
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                  Your complete payment history
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-lg bg-slate-50/80 px-3 py-1.5 text-right ring-1 ring-slate-200">
              <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Total Paid
              </p>
              <p className="text-[13px] font-semibold tabular-nums text-slate-900">
                {peso(totalPaid)}
              </p>
            </div>
          </div>

          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by billing no. or receipt no..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8.5 pr-3 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {loading && myPaymentHistory.length === 0 ? (
            <div className="space-y-2 py-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <FileText size={18} className="text-slate-400" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-slate-900">
                {search ? "No matching payments" : "No payments found"}
              </p>
              <p className="mt-1 text-[11.5px] text-slate-400">
                {search
                  ? "Try a different search term."
                  : "Your payment records will appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 py-1">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200">
                      <Receipt size={14} className="text-slate-400" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-slate-900">
                        {p.billing_type}
                        {p.billing_no ? ` · ${p.billing_no}` : ""}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {formatDate(p.received_at)}
                        {p.receipt_no ? ` · ${p.receipt_no}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[12.5px] font-semibold tabular-nums text-slate-900">
                      {peso(Number(p.amount))}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                        STATUS_STYLE[p.status] ??
                        "bg-slate-50 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-5 py-2.5 text-center text-[11px] text-slate-400">
          Showing {filtered.length} of {myPaymentHistory.length} payments
        </div>
      </DialogContent>
    </Dialog>
  );
}
