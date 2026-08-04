import type { User } from "@/store/useAuthStore"
import { Info, Loader2, Mail, RotateCcw, UserIcon, X } from "lucide-react";



interface RestoreConfirmModalProps {
    user: User;
    isSubmitting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const RestoreConfirmModal = ({ user, isSubmitting, onCancel, onConfirm }: RestoreConfirmModalProps) => {
    const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <RotateCcw size={22} className="text-slate-700" />
                    </div>

                    <h2 className="text-lg font-semibold text-slate-900">Restore user account?</h2>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-[320px]">
                        This user account will be restored and the user will be able to access the system again.
                    </p>

                    {/* User summary card */}
                    <div className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex items-center gap-3 text-left">
                        <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-sm">
                                {user.first_name} {user.last_name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 truncate">
                                <Mail size={13} className="shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                                <UserIcon size={11} />
                                <span
                                    className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border
                                          ${user.user_type === "Admin"
                                            ? "bg-rose-50 border-rose-200 text-rose-700"
                                            : user.user_type === "Staff"
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                : "bg-slate-100 border-slate-200 text-slate-700"
                                        }`}
                                >
                                    {user.user_type}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="mt-3 w-full rounded-xl bg-blue-50 p-3.5 flex items-start gap-2.5 text-left">
                        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-700 leading-snug">
                            All user data and account settings will be restored to the previous state before deletion.
                        </p>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <RotateCcw size={14} />
                        )}
                        {isSubmitting ? "Restoring..." : "Yes, restore account"}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default RestoreConfirmModal