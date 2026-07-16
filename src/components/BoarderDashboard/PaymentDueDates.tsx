"use client";

import { Calendar, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Payment = {
  date: string;
  dueLabel: string;
  amount: number;
};

const payments: Payment[] = [
  { date: "May 24, 2025", dueLabel: "Due in 6 days", amount: 1250 },
  { date: "Jun 24, 2025", dueLabel: "Due in 1 month", amount: 6500 },
  { date: "Jul 24, 2025", dueLabel: "Due in 2 months", amount: 6500 },
];

const PaymentDueDates = () => {
  return (
    <Card className="w-full max-w-md rounded-md ">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 ">
        <div>
          <CardTitle className="text-base font-semibold text-gray-900">
            Payment Due Dates
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your upcoming payments
          </CardDescription>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-slate-600">
          <Calendar size={18} />
        </div>
      </CardHeader>

      <CardContent className=" pt-2">
        {payments.map((payment, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl px-2 py-3 transition hover:bg-gray-50"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-900">
                {payment.date}
              </span>
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-slate-100 border px-2 py-0.5 text-xs font-medium text-slate-900">
                {payment.dueLabel}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ₱{payment.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
        >
          View all
          <ArrowUpRight size={14} />
        </button>
      </CardContent>
    </Card>
  );
};

export default PaymentDueDates;