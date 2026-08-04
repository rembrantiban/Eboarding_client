"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import BillingStatementPrint from "@/components/Billing/BillingStatementPrint";
import type { BillingStatementData } from "@/components/Billing/BillingStatementPrint";

interface PrintBillingButtonProps {
    billing: BillingStatementData;
    receivedBy?: { name: string; role?: string; id?: string };
}

const PAGE_STYLE = `
  @page { size: 80mm auto; margin: 4mm; }
  @media print {
    html, body { background: #fff; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export default function PrintBillingButton({
    billing,
    receivedBy,
}: PrintBillingButtonProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Billing-Statement-${billing.billing_no}`,
        pageStyle: PAGE_STYLE,
    });

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                title="Print billing statement"
                onClick={() => handlePrint()}
                className="h-7 w-7 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
                <Printer className="h-3.5 w-3.5" />
            </Button>

            {/* Kept in the DOM but off-canvas — `hidden`/`display:none` would
                give react-to-print an unrendered node with zero height. */}
            <div className="pointer-events-none fixed -left-2499.75 top-0" aria-hidden>
                <BillingStatementPrint
                    ref={printRef}
                    billing={billing}
                    receivedBy={receivedBy}
                />
            </div>
        </>
    );
}