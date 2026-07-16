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
    label: string;
    value: string;
    caption: string;
}

function StatCard({ icon, iconBg, iconColor, label, value, caption }: StatCardProps) {
    return (
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">{label}</p>
                    <p className="mt-0.5 truncate text-lg font-semibold text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{caption}</p>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="flex-1 animate-pulse rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-16 rounded bg-slate-100" />
                    <div className="h-5 w-24 rounded bg-slate-100" />
                </div>
            </div>
            <div className="mt-3 h-3 w-14 rounded bg-slate-100" />
        </div>
    );
}

export default function BillingStats({ data, loading }: BillingStatsProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-3 sm:flex-row">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <StatCard
                icon={<Wallet size={18} />}
                iconBg="bg-blue-50"
                iconColor="text-blue-500"
                label="Total Billings"
                value={formatCurrency(data.total_billings)}
                caption={data.total_billings_period_label ?? "This Month"}
            />
            <StatCard
                icon={<CheckCircle2 size={18} />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-500"
                label="Paid"
                value={formatCurrency(data.paid_amount)}
                caption={`${data.paid_percentage.toFixed(2)}%`}
            />
            <StatCard
                icon={<Clock size={18} />}
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                label="Partial Payments"
                value={formatCurrency(data.partial_amount)}
                caption={`${data.partial_percentage.toFixed(2)}%`}
            />
            <StatCard
                icon={<AlertTriangle size={18} />}
                iconBg="bg-rose-50"
                iconColor="text-rose-500"
                label="Overdue"
                value={formatCurrency(data.overdue_amount)}
                caption={`${data.overdue_percentage.toFixed(2)}%`}
            />
        </div>
    );
}