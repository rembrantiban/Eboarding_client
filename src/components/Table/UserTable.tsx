"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import UserTableHeader from "./UserTableHeader"
import UserTableRow from "./UserTableRow"
import type { User } from "@/store/useAuthStore"
import { useAuthStore } from "@/store/useAuthStore";



const UserTable = () => {
  const { users, isLoading, getUsers } = useAuth()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
    
  useEffect(() => {
    getUsers(); 
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
  return users.filter((user: User) => {
    const searchLower = search.toLowerCase();

    const fullName =
      `${user.first_name} ${user.last_name}`.toLowerCase();

    // 🔷 Search match
    const matchesSearch =
      fullName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower);

    // 🔷 Filter match
    const matchesFilter =
      filter === ""
        ? true
        : user.user_type === filter;

    return matchesSearch && matchesFilter;
  });
}, [users, search, filter]);
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage])

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
  setCurrentPage((prev) => (prev !== 1 ? 1 : prev));
}, [search, filter]);

 const removeUserFromUI = (id: number) => {
  useAuthStore.setState((state) => ({
    users: state.users.filter((u) => u.id !== id),
  }));
};
const handleUpdateSuccess = (updatedUser: User) => {
  useAuthStore.setState((state) => ({
    users: state.users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    ),
  }));
};
  return (
    <div className="rounded border bg-background p-5 shadow-sm space-y-4 ">

      <UserTableHeader
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-left px-4 py-3">Room Assignment</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted-foreground">
                  {filter
                    ? `No ${filter.toLowerCase()} users found`
                    : "No users found"}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onDeleteSuccess={removeUserFromUI}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-lg border hover:bg-muted disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-lg border ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
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
              className="px-3 py-1 text-sm rounded-lg border hover:bg-muted disabled:opacity-50"
            >
              Next
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default UserTable