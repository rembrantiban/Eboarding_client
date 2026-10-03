import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import { Users, House, TriangleAlert, Wallet } from "lucide-react"
import PaymentsOverviewChart from "@/components/Dashboard/PaymentsOverviewChart"
import RoomAvailabilityChart from "@/components/Dashboard/RoomAvailabilityChart"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useMemo, useState } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useRoom } from "@/hooks/useRoom"
import { useBilling } from "@/hooks/useBilling"
import { usePenalty } from "@/hooks/usePenalty"
import ActivePenaltiesCard from "@/components/Dashboard/ActivePenaltiesCard"
import CalendarCard from "@/components/Dashboard/CalendarCard"
import QuickActions from "@/components/Dashboard/QuickActions"


const Dashboard = () => {
    const { user, totalBoarders, getTotalBoarders } = useAuth();
    const { getAnalytics } = usePayment();
    const { getDashboardStats, dashboardStats, getOccupancyTrend } = useRoom();
    const { paymentsOverview, getPaymentsOverview } = useBilling();
    const { penalties, getAllPenalties } = usePenalty();

    const [greeting] = useState(() => {
        const hour = new Date().getHours();
        return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    });

    useEffect(() => {
        getTotalBoarders()
        getAnalytics();
        getOccupancyTrend();
        getDashboardStats();
        getPaymentsOverview();
        getAllPenalties();
    }, [getTotalBoarders, getAnalytics, getDashboardStats, getOccupancyTrend, getPaymentsOverview, getAllPenalties]);

    // Same computation as PaymentsOverviewChart so the two stay in sync.
    const monthlyRevenue = useMemo(
        () => paymentsOverview.reduce((sum, item) => sum + Number(item.value), 0),
        [paymentsOverview]
    );

    const activePenaltiesCount = useMemo(
        () =>
            penalties.filter(
                (p) => p.status === "Pending" || p.status === "Partially Paid"
            ).length,
        [penalties]
    );

    const prevPoint = paymentsOverview.length > 1 ? paymentsOverview[paymentsOverview.length - 2] : null;
    const revenueChange =
        monthlyRevenue && prevPoint && Number(prevPoint.value) !== 0
            ? ((monthlyRevenue - Number(prevPoint.value)) / Number(prevPoint.value)) * 100
            : null;

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            <div className="mx-auto max-w-400 space-y-5 px-6 pt-5 pb-10">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        {greeting}{user?.first_name ? `, ${user.first_name}` : ""}
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Here's an overview of your boarding house today.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Boarders"
                        value={totalBoarders.toLocaleString()}
                        icon={<Users />}
                        tone="bg-blue-500/15 text-blue-400"
                        hint="Registered boarders"
                    />
                    <StatCard
                        title="Total Rooms"
                        value={dashboardStats.totalRooms.toLocaleString()}
                        icon={<House />}
                        tone="bg-emerald-500/15 text-emerald-400"
                        hint="Rooms in the property"
                    />
                    <StatCard
                        title="Active Penalties"
                        value={activePenaltiesCount.toLocaleString()}
                        icon={<TriangleAlert />}
                        tone="bg-rose-500/15 text-rose-400"
                        hint="Pending or partially paid"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`₱${monthlyRevenue.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`}
                        icon={<Wallet />}
                        tone="bg-amber-500/15 text-amber-400"
                        trend={revenueChange !== null ? `${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}%` : undefined}
                        trendDirection={revenueChange !== null && revenueChange < 0 ? "down" : "up"}
                        hint={revenueChange !== null ? "vs last month" : "Collected this month"}
                    />
                </div>

                {/* Charts + quick actions */}
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    <PaymentsOverviewChart />
                    <RoomAvailabilityChart />
                    <div className="lg:col-span-2 xl:col-span-1">
                        <QuickActions />
                    </div>
                </div>

                {/* Occupancy + penalties */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <OccupancyChart />
                    <ActivePenaltiesCard />
                </div>

                {/* Calendar */}
                <CalendarCard />
            </div>
        </div>
    )
}

export default Dashboard