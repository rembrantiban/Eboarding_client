"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  ChevronRight,
  ReceiptText,
  Gavel,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { usePenalty } from "@/hooks/usePenalty";
import { useBilling } from "@/hooks/useBilling";
import type { Penalty } from "@/store/usePenaltyStore";
import ViewPenaltyDetailsModal from "./ViewPenaltyDetailsModal";

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

const ActivePenalties = () => {
  const navigate = useNavigate();
  const { myPenalties, myPenaltiesLoading, getMyPenalties } = usePenalty();
  const { myOverduePenalties, getMyOverduePenalties } = useBilling();
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);

  useEffect(() => {
    getMyPenalties();
    getMyOverduePenalties();
  }, [getMyPenalties, getMyOverduePenalties]);

  // Overdue billing penalties are paid together with the billing,
  // so only those on still-overdue billings count as active.
  const overduePenalties = myOverduePenalties.filter(
    (p) => p.status === "Overdue"
  );

  const totalCount = myPenalties.length + overduePenalties.length;
  const totalDue =
    myPenalties.reduce((t, p) => t + n(p.amount) - n(p.amount_paid), 0) +
    overduePenalties.reduce((t, p) => t + n(p.penalty_amount), 0);

  const hasPenalties = totalCount > 0;

  return (
    <>
    <Card className="w-full max-w-sm rounded-md border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Active Penalties
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {hasPenalties ? (
              <>
                You have {totalCount} active penalt
                {totalCount === 1 ? "y" : "ies"} ·{" "}
                <span className="font-semibold text-red-500">
                  {peso(totalDue)}
                </span>{" "}
                to pay
              </>
            ) : (
              "You have no active penalties"
            )}
          </CardDescription>
        </div>
        <AlertTriangle
          size={18}
          className={hasPenalties ? "text-amber-500" : "text-gray-300"}
        />
      </CardHeader>

      <CardContent className="pt-2">
        {myPenaltiesLoading && myPenalties.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center text-gray-400">
            <LoaderCircle size={20} className="animate-spin" />
            <p className="mt-3 text-sm">Loading penalties…</p>
          </div>
        ) : hasPenalties ? (
          <div className="space-y-1">
            {overduePenalties.map((p) => (
              <button
                key={`billing-${p.id}`}
                type="button"
                onClick={() => navigate("/boarder-billing")}
                className="flex w-full items-start justify-between gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-gray-50"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <ReceiptText size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      Late payment penalty
                    </span>
                    <span className="block text-xs text-gray-500">
                      Billing #{p.billing_no} is {p.overdue_weeks_charged} week
                      {p.overdue_weeks_charged === 1 ? "" : "s"} overdue
                    </span>
                    <span className="block text-xs text-gray-400">
                      ₱100 is added every week until the bill is paid
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-sm font-semibold text-red-500">
                    {peso(n(p.penalty_amount))}
                  </span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </button>
            ))}

            {myPenalties.map((penalty) => {
              const outstanding = n(penalty.amount) - n(penalty.amount_paid);

              return (
                <button
                  key={penalty.penalty_id}
                  type="button"
                  onClick={() => setSelectedPenalty(penalty)}
                  className="flex w-full items-start justify-between gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Gavel size={16} className="mt-0.5 shrink-0 text-amber-400" />
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {penalty.penalty_name ?? penalty.reason ?? "Penalty"}
                      </span>
                      <span className="block text-xs text-gray-500">
                        Rule violation · {penalty.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-sm font-semibold text-red-500">
                      {peso(outstanding)}
                    </span>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => navigate("/boarder/penalties")}
              className="mt-2 w-full rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            >
              View all penalties
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500">
              <CheckCircle2 size={20} />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-900">
              No active penalties
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Great! You have no active penalties.
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    <ViewPenaltyDetailsModal
      open={selectedPenalty !== null}
      onClose={() => setSelectedPenalty(null)}
      penalty={selectedPenalty}
    />
    </>
  );
};

export default ActivePenalties;
