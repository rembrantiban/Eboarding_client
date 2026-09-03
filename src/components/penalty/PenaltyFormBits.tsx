"use client";

import { useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

/* ============================================================
   Shared building blocks for the Penalty Management modals
   ============================================================ */

export const peso = (v: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number.isFinite(v) ? v : 0);

export const fmtDate = (v?: string | null) => {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

export const ErrorText = ({ text }: { text: string }) => (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
        <AlertCircle className="h-3 w-3 shrink-0" />
        {text}
    </p>
);

type FieldProps = {
    label: string;
    optional?: boolean;
    error?: string;
    children: React.ReactNode;
};

export const Field = ({ label, optional, error, children }: FieldProps) => (
    <div>
        <label className="mb-1 block text-[12px] font-medium text-slate-600">
            {label}
            {optional && (
                <span className="ml-1 font-normal text-slate-400">(optional)</span>
            )}
        </label>
        {children}
        {error && <ErrorText text={error} />}
    </div>
);

export const inputClass = (error?: string) =>
    `h-9 w-full rounded-lg border bg-white px-3 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-slate-500/20 ${
        error
            ? "border-red-300 bg-red-50/30 focus:border-red-400"
            : "border-slate-200 hover:border-slate-300 focus:border-slate-400"
    }`;

export const textareaClass = (error?: string) =>
    `w-full resize-none rounded-lg border bg-white px-3 py-2 text-[13px] leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-slate-500/20 ${
        error
            ? "border-red-300 bg-red-50/30 focus:border-red-400"
            : "border-slate-200 hover:border-slate-300 focus:border-slate-400"
    }`;

type ModalShellProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    footer: React.ReactNode;
    maxWidth?: string;
};

export const ModalShell = ({
    open,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    maxWidth = "sm:max-w-lg",
}: ModalShellProps) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div
                className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:rounded-2xl ${maxWidth}`}
            >
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-[11.5px] leading-tight text-slate-400">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                    {children}
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-3.5">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export const CancelButton = ({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-lg border border-slate-200 px-4 py-2 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
    >
        Cancel
    </button>
);

export const PrimaryButton = ({
    children,
    disabled,
    onClick,
    tone = "slate",
    type = "button",
}: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    tone?: "slate" | "rose" | "emerald";
    type?: "button" | "submit";
}) => {
    const tones = {
        slate: "bg-slate-900 hover:bg-slate-800",
        rose: "bg-rose-600 hover:bg-rose-700",
        emerald: "bg-emerald-600 hover:bg-emerald-700",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-medium text-white transition-all active:scale-[0.98] disabled:opacity-60 ${tones[tone]}`}
        >
            {children}
        </button>
    );
};
