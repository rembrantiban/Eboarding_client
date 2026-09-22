"use client";

import { useEffect, useMemo, useState } from "react"
import { Plus, Wrench } from "lucide-react"
import MaintenanceStatsCards from "@/components/maintenance/MaintenanceStatsCards"
import MaintenanceTable from "@/components/maintenance/MaintenanceTable"
import AssignedMaintenanceTable from "@/components/maintenance/AssignedMaintenanceTable"
import MyMaintenanceHistoryTable from "@/components/maintenance/MyMaintenanceHistoryTable"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore"
import AddMaintenanceRequestModal from "@/components/maintenance/AddMaintenanceRequestModal";
import ViewMaintenanceRequestModal from "@/components/maintenance/ViewMaintenanceRequestModal";
import ViewImageModal from "@/components/maintenance/ViewImageModal";
import UpdateMaintenanceStatusModal, { type UpdateMaintenanceStatusPayload } from "@/components/maintenance/UpdateMaintenanceStatusModal";
import ResolveMaintenanceRequestModal, { type ResolveMaintenanceRequestPayload } from "@/components/maintenance/ResolveMaintenanceRequestModal";
// NOTE: "My Requests" is read-only for status changes — the requester (staff) files it,
// but only whoever it's assigned to may update status / resolve it (see "Assigned to Me").
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaintenance } from "@/hooks/useMaintenace";

type TabKey = "requests" | "assigned" | "history"

const MaintenanceRequestPage = () => {
    const {
        maintenanceRequest,
        myAssignedMaintenance,
        loading,
        getMySubmittedRequest,
        getMyAssignedMaintenance,
        updateAssignedMaintenanceRequest,
    } = useMaintenance();

    const [tab, setTab] = useState<TabKey>("requests")

    const [open, setOpen] = useState(false)

    // "My Requests" tab state
    const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null)
    const [imageRequest, setImageRequest] = useState<MaintenanceRequest | null>(null)

    // "Assigned to Me" tab state
    const [assignedViewRequest, setAssignedViewRequest] = useState<MaintenanceRequest | null>(null)
    const [assignedUpdateRequest, setAssignedUpdateRequest] = useState<MaintenanceRequest | null>(null)
    const [assignedResolveRequest, setAssignedResolveRequest] = useState<MaintenanceRequest | null>(null)

    useEffect(() => {
        getMySubmittedRequest();
        getMyAssignedMaintenance();
        //eslint-disable-next-line
    }, [])

    const closedRequests = useMemo(
        () => maintenanceRequest.filter((r) => r.status === "Closed"),
        [maintenanceRequest]
    )

    const handleAssignedUpdateStatus = async (payload: UpdateMaintenanceStatusPayload) => {
        const success = await updateAssignedMaintenanceRequest(
            payload.request_id,
            payload.status,
            payload.notes
        );

        if (!success) {
            throw new Error("Failed to update maintenance status.");
        }

        await getMyAssignedMaintenance();
    }

    const handleAssignedResolve = async (payload: ResolveMaintenanceRequestPayload) => {
        const success = await updateAssignedMaintenanceRequest(
            payload.request_id,
            "Resolved",
            payload.notes
        );

        if (!success) {
            throw new Error("Failed to resolve maintenance request.");
        }

        await getMyAssignedMaintenance();
    }

    const TABS: { key: TabKey; label: string; count: number }[] = [
        { key: "requests", label: "My Requests", count: maintenanceRequest.length },
        { key: "assigned", label: "Assigned to Me", count: myAssignedMaintenance.length },
        { key: "history", label: "History", count: closedRequests.length },
    ]

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

                {tab === "requests" && (
                    <button
                        type="button"
                        className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New Request
                    </button>
                )}
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                <TabsList
                    variant="line"
                    className="h-10 w-full max-w-xl justify-start gap-1 border-b border-slate-200/80 p-1 sm:w-auto"
                >
                    {TABS.map(({ key, label, count }) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="gap-1.5 px-3 pb-5 text-[12.5px] font-medium"
                        >
                            {label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${
                                    tab === key
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {count}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="requests" className="mt-5 space-y-6">
                    <MaintenanceStatsCards requests={maintenanceRequest} />

                    <div className="mx-auto w-full max-w-full">
                        <MaintenanceTable
                            request={maintenanceRequest}
                            loading={loading}
                            onView={(r) => setViewRequest(r)}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="assigned" className="mt-5 space-y-6">
                    <MaintenanceStatsCards requests={myAssignedMaintenance} />

                    <div className="mx-auto w-full max-w-full">
                        <AssignedMaintenanceTable
                            request={myAssignedMaintenance}
                            loading={loading}
                            onView={(r) => setAssignedViewRequest(r)}
                            onUpdateStatus={(r) => setAssignedUpdateRequest(r)}
                            onResolve={(r) => setAssignedResolveRequest(r)}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-5 space-y-6">
                    <div className="mx-auto w-full max-w-full">
                        <MyMaintenanceHistoryTable request={closedRequests} loading={loading} />
                    </div>
                </TabsContent>
            </Tabs>

            {/* My Requests modals */}
            <AddMaintenanceRequestModal
                open={open}
                onClose={() => setOpen(false)}
                onCreated={getMySubmittedRequest}
            />

            <ViewMaintenanceRequestModal
                request={viewRequest}
                onClose={() => setViewRequest(null)}
                onViewImage={(r) => setImageRequest(r)}
            />

            <ViewImageModal
                open={imageRequest !== null}
                request={imageRequest}
                onClose={() => setImageRequest(null)}
            />

            {/* Assigned to Me modals */}
            <ViewMaintenanceRequestModal
                request={assignedViewRequest}
                onClose={() => setAssignedViewRequest(null)}
                onUpdateStatus={(r) => {
                    setAssignedViewRequest(null)
                    setAssignedUpdateRequest(r)
                }}
            />

            <UpdateMaintenanceStatusModal
                open={assignedUpdateRequest !== null}
                request={assignedUpdateRequest}
                onClose={() => setAssignedUpdateRequest(null)}
                onUpdate={handleAssignedUpdateStatus}
            />

            <ResolveMaintenanceRequestModal
                request={assignedResolveRequest}
                onClose={() => setAssignedResolveRequest(null)}
                onConfirm={handleAssignedResolve}
            />
        </div>
    )
}

export default MaintenanceRequestPage
