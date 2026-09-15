import { useRef } from "react";
import { X, Printer, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import RoomAvailabilityDocument, {
    type RoomAvailabilityDocumentProps,
} from "./RoomAvailabilityDocument";

interface PrintRoomAvailabilityModalProps extends RoomAvailabilityDocumentProps {
    open: boolean;
    onClose: () => void;
}

export default function PrintRoomAvailabilityModal({
    open,
    onClose,
    ...docProps
}: PrintRoomAvailabilityModalProps) {
    const docRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: docRef,
        documentTitle: `Room Availability Report — ${docProps.periodLabel ??
            new Date().toLocaleString("en-PH", { month: "long", year: "numeric" })
            }`,
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/40 backdrop-blur-sm">
            {/* Toolbar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <FileText className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-[12.5px] font-semibold tracking-tight text-slate-900">
                            Print preview
                        </p>
                        <p className="text-[11px] text-slate-400">
                            A4 portrait · Room Availability Report
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-[11.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Print report
                    </button>
                    <button
                        onClick={onClose}
                        aria-label="Close preview"
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Paper */}
            <div className="flex-1 overflow-y-auto bg-slate-200/70 px-4 py-6">
                <div className="mx-auto w-fit rounded-sm bg-white shadow-2xl ring-1 ring-slate-300/60">
                    <RoomAvailabilityDocument ref={docRef} {...docProps} />
                </div>
            </div>
        </div>
    );
}
