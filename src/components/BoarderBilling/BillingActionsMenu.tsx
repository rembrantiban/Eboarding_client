"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, Eye, MoreHorizontal, Printer } from "lucide-react";
import BillingStatementDialog from "./BillingStatementDialog";

export interface Billing {
    id: number;

    billing_no: string;

    billing_type: string;
    billing_month: string | null;
    due_date: string;

    room_fee: number;
    utilities_fee: number;
    other_charges: number;

    discount: number;
    late_fee: number;

    total_amount: number;
    paid_amount: number;
    balance: number;

    status:
    | "Pending"
    | "Partial"
    | "Paid"
    | "Overdue"
    | "Cancelled";

    created_at: string;
    updated_at: string;

    user_id: number;
    user_id_no: string;

    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_url: string | null;

    assignment_id: number | null;
    assigned_date: string | null;
    expected_checkout: string | null;

    room_id: number | null;
    room_number: string | null;

    bed_id: number | null;
    bed_number: string | null;
}


type BillingActionsMenuProps = {
  billing: Billing;
  onDownload?: (billing: Billing) => void;
};

const BillingActionsMenu = ({ billing, onDownload }: BillingActionsMenuProps) => {
  const [statementOpen, setStatementOpen] = useState(false);

  const handlePrint = () => {
    setStatementOpen(true);
    // Give the dialog a tick to render before invoking the print dialog.
    setTimeout(() => window.print(), 150);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open billing actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-200 p-1.5">
          <DropdownMenuItem
            onClick={() => setStatementOpen(true)}
            className="gap-2 rounded-lg text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            View Billing Statement
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onDownload?.(billing)}
            className="gap-2 rounded-lg text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Download Billing Statement
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100" />

          <DropdownMenuItem
            onClick={handlePrint}
            className="gap-2 rounded-lg text-sm text-slate-700 focus:bg-slate-100 focus:text-slate-900"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print Billing Statement
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BillingStatementDialog
        billing={billing}
        open={statementOpen}
        onOpenChange={setStatementOpen}
        onDownload={onDownload}
      />
    </>
  );
};

export default BillingActionsMenu;