"use client";
import { useEffect, type ReactNode } from "react";
import { X, Download } from "lucide-react";


function usePrintIsolation(rootId: string, open: boolean, receiptWidthMm?: number) {
    useEffect(() => {
        const styleId = `${rootId}-styles`;
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();

        // Only isolate the page for print while this modal is actually open —
        // otherwise the "hide everything but #rootId" rule stays in <head>
        // and blanks out any *other* print/react-to-print output on this page.
        if (!open) return;

        const style = document.createElement("style");
        style.id = styleId;

        style.innerHTML = receiptWidthMm
            ? `
            @media print {
                body * { visibility: hidden; }
                #${rootId}, #${rootId} * { visibility: visible; }
                #${rootId} {
                    position: fixed;
                    inset: 0;
                    width: ${receiptWidthMm}mm;
                    max-width: ${receiptWidthMm}mm;
                    margin: 0 auto;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #${rootId} .max-w-md,
                #${rootId} .max-w-105 {
                    max-width: 100% !important;
                }
                @page { size: ${receiptWidthMm}mm 250mm; margin: 0; }
            }
        `
            : `
            @media print {
                body * { visibility: hidden; }
                #${rootId}, #${rootId} * { visibility: visible; }
                #${rootId} {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    margin: 0 auto;
                    padding: 24px;
                }
                @page { margin: 0; }
            }
        `;

        document.head.appendChild(style);

        return () => {
            style.remove();
        };
    }, [rootId, open, receiptWidthMm]);
}

interface PrintModalProps {
    open: boolean;
    onClose: () => void;
    rootId: string;
    printLabel?: string;
    maxWidthClassName?: string;
    /** Prints at this physical width (mm), like a real receipt roll, instead of a full page. */
    receiptWidthMm?: number;
    children: ReactNode;
}

export default function PrintModal({
    open,
    onClose,
    rootId,
    maxWidthClassName = "max-w-md",
    receiptWidthMm,
    children,
}: PrintModalProps) {
    usePrintIsolation(rootId, open, receiptWidthMm);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-sm "
            onClick={onClose}
        >
            <div className={`w-full ${maxWidthClassName}`} onClick={(e) => e.stopPropagation()}>
                {/* Action bar — never part of the printed output */}
                <div className="mb-3 flex items-center justify-between">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        <Download size={13} />
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Close"
                    >
                        <X size={15} />
                    </button>
                </div>

                <div id={rootId}>{children}</div>
            </div>
        </div>
    );
}