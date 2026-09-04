"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, LoaderCircle, ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { usePenalty } from "@/hooks/usePenalty";
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
  const { myPenalties, myPenaltiesLoading, getMyPenalties } = usePenalty();
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);

  useEffect(() => {
    getMyPenalties();
  }, [getMyPenalties]);

  const hasPenalties = myPenalties.length > 0;

  return (
    <>
    <Card className="w-full max-w-sm rounded-md border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Active Penalties
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            You have {myPenalties.length} active penalt
            {myPenalties.length === 1 ? "y" : "ies"}
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
            {myPenalties.map((penalty) => {
              const outstanding = n(penalty.amount) - n(penalty.amount_paid);

              return (
                <button
                  key={penalty.penalty_id}
                  type="button"
                  onClick={() => setSelectedPenalty(penalty)}
                  className="flex w-full items-center justify-between rounded-xl px-2 py-3 text-left transition hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      {penalty.penalty_name ?? penalty.reason ?? "Penalty"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {penalty.status}
                    </span>
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
