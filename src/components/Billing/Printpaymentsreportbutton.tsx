"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentsReportPrint from "./PaymentsReportPrint";
import type { Billing } from "@/store/useBillingStore";

interface PrintPaymentsReportButtonProps {
    billings: Billing[];
    month?: Date;
    preparedBy?: { name: string; role?: string };
    verifiedBy?: { name: string; role?: string };
}

const PAGE_STYLE = `
  @page { size: A4 landscape; margin: 10mm; }
  @media print {
    html, body { background: #fff; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    thead { display: table-header-group; }
    tfoot { display: table-row-group; }
    tr { page-break-inside: avoid; }
  }
`;

export default function PrintPaymentsReportButton({
    billings,
    month = new Date(),
    preparedBy,
    verifiedBy,
}: PrintPaymentsReportButtonProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Collection-Report-${month.toLocaleDateString("en-PH", {
            month: "short",
            year: "numeric",
        })}`,
        pageStyle: PAGE_STYLE,
    });

    return (
        <>
            <Button
                variant="outline"
                onClick={() => handlePrint()}
                className="h-8 gap-1.5 rounded-lg border-slate-200 px-2.5 text-[13px] font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
                <Download className="h-3.5 w-3.5" />
                 Export
            </Button>

            <div className="pointer-events-none fixed -left-2499.75 top-0 w-280" aria-hidden>
                <PaymentsReportPrint
                    ref={printRef}
                    billings={billings}
                    month={month}
                    preparedBy={preparedBy}
                    verifiedBy={verifiedBy}
                />
            </div>
        </>
    );
}