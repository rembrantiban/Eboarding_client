"use client"

import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Topbar = () => {
  const { user } = useAuth()

  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
  const initials =
    `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase()

  return (
    <div className="w-full h-12 bg-white px-6 flex items-center justify-end ">

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 py-2 ">

        {/* USER INFO */}
        <div className="text-right hidden sm:block">
          <p className="text-[0.775rem] font-semibold text-gray-800">
            {fullName || "User"}
          </p>
          <p className="text-xs text-gray-400">
            {user?.user_type || "Member"}
          </p>
        </div>

        {/* AVATAR */}
        <Avatar className="w-10 h-10 border">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={fullName} />
          ) : (
            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>

      </div>
    </div>
  )
}

export default Topbar