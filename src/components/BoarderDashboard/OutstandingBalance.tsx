"use client";

import { CreditCard } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type OutstandingBalanceProps = {
  amount: number;
  pendingCount: number;
  onViewDetails?: () => void;
};

const OutstandingBalance = ({
  amount,
  pendingCount,
}: OutstandingBalanceProps) => {
  return (
    <Card className="w-full max-w-md rounded-md ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Outstanding Balance
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Total amount due
          </CardDescription>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
          <CreditCard size={18} />
        </div>
      </CardHeader>

      <CardContent className=" flex flex-col items-center justify-center space-y-1 pt-15">
        <p className="text-3xl font-semibold text-red-500">
          ₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-500">
          {pendingCount} payment{pendingCount === 1 ? "" : "s"} pending
        </p>
      </CardContent>
    </Card>
  );
};

export default OutstandingBalance;