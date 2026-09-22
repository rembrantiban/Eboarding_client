import type { User } from "@/store/useAuthStore"
import { Info, Mail, RotateCcw, UserIcon, X } from "lucide-react";



interface RestoreConfirmModalProps {
    user: User;
    onCancel: () => void;
    onConfirm: () => void;
}

const RestoreConfirmModal = ({ user, onCancel, onConfirm }: RestoreConfirmModalProps) => {
    const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();

    return (
        <div
            className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-xl bg-white shadow-xl"
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X size={14} />
                </button>

                <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <RotateCcw size={18} className="text-slate-700" />
                    </div>

                    <h2 className="text-[15px] font-semibold text-slate-900">Restore this user account?</h2>
                    <p className="mt-1 text-[13px] text-slate-500 leading-relaxed max-w-70">
                        Are you sure you want to restore this user account? They will be able to access the system again.
                    </p>

                    {/* User summary card */}
                    <div className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50/60 p-3 flex items-center gap-2.5 text-left">
                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-[13px]">
                                {user.first_name} {user.last_name}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 truncate">
                                <Mail size={12} className="shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <span
                                className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-medium border
                                      ${user.user_type === "Admin"
                                        ? "bg-rose-50 border-rose-200 text-rose-700"
                                        : user.user_type === "Staff"
                                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                            : "bg-slate-100 border-slate-200 text-slate-700"
                                    }`}
                            >
                                <UserIcon size={10} />
                                {user.user_type}
                            </span>
                        </div>
                    </div>

                    {/* Info note */}
                    <div className="mt-2.5 w-full rounded-lg bg-blue-50 p-2.5 flex items-start gap-2 text-left">
                        <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-700 leading-snug">
                            All user data and account settings will be restored to the previous state before deletion.
                        </p>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
                    <button
                        onClick={onCancel}
                        className="px-3.5 py-1.5 text-[13px] font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <RotateCcw size={13} />
                        Yes, restore account
                    </button>
                </div>
            </div>
        </div>
    );
}


export default RestoreConfirmModal