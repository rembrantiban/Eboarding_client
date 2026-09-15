"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CircleCheck,
  Search,
  TriangleAlert,
  ChevronDown,
} from "lucide-react";

import { usePenalty } from "@/hooks/usePenalty";
import type { PenaltyStatus } from "@/store/usePenaltyStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

const peso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

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

const num = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

const STATUS_STYLE: Record<PenaltyStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  "Partially Paid": "bg-blue-50 text-blue-700 ring-blue-100",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Waived: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_FILTERS: ("All Status" | PenaltyStatus)[] = [
  "All Status",
  "Pending",
  "Partially Paid",
  "Paid",
  "Waived",
];

export default function AllPenaltiesModal({ open, onClose }: Props) {
  const { myPenaltyRecords, myPenaltyRecordsLoading, getMyPenaltyRecords } =
    usePenalty();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All Status" | PenaltyStatus>(
    "All Status"
  );

  useEffect(() => {
    if (open) getMyPenaltyRecords();
  }, [open, getMyPenaltyRecords]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return myPenaltyRecords.filter((p) => {
      const matchesStatus = status === "All Status" || p.status === status;
      const matchesQuery =
        !q ||
        (p.penalty_name ?? "").toLowerCase().includes(q) ||
        (p.reason ?? "").toLowerCase().includes(q) ||
        (p.assigned_by ?? "").toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [myPenaltyRecords, search, status]);

  const outstandingTotal = useMemo(
    () =>
      myPenaltyRecords
        .filter((p) => p.status === "Partially Paid")
        .reduce((sum, p) => sum + Math.max(num(p.amount) - num(p.amount_paid), 0), 0),
    [myPenaltyRecords]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="flex max-h-[85vh] w-full max-w-4xl! flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200">
        <DialogHeader className="sr-only">
          <DialogTitle>All Penalties</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative shrink-0 overflow-hidden px-5 pt-5 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-rose-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex items-start justify-between gap-3 px-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <TriangleAlert className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                  All Penalties
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                  Your complete penalty history
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-lg bg-slate-50/80 px-3 py-1.5 text-right ring-1 ring-slate-200">
              <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Outstanding
              </p>
              <p className="text-[13px] font-semibold tabular-nums text-slate-900">
                {peso(outstandingTotal)}
              </p>
            </div>
          </div>

          <div className="relative mt-3 flex items-center gap-2 px-5">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rule, reason, or staff..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8.5 pr-3 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[12px] font-medium text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {myPenaltyRecordsLoading && myPenaltyRecords.length === 0 ? (
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
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-100">
                <CircleCheck size={18} className="text-emerald-500" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-slate-900">
                {search || status !== "All Status"
                  ? "No matching penalties"
                  : "No penalties found"}
              </p>
              <p className="mt-1 text-[11.5px] text-slate-400">
                {search || status !== "All Status"
                  ? "Try a different search or filter."
                  : "Your penalty records will appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 py-1">
              {filtered.map((p) => {
                const amount = num(p.amount);
                const paid = num(p.amount_paid);
                const outstanding = Math.max(amount - paid, 0);
                const active =
                  p.status === "Pending" || p.status === "Partially Paid";

                return (
                  <li
                    key={p.penalty_id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${
                          active
                            ? "bg-amber-50 ring-amber-100"
                            : "bg-emerald-50 ring-emerald-100"
                        }`}
                      >
                        {active ? (
                          <TriangleAlert size={14} className="text-amber-500" />
                        ) : (
                          <CircleCheck size={14} className="text-emerald-500" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium text-slate-900">
                          {p.penalty_name ?? "Custom penalty"}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {formatDate(p.penalty_date)}
                          {p.assigned_by ? ` · by ${p.assigned_by}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[12.5px] font-semibold tabular-nums text-slate-900">
                        {peso(active ? outstanding : amount)}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${STATUS_STYLE[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-5 py-2.5 text-center text-[11px] text-slate-400">
          Showing {filtered.length} of {myPenaltyRecords.length} penalties
        </div>
      </DialogContent>
    </Dialog>
  );
}
