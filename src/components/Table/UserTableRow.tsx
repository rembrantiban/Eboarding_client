import { MoreVertical, Mail, Eye, UserRoundPen, Trash2, UserCheck, Ban, KeyRound, } from "lucide-react"
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
import ResetUserPasswordModal from "../modal/ResetUserPasswordModal"


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
  const [openResetPassword, setOpenResetPassword] = useState(false);
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
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      : user.status === "Pending"
        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
        : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"

  const roleClass =
    user.user_type === "Admin"
      ? "bg-slate-900 text-white"
      : user.user_type === "Staff"
        ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
        : "bg-white text-slate-600 ring-1 ring-slate-200"

  return (
    <>
      <tr className="transition-colors hover:bg-slate-50/70">
        <td className="whitespace-nowrap px-4 py-2.5 text-[11.5px] tabular-nums text-slate-400">
          #{user.user_id_no}
        </td>

        <td className="px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {user.avatar_url ? (
              <img
                onClick={() => navigate(`/view-user/${user.id}`)}
                src={user.avatar_url}
                alt={user.username}
                className="h-9 w-9 cursor-pointer rounded-lg object-cover ring-1 ring-slate-200 transition hover:ring-slate-400"
              />
            ) : (
              <div
                onClick={() => navigate(`/view-user/${user.id}`)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-slate-900 text-[12px] font-semibold text-white transition hover:bg-slate-800"
              >
                {user.first_name?.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium text-slate-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-[11px] text-slate-400">@{user.username}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
            <Mail size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </div>
        </td>

        <td className="px-4 py-2.5">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${roleClass}`}
          >
            {user.user_type}
          </span>
        </td>

        <td className="px-4 py-2.5">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusClass}`}
          >
            {user.status}
          </span>
        </td>

        <td className="px-4 py-2.5">
          {user.account_status === "Active" ? (
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-rose-600">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Deactivated
            </span>
          )}
        </td>

        <td className="whitespace-nowrap px-4 py-2.5 text-[11.5px] tabular-nums text-slate-500">
          {formatDate(user.created_at)}
        </td>

        <td className="px-4 py-2.5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900">
                <MoreVertical size={15} />
              </button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="w-44 rounded-xl border-slate-200 p-1 text-[12.5px]">
              {user.user_type === "Boarder" &&
                user.status === "Pending" && (
                  <DropdownMenuItem
                    onClick={() => setOpenStatusReview(true)}
                    className="gap-2 rounded-lg text-blue-600"
                  >
                    <UserCheck size={14} />
                    Review Application
                  </DropdownMenuItem>
                )}
              <DropdownMenuItem onClick={() => navigate(`/view-user/${user.id}`)} className="gap-2 rounded-lg">
                <Eye size={14} /> View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenEdit(true)} className="gap-2 rounded-lg">
                <UserRoundPen size={14} /> Update
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setOpenResetPassword(true)}
                className="gap-2 rounded-lg text-slate-600 focus:text-slate-900"
              >
                <KeyRound size={14} /> Reset Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setOpenDelete(true)}
                className="gap-2 rounded-lg text-red-500 focus:text-red-500"
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
              {(user.user_type === "Admin" || user.status === "Approved") && (
                <>
                  {user.account_status === "Active" ? (
                    <DropdownMenuItem
                      onClick={() => setOpenDeactivate(true)}
                      className="gap-2 rounded-lg text-orange-600 focus:text-orange-600"
                    >
                      <Ban size={14} />
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setOpenActivate(true)}
                      className="gap-2 rounded-lg text-emerald-600 focus:text-emerald-600"
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

      <ResetUserPasswordModal
        open={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
        userId={user.id}
        userName={`${user.first_name} ${user.last_name}`}
        userEmail={user.email}
        userAvatar={user.avatar_url}
      />

    </>
  )
}

export default UserTableRow