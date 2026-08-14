import { useEffect, useRef, useState } from "react";
import { Download, ChevronDown, FileSpreadsheet, Printer, Loader2 } from "lucide-react";
import {
    exportFinancialReportExcel,
    type ExportFinancialReportOptions,
} from "./exportFinancialReportExcel";

interface ExportMenuProps extends ExportFinancialReportOptions {
    onPrint?: () => void;
}

export default function ExportMenu({ onPrint, ...reportData }: ExportMenuProps) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const onDocClick = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    const handleExcel = async () => {
        setBusy(true);
        try {
            await exportFinancialReportExcel(reportData);
            setOpen(false);
        } catch (err) {
            console.error("Excel export failed:", err);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div ref={wrapRef} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-[11.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-70"
            >
                {busy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Download className="h-3.5 w-3.5" />
                )}
                {busy ? "Preparing…" : "Export"}
                <ChevronDown
                    className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {open && (
                <div className="absolute right-0 z-30 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    <button
                        onClick={handleExcel}
                        disabled={busy}
                        className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50 disabled:opacity-60"
                    >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[12px] font-medium text-slate-900">
                                Microsoft Excel
                            </span>
                            <span className="block text-[10.5px] text-slate-400">
                                Formatted report + raw data sheet
                            </span>
                        </span>
                    </button>

                    {onPrint && (
                        <button
                            onClick={() => {
                                setOpen(false);
                                onPrint();
                            }}
                            className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50"
                        >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                                <Printer className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[12px] font-medium text-slate-900">
                                    Print or save as PDF
                                </span>
                                <span className="block text-[10.5px] text-slate-400">
                                    A4 document layout
                                </span>
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}