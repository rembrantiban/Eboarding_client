"use client";
import { useEffect } from "react";
import { X, Printer } from "lucide-react";
import PaymentReceipt from "./PaymentReceipt";
import type { PaymentHistory } from "@/store/useBillingStore"

interface ReceiptModalProps {
    payment: PaymentHistory | null;
    onClose: () => void;
    companyName?: string;
    tagline?: string;
    stampSubtext?: string;
}


function usePrintIsolation() {
    useEffect(() => {
        const id = "receipt-print-styles";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.innerHTML = `
           @media print {

    body * {
        visibility: hidden;
    }

    #receipt-print-root,
    #receipt-print-root * {
        visibility: visible !important;
    }

    #receipt-print-root {
        position: fixed;
        inset: 0;
        width: 100%;
        padding: 24px;
        background: white;
    }

    svg,
    svg * {
        visibility: visible !important;
        display: inline-block !important;
        fill: currentColor !important;
        stroke: currentColor !important;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    * {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
}
        `;
        document.head.appendChild(style);
    }, []);
}

export default function ReceiptModal({ payment, onClose, companyName, tagline, stampSubtext }: ReceiptModalProps) {
    usePrintIsolation();

    useEffect(() => {
        if (!payment) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [payment, onClose]);

    if (!payment) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 px-4 py-8 backdrop-blur-sm "
            onClick={onClose}
        >
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                {/* Action bar — not part of the printed output */}
                <div className="mb-3 flex items-center justify-between">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800"
                    >
                        <Printer size={13} />
                        Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
                        aria-label="Close"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Printable area */}
                <div id="receipt-print-root">
                    <PaymentReceipt payment={payment} companyName={companyName} tagline={tagline} stampSubtext={stampSubtext} />
                </div>
            </div>
        </div>
    );
}