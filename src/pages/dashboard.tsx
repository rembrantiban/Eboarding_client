import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import { Users, Home, BedDouble, CheckCircle, Layers } from "lucide-react"
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
import RecentPaymentsCard from "@/components/Dashboard/RecentPaymentsCard"


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
                                  recentPaidUsers={revenueAnalytics?.recentPaidUsers || [] }
                            />
                        </div>
                    </div>
                </div>

                {/* 🔷 STATS */}
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Boarders" value={totalBoarders.toString()} icon={<Users size={110} className="text-slate-600/70" />} />
                    <StatCard title="Total Rooms" value={dashboardStats.totalRooms.toString()} icon={<Home size={110} className="text-slate-600/70" />} />
                    <StatCard title="Fully Occupied" value={dashboardStats.fullyOccupied.toString()} icon={<Layers size={110} className="text-slate-600/70" />} />
                    <StatCard title="Occupied Beds" value={dashboardStats.occupiedBeds.toString()} icon={<BedDouble size={110} className="text-slate-600/70" />} />
                    <StatCard title="Available Beds" value={dashboardStats.availableBeds.toString()} icon={<CheckCircle size={110} className="text-slate-600/70" />} />

                </div>

                {/* 🔷 CHARTS + STATUS */}
                <div className="grid gap-2 lg:grid-cols-3">
                        <RoomAvailabilityChart />
                        <OccupancyChart />
                        <PaymentsOverviewChart/>
                </div>

                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                   <div className=" grid gap-2">
                     <ActivePenaltiesCard />
                     <RecentPaymentsCard/>
                   </div>
                  <div className="md:col-span-2 lg:col-span-2 grid gap-2">
                      <div >
                         <CalendarCard />
                      </div>
                      <div className="bg-white flex justify-center items-center border p-8 rounded">
                        <h2 className="text-lg font-bold text-slate-900">
                          E-BOARDING: A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS
                        </h2>
                      </div>
                  </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard