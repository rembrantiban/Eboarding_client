"use client";

import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  AlertTriangle,
  Calendar,
  LoaderCircle,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";

const peso = (v: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(v) ? v : 0);

const n = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

const fmtDate = (v?: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

const STATUS_STYLES: Record<PenaltyStatus, string> = {
  Pending: "bg-rose-50 text-rose-700 ring-rose-100",
  "Partially Paid": "bg-amber-50 text-amber-700 ring-amber-100",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Waived: "bg-slate-100 text-slate-600 ring-slate-200",
};

interface Props {
  open: boolean;
  onClose: () => void;
  penalty: Penalty | null;
}

export default function ViewPenaltyDetailsModal({
  open,
  onClose,
  penalty,
}: Props) {
  const { settlements, settlementsLoading, getPenaltySettlements } =
    usePenalty();

  useEffect(() => {
    if (open && penalty) getPenaltySettlements(penalty.penalty_id);
  }, [open, penalty, getPenaltySettlements]);

  if (!penalty) return null;

  const outstanding = n(penalty.amount) - n(penalty.amount_paid);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 sm:max-w-105">
        <DialogHeader className="sr-only">
          <DialogTitle>Penalty Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative overflow-hidden px-5 pt-5 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-amber-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
              <AlertTriangle className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="truncate text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                {penalty.penalty_name ?? penalty.reason ?? "Penalty"}
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                Record #{penalty.penalty_id}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5">
          {/* Amount summary */}
          <div className="rounded-xl bg-slate-50/80 p-3.5 ring-1 ring-slate-200">
            <div className="flex items-baseline justify-between">
              <p className="text-[10.5px] font-medium tracking-wide text-slate-500 uppercase">
                Outstanding
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ${STATUS_STYLES[penalty.status]}`}
              >
                {penalty.status}
              </span>
            </div>
            <p
              className={`mt-1 text-[22px] font-bold tracking-tight tabular-nums ${
                outstanding > 0 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {peso(outstanding)}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {peso(n(penalty.amount_paid))} of {peso(n(penalty.amount))}{" "}
              settled
            </p>
          </div>

          {/* Details */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12.5px]">
            <Info label="Penalty Date" value={fmtDate(penalty.penalty_date)} />
            <Info label="Due Date" value={fmtDate(penalty.due_date)} />
            <Info label="Assigned By" value={penalty.assigned_by ?? "—"} />
            <Info label="Settled At" value={fmtDate(penalty.settled_at)} />
          </dl>

          {/* Reason */}
          <div>
            <p className="mb-1 text-[12px] font-medium text-slate-600">
              Reason
            </p>
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-slate-200/70 ring-inset">
              {penalty.penalty_description || penalty.reason || "—"}
            </p>
          </div>

          {/* Settlement history */}
          <div className="pb-1">
            <div className="mb-2 flex items-center gap-2">
              <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[12px] font-semibold text-slate-700">
                Settlement History
              </p>
            </div>

            {settlementsLoading ? (
              <div className="flex items-center gap-2 py-4 text-[12px] text-slate-400">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Loading…
              </div>
            ) : settlements.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-[12px] text-slate-400">
                No settlements recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg ring-1 ring-slate-200/70 ring-inset">
                {settlements.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 bg-white px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium tabular-nums text-slate-800">
                        {peso(n(s.amount_paid))}
                        <span className="ml-2 font-normal text-slate-400">
                          {s.payment_method || "—"}
                        </span>
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[10.5px] text-slate-400">
                        <Calendar size={10} />
                        {fmtDate(s.payment_date)}
                        {s.payment_reference ? ` · ${s.payment_reference}` : ""}
                      </p>
                    </div>
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 rounded-lg bg-slate-900 px-3 text-[12px] font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-[10.5px] tracking-wide text-slate-400 uppercase">
      {label}
    </dt>
    <dd className="mt-0.5 truncate font-medium text-slate-700">{value}</dd>
  </div>
);
