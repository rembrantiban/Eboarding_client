"use client";
import { useEffect } from "react"
import {
    Wallet,
    Calendar,
    Home,

    Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { useRoom } from "@/hooks/useRoom";
import PaymentDueDates from "@/components/BoarderDashboard/PaymentDueDates";
import OutstandingBalance from "@/components/BoarderDashboard/OutstandingBalance"
import ActivePenalties from "@/components/BoarderDashboard/ActivePenalties"
import FullCalendar from "@/components/BoarderDashboard/FullCalendar";



export default function BoarderDashboard() {
    const { user } = useAuth();
    const { getUpcomingPayment, upcomingPayment, getRecentPayments, } = usePayment();
    const { getMyDashboard, dashboard } = useRoom();
    useEffect(() => {
        getUpcomingPayment();
        getRecentPayments();
        getMyDashboard();
    }, [getUpcomingPayment, getRecentPayments, getMyDashboard]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const stats = [
        {
            label: "Room",
            value: `Room ${dashboard?.room.roomNumber}`,
            sub: "Double occupancy",
            icon: Home,
        },
        {
            label: "Monthly rate",
            value: `₱${dashboard?.monthlyRate?.toLocaleString()}`,
            sub: "Billed monthly",
            icon: Wallet,
        },

        {
            label: "Stay duration",
            value: `${dashboard?.stay.months} months`,
            sub: `Since ${formatDate(dashboard?.stay.moveInDate ?? "")}`,
            icon: Clock,
        },
    ];


    return (
        <div className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Greeting */}
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Welcome back{user?.first_name ? `, ${user.first_name}` : ""} 👋
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Here's what's happening with your stay
                    </p>
                </div>

                {/* Upcoming payment — hero card */}
                <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-8">
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                                <Clock size={12} />
                                Due in {upcomingPayment?.daysLeft} days
                            </span>

                            <p className="mt-4 text-sm text-white/60">
                                {upcomingPayment?.label}
                            </p>
                            <p className="mt-1 text-4xl font-semibold tracking-tight text-white">
                                ₱{upcomingPayment?.amount.toLocaleString()}
                            </p>
                            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                                <Calendar size={14} />
                                Due {formatDate(upcomingPayment?.dueDate ?? "")}
                            </p>
                        </div>


                    </div>
                </section>

                {/* Stats grid */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {stats.map(({ label, value, sub, icon: Icon, }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500">
                                    {label}
                                </p>
                                <Icon size={16} className="text-slate-400" />
                            </div>
                            <p
                                className="mt-3 text-xl font-semibold text-slate-900"
                            >
                                {value}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
                        </div>
                    ))}
                </section>

                {/* Recent payments */}
                <section className="grid grid-cols-3 gap-4">
                    <PaymentDueDates />

                    <OutstandingBalance
                        amount={1250}
                        pendingCount={2}
                    />

                    <ActivePenalties />
                </section>  
                <FullCalendar />
            </div>
        </div>
    );
}