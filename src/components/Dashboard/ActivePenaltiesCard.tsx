import { usePenalty } from "@/hooks/usePenalty";
import { ChevronRight, AlertTriangle, X, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const VISIBLE_PENALTIES = 3;

function formatCurrency(v: number) {
  return `₱${Number(v).toLocaleString("en-PH")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------- Row (shared by card + "view all" modal) ---------- */

type PenaltyRowProps = {
  penalty_id: number;
  initials: string;
  boarder: string;
  reason: string;
  status: string;
  amount: number;
  date: string;
};

function PenaltyRow({ penalty }: { penalty: PenaltyRowProps }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-2.5 py-2.5 transition-all hover:border-gray-300 hover:bg-gray-50/80">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[12px] font-semibold text-white">
        {penalty.initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-gray-900">
          {penalty.boarder}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] text-gray-500">
          {penalty.reason}
        </p>
        <p className="mt-0.5 truncate text-[10.5px] text-gray-400">
          {penalty.status} · Due {formatDate(penalty.date)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-red-700 ring-1 ring-red-100">
          {formatCurrency(penalty.amount)}
        </span>
      </div>
    </div>
  );
}

export default function ActivePenaltiesCard() {
  const {
    penalties,
    getAllPenalties,
  } = usePenalty();

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getAllPenalties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showAll) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowAll(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAll]);

  const activePenalties: PenaltyRowProps[] = useMemo(
    () =>
      penalties
        .filter((p) => p.status === "Pending" || p.status === "Partially Paid")
        .map((p) => ({
          penalty_id: p.penalty_id,
          initials: `${p.first_name?.charAt(0) ?? ""}${p.last_name?.charAt(0) ?? ""}`.toUpperCase(),
          boarder: `${p.first_name} ${p.last_name}`,
          reason: p.penalty_name ?? p.reason ?? "Penalty",
          status: p.status,
          amount: Number(p.amount) - Number(p.amount_paid || 0),
          date: p.due_date ?? p.penalty_date,
        })),
    [penalties]
  );

  const visiblePenalties = activePenalties.slice(0, VISIBLE_PENALTIES);
  const totalAmount = activePenalties.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (
    <div className="flex w-full flex-col rounded border border-gray-200/80 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold leading-tight text-gray-900">
              Active Penalties
            </h3>
            <p className="text-[11px] leading-tight text-gray-400">
              Unsettled penalties
            </p>
          </div>
        </div>

        {activePenalties.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-semibold tabular-nums text-gray-600">
            {activePenalties.length}
          </span>
        )}
      </div>

      {activePenalties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-12 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-[13px] font-semibold text-gray-900">
            All clear
          </p>
          <p className="mt-1 max-w-55 text-[11.5px] leading-relaxed text-gray-400">
            No active penalties right now. Boarders are all in good standing.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {visiblePenalties.map((p) => (
              <PenaltyRow key={p.penalty_id} penalty={p} />
            ))}
          </div>

          <div className="mt-auto pt-3">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
            >
              View all penalties
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}

      {/* View all modal */}
      {showAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-[2px]"
          onClick={() => setShowAll(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold leading-tight text-gray-900">
                    All Penalties
                  </h4>
                  <p className="text-[11.5px] leading-tight text-gray-400">
                    {activePenalties.length} active ·{" "}
                    <span className="font-medium text-red-600">
                      {formatCurrency(totalAmount)}
                    </span>{" "}
                    total
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
              {activePenalties.map((p) => (
                <PenaltyRow key={p.penalty_id} penalty={p} />
              ))}
            </div>

            <div className="border-t border-gray-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="w-full rounded-xl border border-gray-200 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
