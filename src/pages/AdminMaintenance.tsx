"use client";

import { useEffect, useState } from "react"
import { Wrench } from "lucide-react"
import MaintenanceStatsCards from "@/components/maintenance/MaintenanceStatsCards"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"
import { useMaintenance } from "@/hooks/useMaintenace";
import AdminMaintenanceTable from "@/components/maintenance/AdminMaintenanceTable";


const AdminMaintenanceRequestPage = () => {
    const { submittedMaintenance, loading, getSubmittedMaintenance } = useMaintenance();

    const [, setSelected] = useState<MaintenanceRequest | null>(null)


    useEffect(() => {
        getSubmittedMaintenance();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="h-screen overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-5 py-6 bg-background ">
            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                        <Wrench className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-slate-900">
                            Maintenance Requests
                        </h1>
                        <p className="mt-0.5 text-[12px] leading-tight text-slate-500">
                            Assign staff, track progress, and manage maintenance requests.
                        </p>
                    </div>
                </div>
            </div>

            <MaintenanceStatsCards requests={submittedMaintenance} />

            <AdminMaintenanceTable
                request={submittedMaintenance}
                loading={loading}
                onView={(r) => setSelected(r)}
                onAssign={(r) => setSelected(r)}
                onUpdateStatus={(r) => setSelected(r)}
            />


        </div>
    )
}

export default AdminMaintenanceRequestPage