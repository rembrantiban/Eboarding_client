import { useEffect, useRef, } from "react";
import { LogOut, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function LogoutModal({
    isOpen = false,
    onClose = () => { },
    onConfirm = () => { },
    isLoading = false,
}) {

    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () =>
            document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }

    }, [isOpen]);
    if (!isOpen) return null;

    return createPortal(
        <div

            className="fixed  z-9999 inset-0 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
        >
            {/* Backdrop */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative w-full flex flex-col justify-center items-center max-w-sm z-50 rounded-2xl bg-white p-6 shadow-xl outline-none animate-in fade-in zoom-in-95 duration-150"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-red-50">
                    <LogOut size={22} className="text-red-600" />
                </div>

                {/* Content */}
                <h2
                    id="logout-modal-title"
                    className="text-base  font-semibold text-slate-900"
                >
                    Sign out
                </h2>
                <p className="mt-1.5 text-sm text-center leading-relaxed text-slate-500">
                    Are you sure you want to sign out? You'll need to sign in again to
                    access your account.
                </p>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOut size={16} />
                                Sign out
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}