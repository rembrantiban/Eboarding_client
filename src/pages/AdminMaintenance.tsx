"use client";

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wrench, Archive } from "lucide-react"
import MaintenanceStatsCards from "@/components/maintenance/MaintenanceStatsCards"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"
import { useMaintenance } from "@/hooks/useMaintenace";
import { useAuth } from "@/hooks/useAuth";
import AdminMaintenanceTable from "@/components/maintenance/AdminMaintenanceTable";


const AdminMaintenanceRequestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { submittedMaintenance, loading, getSubmittedMaintenance } = useMaintenance();

    const [, setSelected] = useState<MaintenanceRequest | null>(null)


    useEffect(() => {
        getSubmittedMaintenance();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="h-full overflow-y-auto space-y-6 px-10 py-6 bg-background ">
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

                {user?.user_type === "Admin" && (
                    <button
                        type="button"
                        onClick={() => navigate("/admin-maintenance-history")}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Archive className="h-3.5 w-3.5" />
                        View Maintenance History
                    </button>
                )}
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