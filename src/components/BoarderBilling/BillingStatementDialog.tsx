"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Download,
  Mail,
  Phone,
  Printer,
  Receipt,
} from "lucide-react";

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


type BillingStatementDialogProps = {
  billing: Billing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (billing: Billing) => void;
};

const statusStyles: Record<Billing["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  Partial: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  Overdue: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  Cancelled: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const BillingStatementDialog = ({
  billing,
  open,
  onOpenChange,
  onDownload,
}: BillingStatementDialogProps) => {
  if (!billing) return null;

  const charges = [
    { label: "Room Fee", value: billing.room_fee },
    { label: "Utilities Fee", value: billing.utilities_fee },
    { label: "Other Charges", value: billing.other_charges },
  ];

  const handlePrint = () => window.print();
  const handleDownload = () => onDownload?.(billing);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 print:max-w-full print:rounded-none print:border-none print:shadow-none">
        <div id="billing-statement-print" className="bg-white">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 bg-slate-900 px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogHeader className="p-0 text-left">
                  <DialogTitle className="text-base font-semibold text-white">
                    Billing Statement
                  </DialogTitle>
                </DialogHeader>
                <p className="text-xs text-slate-300">
                  Statement No. <span className="font-medium text-white">{billing.billing_no}</span>
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[billing.status]}`}
            >
              {billing.status}
            </span>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-6 print:max-h-none print:overflow-visible">
            {/* Boarder + billing meta */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Billed to
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {billing.avatar_url ? (
                      <img
                        src={billing.avatar_url}
                        alt={`${billing.first_name} ${billing.last_name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials(billing.first_name, billing.last_name)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {billing.first_name} {billing.last_name}
                    </p>
                    <p className="text-xs text-slate-500">ID No. {billing.user_id_no}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {billing.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {billing.contact_number}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Statement details
                </p>
                <dl className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between gap-4 sm:justify-end">
                    <dt className="text-slate-500">Billing type</dt>
                    <dd className="font-medium text-slate-700">{billing.billing_type}</dd>
                  </div>
                  <div className="flex justify-between gap-4 sm:justify-end">
                    <dt className="text-slate-500">Billing month</dt>
                    <dd className="font-medium text-slate-700">
                      {billing.billing_month ?? "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 sm:justify-end">
                    <dt className="text-slate-500">Due date</dt>
                    <dd className="font-medium text-slate-700">{formatDate(billing.due_date)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <Separator className="my-5 bg-slate-100" />

            {/* Room / bed assignment */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50/70 p-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Room
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {billing.room_number ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Bed
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {billing.bed_number ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Move-in
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(billing.assigned_date)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Expected checkout
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(billing.expected_checkout)}
                </p>
              </div>
            </div>

            {/* Charges breakdown */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Charges
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <tbody>
                    {charges.map((charge, idx) => (
                      <tr
                        key={charge.label}
                        className={idx !== charges.length - 1 ? "border-b border-slate-100" : ""}
                      >
                        <td className="px-4 py-2.5 text-slate-600">{charge.label}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                          {formatCurrency(charge.value)}
                        </td>
                      </tr>
                    ))}
                    {billing.discount > 0 && (
                      <tr className="border-b border-slate-100">
                        <td className="px-4 py-2.5 text-slate-600">Discount</td>
                        <td className="px-4 py-2.5 text-right font-medium text-emerald-600">
                          −{formatCurrency(billing.discount)}
                        </td>
                      </tr>
                    )}
                    {billing.late_fee > 0 && (
                      <tr>
                        <td className="px-4 py-2.5 text-slate-600">Late Fee</td>
                        <td className="px-4 py-2.5 text-right font-medium text-red-600">
                          +{formatCurrency(billing.late_fee)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Total Amount</span>
                <span className="font-semibold">{formatCurrency(billing.total_amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Paid Amount</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(billing.paid_amount)}
                </span>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">Balance Due</span>
                <span className="text-lg font-bold">{formatCurrency(billing.balance)}</span>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Receipt className="h-3 w-3" />
              Generated on {formatDate(new Date().toISOString())} · Statement created{" "}
              {formatDate(billing.created_at)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 print:hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-slate-900 text-white hover:bg-slate-800"
              onClick={handlePrint}
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingStatementDialog;