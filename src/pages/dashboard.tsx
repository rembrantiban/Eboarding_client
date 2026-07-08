import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import RoomStatus from "@/components/Dashboard/RoomStatus"
import { Users, Home, BedDouble, CheckCircle, Layers } from "lucide-react"
import OccupancyTrend from "@/components/Dashboard/OccupancyTrend"
import PaymentChart from "@/components/Dashboard/PaymentChart"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useRef } from "react"
import { usePayment } from "@/hooks/usePayment"
import { useRoom } from "@/hooks/useRoom"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import DashboardPrint from "@/components/Dashboard/DashboardPrints"
import { useReactToPrint } from "react-to-print"

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
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-background">
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
                                  recentPaidUsers={revenueAnalytics?.recentPaidUsers || [] }
                            />
                        </div>
                    </div>
                </div>

                {/* 🔷 STATS */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Boarders" value={totalBoarders.toString()} icon={<Users size={110} className="text-slate-600/70" />} />
                    <StatCard title="Total Rooms" value={dashboardStats.totalRooms.toString()} icon={<Home size={110} className="text-slate-600/70" />} />
                    <StatCard title="Fully Occupied" value={dashboardStats.fullyOccupied.toString()} icon={<Layers size={110} className="text-slate-600/70" />} />
                    <StatCard title="Occupied Beds" value={dashboardStats.occupiedBeds.toString()} icon={<BedDouble size={110} className="text-slate-600/70" />} />
                    <StatCard title="Available Beds" value={dashboardStats.availableBeds.toString()} icon={<CheckCircle size={110} className="text-slate-600/70" />} />

                </div>

                {/* 🔷 CHARTS + STATUS */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-4">
                        <OccupancyChart />
                        <OccupancyTrend />

                    </div>
                    <PaymentChart data={analytics} />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <RoomStatus />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard