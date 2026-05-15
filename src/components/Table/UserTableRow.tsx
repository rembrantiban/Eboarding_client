import { MoreVertical, Mail, Eye, UserRoundPen, Trash2, DoorOpen } from "lucide-react"
import type { User } from "@/store/useAuthStore"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import DeleteUserModal from "../modal/DeleteUserModal";
import ViewUserModal from "../modal/ViewUserModal";
import UpdateUserModal from "../modal/UpdateUserModal";
import AssignBoarderModal from "../modal/AssignBoarderModal";

type Props = {
  user: User;
  onDeleteSuccess: (id: number) => void;
  onUpdateSuccess: (updatedUser: User) => void;
};

const UserTableRow = ({ user, onDeleteSuccess, onUpdateSuccess }: Props) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);

  useEffect(() => {
    console.log("USER:", user);
    console.log("IS ARRAY:", Array.isArray(user));
  }, [user]);

  return (
    <tr className="border-t hover:bg-muted/50 transition">

      {/* 🔷 USER */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Avatar */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-9 h-9 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full flex bg-blue-100 text-blue-600 items-center justify-center text-sm font-semibold">
              {user.first_name?.charAt(0)}
            </div>
          )}

          <div>
            <p className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              @{user.username}
            </p>
          </div>

        </div>
      </td>

      {/* 🔷 EMAIL */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail size={14} />
          {user.email}
        </div>
      </td>

      {/* 🔷 ROLE */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${user.user_type === "Admin"
            ? "bg-purple-100 text-purple-600"
            : user.user_type === "Staff"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
            }`}
        >
          {user.user_type}
        </span>
      </td>

      {/* 🔷 CREATED */}
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A"}
      </td>

      <td className="px-4 py-3 text-xs text-muted-foreground">
        {user.updated_at
          ? new Date(user.updated_at).toLocaleDateString()
          : "N/A"}
      </td>

      <td className="px-4 py-3">
        {user.is_assigned ? (
          <span className="font-medium text-gray-800">
            {user.room_number} • {user.bed_number}
          </span>
        ) : user.user_type === "Staff" ? (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-50 text-red-600">
            not Available for assignment
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
            — Not Assigned
          </span>
        )}
      </td>

      {/* 🔷 ACTIONS */}
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-muted">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setOpenView(true)}>
              <Eye /> View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <UserRoundPen /> Update
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={user.is_assigned}
              onClick={() => !user.is_assigned && setOpenAssign(true)}
              className={user.is_assigned ? "opacity-50 cursor-not-allowed" : ""}
            >
              <DoorOpen />
              {user.is_assigned ? "Already Assigned" : "Assign Room"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>

      {/* 🔥 MODALS */}


      <DeleteUserModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        userId={user.id}
        onSuccess={() => onDeleteSuccess(user.id)}
      />

      <ViewUserModal
        open={openView}
        onClose={() => setOpenView(false)}
        user={user}
      />

      <UpdateUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={user}
        onSuccess={(updatedUser: User) => onUpdateSuccess(updatedUser)}
      />
      <AssignBoarderModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        user={user}
      />



    </tr>
  )
}

export default UserTableRow