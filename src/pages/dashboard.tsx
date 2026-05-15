import StatCard from "@/components/Dashboard/StatCard"
import OccupancyChart from "@/components/Dashboard/OccupancyChart"
import RoomStatus from "@/components/Dashboard/RoomStatus"
import { Users, Home, BedDouble, CheckCircle, Layers } from "lucide-react"
import OccupancyTrend from "@/components/Dashboard/OccupancyTrend"
import PaymentChart from "@/components/Dashboard/PaymentChart"

const paymentData = [
    { name: "Paid", current: 52000, previous: 44000, count: 26, prevCount: 22 },
    { name: "Pending", current: 18000, previous: 22000, count: 9, prevCount: 11 },
    { name: "Overdue", current: 9000, previous: 6000, count: 4, prevCount: 3 },
];

const Dashboard = () => {
    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-background">
                <div>
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your boarding house status
                    </p>
                </div>

                {/* 🔷 STATS */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total Tenants" value="120" icon={<Users size={110} className="text-purple-300/30" />} />
                    <StatCard title="Total Rooms" value="50" icon={<Home size={110} className="text-blue-300/30" />} />
                    <StatCard  title="Fully Occupied" value="5" icon={<Layers   size={110} className="text-yellow-300/30" />} />
                    <StatCard title="Occupied Beds" value="45" icon={<BedDouble size={110} className="text-green-300/30" />} />
                    <StatCard title="Available Beds" value="5" icon={<CheckCircle size={110} className="text-yellow-300/30" />} />
                                        
                </div>

                {/* 🔷 CHARTS + STATUS */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-4">
                        <OccupancyChart />
                        <OccupancyTrend />

                    </div>
                    <PaymentChart data={paymentData} />
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