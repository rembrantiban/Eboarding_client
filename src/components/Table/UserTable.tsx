"use client"

import { useEffect, useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import UserTableHeader from "./UserTableHeader"
import UserTableRow from "./UserTableRow"
import UserStatsCards from "./UserStatsCards"
import type { User } from "@/store/useAuthStore"
import { useAuthStore } from "@/store/useAuthStore";

const UserTable = () => {
  const { users, isLoading, getUsers } = useAuth()

  const [filter, setFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
  return users.filter((user: User) =>
    filter === "" ? true : user.user_type === filter
  );
}, [users, filter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
  setCurrentPage((prev) => (prev !== 1 ? 1 : prev));
}, [filter]);

const handleUpdateSuccess = (updatedUser: User) => {
  useAuthStore.setState((state) => ({
    users: state.users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    ),
  }));
};

  const rangeStart = filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const rangeEnd = Math.min(currentPage * itemsPerPage, filteredUsers.length)

  return (
    <div className="space-y-4">
      <UserStatsCards users={users} />

      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <UserTableHeader
          filter={filter}
          setFilter={setFilter}
        />

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200/80 bg-slate-50/70">
                <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">User ID</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">User</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Email</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Role</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Approval</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Status</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">Created</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                            <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="ml-auto h-7 w-7 animate-pulse rounded-lg bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                          <SearchX className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="mt-3 text-[13px] font-semibold text-slate-900">
                          {filter
                            ? `No ${filter.toLowerCase()} users found`
                            : "No users found"}
                        </p>
                        <p className="mt-1 text-[11.5px] text-slate-400">
                          Try adjusting your filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onUpdateSuccess={handleUpdateSuccess}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[11.5px] text-slate-500">
              Showing{" "}
              <span className="font-medium tabular-nums text-slate-900">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-medium tabular-nums text-slate-900">
                {filteredUsers.length}
              </span>{" "}
              users
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-7 min-w-7 rounded-lg px-2 text-[12px] font-medium tabular-nums transition-colors ${
                    currentPage === i + 1
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTable