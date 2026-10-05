import { useEffect } from "react";
import { Clock, LogIn } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getTokenExpiry, useSessionStore } from "@/store/useSessionStore";

export default function SessionExpiredModal() {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const expired = useSessionStore((state) => state.expired);
    const showExpired = useSessionStore((state) => state.showExpired);
    const reset = useSessionStore((state) => state.reset);

    // Open the modal the moment the token's exp time passes, even if the user is idle
    useEffect(() => {
        if (!token) return;

        const expiry = getTokenExpiry(token);
        if (!expiry) return;

        const remaining = expiry - Date.now();
        if (remaining <= 0) {
            showExpired();
            return;
        }

        // setTimeout overflows above ~24.8 days; tokens here last 1 day
        const timer = setTimeout(showExpired, Math.min(remaining, 2_147_483_647));
        return () => clearTimeout(timer);
    }, [token, showExpired]);

    const handleLoginAgain = async () => {
        await logout();
        reset();
        navigate("/login", { replace: true });
    };

    if (!expired || !token) return null;

    return createPortal(
        <div
            className="fixed z-9999 inset-0 flex items-center justify-center p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-expired-title"
            aria-describedby="session-expired-description"
        >
            {/* Backdrop (not clickable — the user must sign in again) */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full flex flex-col justify-center items-center max-w-sm z-50 rounded-2xl bg-white p-6 shadow-xl outline-none animate-in fade-in zoom-in-95 duration-150">
                {/* Icon */}
                <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-amber-50">
                    <Clock size={22} className="text-amber-600" />
                </div>

                {/* Content */}
                <h2
                    id="session-expired-title"
                    className="text-base font-semibold text-slate-900"
                >
                    Login Session Expired
                </h2>
                <p
                    id="session-expired-description"
                    className="mt-1.5 text-sm text-center leading-relaxed text-slate-500"
                >
                    Your session has expired for security reasons. Please log in
                    again to continue.
                </p>

                {/* Actions */}
                <div className="mt-6 flex w-full items-center justify-center">
                    <button
                        autoFocus
                        onClick={handleLoginAgain}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                    >
                        <LogIn size={16} />
                        Log in again
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
