import { useNavigate } from "react-router-dom"
import { CornerDownLeft, SearchX } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { User } from "@/store/useAuthStore"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
}

const ROLE_STYLES: Record<string, string> = {
  Admin: "bg-slate-900 text-white",
  Staff: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  Boarder: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
}

const UserSearchModal = ({ open, onOpenChange, users }: Props) => {
  const navigate = useNavigate()

  const handleSelect = (id: number) => {
    onOpenChange(false)
    navigate(`/view-user/${id}`)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search users"
      description="Search by name, email, username, or user ID"
      className="top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl sm:max-w-2xl"
    >
      <Command className="rounded-xl!">
      <CommandInput placeholder="Search by name, email, username, or ID..." className="h-10 text-[13px]" />

      <CommandList className="h-96 max-h-96 px-1 pb-1">
        <CommandEmpty className="flex h-full items-center justify-center py-0">
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <SearchX className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-slate-900">No users found</p>
            <p className="mt-1 text-[11.5px] text-slate-400">Try a different name, email, or ID.</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading={`Users · ${users.length}`}>
          {users.map((u) => {
            const fullName = `${u.first_name} ${u.last_name}`
            const initials = `${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase()

            return (
              <CommandItem
                key={u.id}
                value={`${fullName} ${u.email} ${u.username} ${u.user_id_no ?? ""} ${u.id}`}
                onSelect={() => handleSelect(u.id)}
                className="cursor-pointer gap-3 px-2.5 py-2"
              >
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={fullName}
                    className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[12px] font-semibold text-slate-600">
                    {initials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium text-slate-900">{fullName}</p>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold ${ROLE_STYLES[u.user_type] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {u.user_type}
                    </span>
                  </div>
                  <p className="truncate text-[11.5px] text-slate-500">
                    {u.email} · @{u.username}
                  </p>
                </div>

                <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-400">
                  {u.user_id_no || `#${u.id}`}
                </span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-3 py-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 bg-white px-1 font-sans text-[10px]">↑</kbd>
            <kbd className="rounded border border-slate-200 bg-white px-1 font-sans text-[10px]">↓</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="flex items-center rounded border border-slate-200 bg-white px-1 py-0.5">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
            to open
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-slate-200 bg-white px-1 font-sans text-[10px]">Esc</kbd>
          to close
        </span>
      </div>
      </Command>
    </CommandDialog>
  )
}

export default UserSearchModal
