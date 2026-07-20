import { MoreVertical, Mail, Eye, UserRoundPen, Trash2, UserCheck, Ban, } from "lucide-react"
import type { User } from "@/store/useAuthStore"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import DeleteUserModal from "../modal/DeleteUserModal"
import UpdateUserModal from "../modal/UpdateUserModal"
import { useNavigate } from "react-router-dom"
import DeactivateUserModal from "../modal/DeactivateUserModal"
import ActivateUserModal from "../modal/ActivateUserModal"
import StatusReviewModal from "../modal/StatusReviewModal"


type Props = {
  user: User
  onUpdateSuccess: (updatedUser: User) => void
}

const UserTableRow = ({ user, onUpdateSuccess }: Props) => {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openActivate, setOpenActivate] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openStatusReview, setOpenStatusReview] = useState(false);
  const navigate = useNavigate()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusClass =
    user.status === "Approved"
      ? "bg-emerald-50 text-emerald-700"
      : user.status === "Pending"
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700"

  return (
    <>
      <tr className="transition hover:bg-slate-50/80">
        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">#{user.user_id_no}</td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            {user.avatar_url ? (
              <img
                onClick={() => navigate(`/view-user/${user.id}`)}
                src={user.avatar_url}
                alt={user.username}
                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200 cursor-pointer hover:ring-slate-400 transition"
              />
            ) : (
              <div
                onClick={() => navigate(`/view-user/${user.id}`)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-blue-100 hover:bg-slate-700 transition"
              >
                {user.first_name?.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-xs text-slate-500">@{user.username}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail size={14} className="text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
        </td>

        <td className="px-4 py-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.user_type === "Admin"
              ? "bg-purple-100 text-purple-700"
              : user.user_type === "Staff"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
              }`}
          >
            {user.user_type}
          </span>
        </td>

        <td className="px-4 py-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
            {user.status}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {user.account_status === "Active" ? (
              <>
                <UserCheck size={14} className="text-emerald-500" />
                <span className="text-emerald-500">Active</span>
              </>
            ) : (
              <>
                <Ban size={14} className="text-rose-500" />
                <span className="text-rose-500">Deactivated</span>
              </>
            )}
          </div>
        </td>

        <td className="px-4 py-3">
          {formatDate(user.created_at)}
        </td>

        <td className="px-4 py-3 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-44 rounded-xl border-slate-200 p-1">
              {user.user_type === "Boarder" &&
                user.status === "Pending" && (
                  <DropdownMenuItem
                    onClick={() => setOpenStatusReview(true)}
                    className="gap-2 text-blue-600"
                  >
                    <UserCheck size={14} />
                    Review Application
                  </DropdownMenuItem>
                )}
              <DropdownMenuItem onClick={() => navigate(`/view-user/${user.id}`)} className="gap-2">
                <Eye size={14} /> View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenEdit(true)} className="gap-2">
                <UserRoundPen size={14} /> Update
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setOpenDelete(true)}
                className="gap-2 text-red-500 focus:text-red-500"
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
              {(user.user_type === "Admin" || user.status === "Approved") && (
                <>
                  {user.account_status === "Active" ? (
                    <DropdownMenuItem
                      onClick={() => setOpenDeactivate(true)}
                      className="gap-2 text-orange-600 focus:text-orange-600"
                    >
                      <Ban size={14} />
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setOpenActivate(true)}
                      className="gap-2 text-emerald-600 focus:text-emerald-600"
                    >
                      <UserCheck size={14} />
                      Activate
                    </DropdownMenuItem>
                  )}
                </>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <DeleteUserModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        userId={user.id}
      />

      <UpdateUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={user}
        onSuccess={(updatedUser: User) => onUpdateSuccess(updatedUser)}
      />

      <DeactivateUserModal
        open={openDeactivate}
        onClose={() => setOpenDeactivate(false)}
        userId={user.id}
        userName={`${user.first_name} ${user.last_name}`}
      />

      <ActivateUserModal
        open={openActivate}
        onClose={() => setOpenActivate(false)}
        userId={user.id}
        userName={`${user.first_name} ${user.last_name}`}
      />


      <StatusReviewModal
        open={openStatusReview}
        onClose={() => setOpenStatusReview(false)}
        userId={user.id}
        userName={`${user.first_name} ${user.last_name}`}
        currentStatus={user.status}
        onSuccess={(updatedUser) => onUpdateSuccess(updatedUser)}
      />


    </>
  )
}

export default UserTableRow