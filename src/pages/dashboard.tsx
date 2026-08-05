import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import { Users, Home, AlertTriangle, Wallet } from "lucide-react"
import PaymentsOverviewChart from "@/components/Dashboard/PaymentsOverviewChart"
import RoomAvailabilityChart from "@/components/Dashboard/RoomAvailabilityChart"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useRef } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useRoom } from "@/hooks/useRoom"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import DashboardPrint from "@/components/Dashboard/DashboardPrints"
import { useReactToPrint } from "react-to-print"
import ActivePenaltiesCard from "@/components/Dashboard/ActivePenaltiesCard"
import CalendarCard from "@/components/Dashboard/CalendarCard"


const Dashboard = () => {
    const { totalBoarders, getTotalBoarders } = useAuth();
    const { getAnalytics, analytics, revenueAnalytics } = usePayment();
    const { getDashboardStats, dashboardStats, occupancyTrend, getOccupancyTrend } = useRoom();

    const printRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "E-Boarding Report",
    })

    useEffect(() => {
        getTotalBoarders()
        getAnalytics();
        getOccupancyTrend();
        getDashboardStats();
    }, [getTotalBoarders, getAnalytics, getDashboardStats, getOccupancyTrend]);

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
                    <Button onClick={handlePrint}>
                        <Printer size={16} /> Print
                    </Button>
                    <div className="hidden">
                        <div ref={printRef}>
                            <DashboardPrint
                                totalBoarders={totalBoarders}
                                dashboardStats={dashboardStats}
                                analytics={analytics}
                                occupancyTrend={occupancyTrend}
                                recentPaidUsers={revenueAnalytics?.recentPaidUsers || []}
                            />
                        </div>
                    </div>
                </div>

                {/* 🔷 STATS */}
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Boarders" value={totalBoarders.toString()} icon={<Users size={110} className="text-blue-600/70" />} />
                    <StatCard title="Total Rooms" value={dashboardStats.totalRooms.toString()} icon={<Home size={110} className="text-green-400/70" />} />
                    <StatCard title="Active Penalties" value={dashboardStats.occupiedBeds.toString()} icon={<AlertTriangle size={110} className="text-red-600/70" />} />
                    <StatCard title="Monthly Revenue" value="₱84,500" icon={<Wallet className="text-amber-500" />} trend="+12%" />

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