import { Search } from "lucide-react"
import { Input }  from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import AddUserModal from "@/components/modal/createUserModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StaffCreateUser from "@/components/modal/StaffCreateUser";


type Props = {
  search: string
  setSearch: (val: string) => void
  filter: string
  setFilter: (val: string) => void
}

const UserTableHeader = ({ search, setSearch, filter, setFilter }: Props) => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Users</h2>
        <p className="text-sm text-slate-500">Manage boarders and staff accounts efficiently.</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 sm:w-56"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400"
        >
          <option value="">All</option>
          {user?.user_type === "Admin" && (
            <option value="Staff">Staff</option>
          )}
          <option value="Boarder">Boarder</option>
        </select>
          {user?.user_type === "Admin" ? (
              <Button onClick={() => setOpen(true)}>
                + Add
              </Button>
            ):
               <Button onClick={() => setStaffOpen(true)}>
              + Add 
            </Button>
            }
          </div>

          <AddUserModal
            open={open}
            onClose={() => setOpen(false)}
             />

            <StaffCreateUser
            open={staffOpen}
            onClose={() => setStaffOpen(false)}
          />
      </div>

  )
}

export default UserTableHeader