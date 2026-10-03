import { Users } from "lucide-react";
import UserTable from "@/components/Table/UserTable";

const UserPage = () => {


  return (
    <div className="h-full overflow-y-auto space-y-6 px-10 py-6 bg-background ">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
            <Users className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="mt-0.5 text-[12px] leading-tight text-slate-500">
              View, approve, and manage all boarder and staff accounts.
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
          <span>Dashboard</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-700">Users</span>
        </nav>
      </div>

      <div className="h-px bg-slate-200/70" />

      <UserTable />
    </div>
  )
}

export default UserPage