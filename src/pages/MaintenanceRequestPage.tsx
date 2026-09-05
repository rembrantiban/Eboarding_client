"use client";

import { useEffect, useState } from "react"
import { Plus, Wrench } from "lucide-react"
import MaintenanceStatsCards from "@/components/maintenance/MaintenanceStatsCards"
import MaintenanceTable from "@/components/maintenance/MaintenanceTable"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"
import AddMaintenanceRequestModal from "@/components/maintenance/AddMaintenanceRequestModal";
import ViewMaintenanceRequestModal from "@/components/maintenance/ViewMaintenanceRequestModal";
import ViewImageModal from "@/components/maintenance/ViewImageModal";
import UpdateMaintenanceStatusModal, { type UpdateMaintenanceStatusPayload } from "@/components/maintenance/UpdateMaintenanceStatusModal";
import ResolveMaintenanceRequestModal, { type ResolveMaintenanceRequestPayload } from "@/components/maintenance/ResolveMaintenanceRequestModal";
import { useMaintenance } from "@/hooks/useMaintenace";


const MaintenanceRequestPage = () => {
    const { maintenanceRequest, loading, getMySubmittedRequest, updateMySubmittedMaintenanceRequest } = useMaintenance();

    const [open, setOpen] = useState(false)
    const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null)
    const [imageRequest, setImageRequest] = useState<MaintenanceRequest | null>(null)
    const [updateRequest, setUpdateRequest] = useState<MaintenanceRequest | null>(null)
    const [resolveRequest, setResolveRequest] = useState<MaintenanceRequest | null>(null)

    useEffect(() => {
          getMySubmittedRequest();
          //eslint-disable-next-line
    }, [])

    const handleUpdateStatus = async (payload: UpdateMaintenanceStatusPayload) => {
        const success = await updateMySubmittedMaintenanceRequest(
            payload.request_id,
            payload.status,
            payload.notes
        );

        if (!success) {
            throw new Error("Failed to update maintenance status.");
        }

        await getMySubmittedRequest();
    }

    const handleResolve = async (payload: ResolveMaintenanceRequestPayload) => {
        const success = await updateMySubmittedMaintenanceRequest(
            payload.request_id,
            "Resolved",
            payload.notes
        );

        if (!success) {
            throw new Error("Failed to resolve maintenance request.");
        }

        await getMySubmittedRequest();
    }

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
                            Manage and monitor all maintenance requests.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="h-3.5 w-3.5" />
                    New Request
                </button>
            </div>

            <MaintenanceStatsCards requests={maintenanceRequest} />

            <MaintenanceTable
                request={maintenanceRequest}
                loading={loading}
                onView={(r) => setViewRequest(r)}
                onUpdateStatus={(r) => setUpdateRequest(r)}
                onResolve={(r) => setResolveRequest(r)}
            />

            <AddMaintenanceRequestModal
                open={open}
                onClose={() => setOpen(false)}
                onCreated={getMySubmittedRequest}
            />

            <ViewMaintenanceRequestModal
                request={viewRequest}
                onClose={() => setViewRequest(null)}
                onViewImage={(r) => setImageRequest(r)}
                onUpdateStatus={(r) => {
                    setViewRequest(null)
                    setUpdateRequest(r)
                }}
            />

            <ViewImageModal
                open={imageRequest !== null}
                request={imageRequest}
                onClose={() => setImageRequest(null)}
            />

            <UpdateMaintenanceStatusModal
                open={updateRequest !== null}
                request={updateRequest}
                onClose={() => setUpdateRequest(null)}
                onUpdate={handleUpdateStatus}
            />

            <ResolveMaintenanceRequestModal
                request={resolveRequest}
                onClose={() => setResolveRequest(null)}
                onConfirm={handleResolve}
            />
        </div>
    )
}

export default MaintenanceRequestPage
