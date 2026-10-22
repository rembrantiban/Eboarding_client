import { Search, ChevronDown, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import AddUserModal from "@/components/modal/createUserModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffCreateUser from "@/components/modal/StaffCreateUser";
import UserSearchModal from "@/components/modal/UserSearchModal";

type Props = {
  filter: string
  setFilter: (val: string) => void
}

const UserTableHeader = ({ filter, setFilter }: Props) => {
  const { user, users, deletedUsers, getAllDeletedUsers } = useAuth();
  const isAdmin = user?.user_type === "Admin";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K / Cmd+K opens the user search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="group flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white pl-3 pr-1.5 text-left text-[12.5px] text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-56"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="flex-1">Search user...</span>
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-slate-500">
              Ctrl K
            </kbd>
          </button>

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

      <UserSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        users={users}
      />
    </>
  )
}

export default UserTableHeader