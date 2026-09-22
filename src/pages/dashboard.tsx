import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import { Users, Home, AlertTriangle, Wallet, Calendar } from "lucide-react"
import PaymentsOverviewChart from "@/components/Dashboard/PaymentsOverviewChart"
import RoomAvailabilityChart from "@/components/Dashboard/RoomAvailabilityChart"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useMemo } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useRoom } from "@/hooks/useRoom"
import { useBilling } from "@/hooks/useBilling"
import { usePenalty } from "@/hooks/usePenalty"
import ActivePenaltiesCard from "@/components/Dashboard/ActivePenaltiesCard"
import CalendarCard from "@/components/Dashboard/CalendarCard"


const Dashboard = () => {
    const { totalBoarders, getTotalBoarders } = useAuth();
    const { getAnalytics } = usePayment();
    const { getDashboardStats, dashboardStats, getOccupancyTrend } = useRoom();
    const { paymentsOverview, getPaymentsOverview } = useBilling();
    const { penalties, getAllPenalties } = usePenalty();

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    })

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
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Overview of your boarding house status
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-white px-4 py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-700">
                            <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Today
                            </p>
                            <p className="text-[12.5px] font-semibold text-slate-900">
                                {today}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🔷 STATS */}
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Boarders" value={totalBoarders.toString()} icon={<Users size={110} className="text-blue-600/70" />} />
                    <StatCard title="Total Rooms" value={dashboardStats.totalRooms.toString()} icon={<Home size={110} className="text-green-400/70" />} />
                    <StatCard title="Active Penalties" value={activePenaltiesCount.toString()} icon={<AlertTriangle size={110} className="text-red-600/70" />} />
                    <StatCard
                        title="Monthly Revenue"
                        value={`₱${monthlyRevenue.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`}
                        icon={<Wallet className="text-amber-500" />}
                        trend={revenueChange !== null ? `${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}%` : undefined}
                        trendDirection={revenueChange !== null && revenueChange < 0 ? "down" : "up"}
                    />

                </div>

                {/* 🔷 CHARTS + STATUS */}
                <div className="grid gap-2 lg:grid-cols-2">
                    <RoomAvailabilityChart />
                    <PaymentsOverviewChart />
                </div>

                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">

                    <div >
                        <CalendarCard />
                    </div>


                    <div className=" grid grid-cols-2 gap-2">
                        <ActivePenaltiesCard />
                        <OccupancyChart />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Dashboard