"use client";
import { Wallet, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export interface BillingStatsData {
    total_billings: number;
    total_billings_period_label?: string; // e.g. "This Month"
    paid_amount: number;
    paid_percentage: number;
    partial_amount: number;
    partial_percentage: number;
    overdue_amount: number;
    overdue_percentage: number;
}

interface BillingStatsProps {
    data: BillingStatsData;
    loading?: boolean;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    accent: string;
    label: string;
    value: string;
    caption: string;
}

function StatCard({
    icon,
    iconBg,
    iconColor,
    accent,
    label,
    value,
    caption,
}: StatCardProps) {
    return (
        <div className="group relative flex-1 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-800 px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300">
            <span
                className={`absolute inset-y-0 left-0 w-0.5 ${accent} opacity-0 transition-opacity group-hover:opacity-100`}
            />
            <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-200">
                    {label}
                </p>
                <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
                >
                    {icon}
                </div>
            </div>
            <p className="mt-1.5 truncate text-[17px] font-semibold leading-tight tracking-tight text-slate-200">
                {value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{caption}</p>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="flex-1 animate-pulse rounded-xl border border-slate-200/70 bg-white px-3.5 py-3">
            <div className="flex items-start justify-between">
                <div className="h-2.5 w-20 rounded bg-slate-100" />
                <div className="h-7 w-7 rounded-lg bg-slate-100" />
            </div>
            <div className="mt-2.5 h-4 w-28 rounded bg-slate-100" />
            <div className="mt-2 h-2.5 w-12 rounded bg-slate-100" />
        </div>
    );
}

export default function BillingStats({ data, loading }: BillingStatsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                icon={<Wallet size={14} />}
                iconBg="bg-slate-100"
                iconColor="text-slate-600"
                accent="bg-slate-400"
                label="Total Billings"
                value={formatCurrency(data.total_billings)}
                caption={data.total_billings_period_label ?? "This Month"}
            />
            <StatCard
                icon={<CheckCircle2 size={14} />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                accent="bg-emerald-500"
                label="Paid"
                value={formatCurrency(data.paid_amount)}
                caption={`${data.paid_percentage.toFixed(2)}% of total`}
            />
            <StatCard
                icon={<Clock size={14} />}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                accent="bg-amber-500"
                label="Partial Payments"
                value={formatCurrency(data.partial_amount)}
                caption={`${data.partial_percentage.toFixed(2)}% of total`}
            />
            <StatCard
                icon={<AlertTriangle size={14} />}
                iconBg="bg-rose-50"
                iconColor="text-rose-600"
                accent="bg-rose-500"
                label="Overdue"
                value={formatCurrency(data.overdue_amount)}
                caption={`${data.overdue_percentage.toFixed(2)}% of total`}
            />
        </div>
    );
}