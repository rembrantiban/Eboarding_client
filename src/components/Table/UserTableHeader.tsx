import { Search, ChevronDown, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import AddUserModal from "@/components/modal/createUserModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffCreateUser from "@/components/modal/StaffCreateUser";

type Props = {
  search: string
  setSearch: (val: string) => void
  filter: string
  setFilter: (val: string) => void
}

const UserTableHeader = ({ search, setSearch, filter, setFilter }: Props) => {
  const { user, deletedUsers, getAllDeletedUsers } = useAuth();
  const isAdmin = user?.user_type === "Admin";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) getAllDeletedUsers();
  }, [isAdmin, getAllDeletedUsers]);

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <Search className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
              Users
            </h2>
            <p className="text-[11px] leading-tight text-slate-400">
              Manage boarders and staff accounts
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border-slate-200 pl-8 text-[12.5px] shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 sm:w-56"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition focus:border-slate-900 sm:w-auto"
            >
              <option value="">All roles</option>
              {user?.user_type === "Admin" && (
                <option value="Staff">Staff</option>
              )}
              <option value="Boarder">Boarder</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Deleted accounts — admin only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/deleted-accounts")}
              title="Deleted accounts"
              className="relative flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deletedUsers.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-slate-900 px-1 text-[9.5px] font-semibold tabular-nums text-white ring-2 ring-white">
                  {deletedUsers.length > 99 ? "99+" : deletedUsers.length}
                </span>
              )}
            </button>
          )}

          {/* Add */}
          <button
            type="button"
            onClick={() =>
              user?.user_type === "Admin" ? setOpen(true) : setStaffOpen(true)
            }
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add User
          </button>
        </div>
      </div>

      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
      />

      <StaffCreateUser
        open={staffOpen}
        onClose={() => setStaffOpen(false)}
      />
    </>
  )
}

export default UserTableHeader