"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Penalty = {
  label: string;
  amount: number;
};

type ActivePenaltiesProps = {
  penalties?: Penalty[];
  onViewAll?: () => void;
};

const ActivePenalties = ({ penalties = [] }: ActivePenaltiesProps) => {
  const hasPenalties = penalties.length > 0;

  return (
    <Card className="w-full max-w-sm rounded-md border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Active Penalties
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            You have {penalties.length} active penalt{penalties.length === 1 ? "y" : "ies"}
          </CardDescription>
        </div>
        <AlertTriangle
          size={18}
          className={hasPenalties ? "text-amber-500" : "text-gray-300"}
        />
      </CardHeader>

      <CardContent className="pt-2">
        {hasPenalties ? (
          <div className="space-y-1">
            {penalties.map((penalty, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl px-2 py-3 transition hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">
                  {penalty.label}
                </span>
                <span className="text-sm font-semibold text-red-500">
                  ₱{penalty.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
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
  );
};

export default ActivePenalties;