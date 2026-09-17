"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, RotateCcw, User as UserIcon, Inbox, CalendarClock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UserType } from "@/store/useAuthStore";
import { toast } from "sonner";
import Pagination from "@/components/Document/Pagination";

const PAGE_SIZE = 5;

type Props = {
  open: boolean;
  onClose: () => void;
};

const ROLE_STYLES: Record<UserType, string> = {
  Boarder: "bg-slate-100 text-slate-700",
  Staff: "bg-indigo-50 text-indigo-700",
  Admin: "bg-rose-50 text-rose-700",
};

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const DeletedUsersModal = ({ open, onClose }: Props) => {
  const { deletedUsers, getAllDeletedUsers, recoverDeletedUsers } = useAuth();

  const [page, setPage] = useState(1);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setPage(1);
  }

  useEffect(() => {
    if (open) getAllDeletedUsers();
  }, [open, getAllDeletedUsers]);

  const pageCount = Math.max(1, Math.ceil(deletedUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const paginatedUsers = useMemo(() => {
    const startIdx = (safePage - 1) * PAGE_SIZE;
    return deletedUsers.slice(startIdx, startIdx + PAGE_SIZE);
  }, [deletedUsers, safePage]);

  const handleRestore = async (id: number, name: string) => {
    try {
      await recoverDeletedUsers(id);
      await getAllDeletedUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to restore ${name}`);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-6xl! flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[14px] font-semibold text-slate-900">
                  Deleted Accounts
                </DialogTitle>
                {deletedUsers.length > 0 && (
                  <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-semibold tabular-nums text-slate-600">
                    {deletedUsers.length}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] leading-tight text-slate-400">
                Restore an account to bring it back active — nothing is lost.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto">
          {deletedUsers.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <Inbox className="h-5 w-5 text-slate-400" />
              </div>
              <p className="mt-3 text-[13px] font-medium text-slate-900">
                Trash is empty
              </p>
              <p className="mt-1 text-[11.5px] text-slate-400">
                Deleted accounts will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 border-b border-slate-200/80 bg-slate-50/70">
                  <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="whitespace-nowrap px-6 py-2.5 text-left">User</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Role</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Deleted</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Deleted By</th>
                    <th className="whitespace-nowrap px-6 py-2.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.first_name}
                              className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                              {u.first_name?.[0]}
                              {u.last_name?.[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] font-medium text-slate-900">
                              {u.first_name} {u.last_name}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-medium ${ROLE_STYLES[u.user_type]}`}
                        >
                          {u.user_type}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                          <CalendarClock size={12} className="shrink-0 text-slate-400" />
                          {formatDate(u.deleted_at)}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {u.deleted_by_avatar ? (
                            <img
                              src={u.deleted_by_avatar}
                              alt={u.deleted_by_name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <UserIcon size={11} className="text-slate-400" />
                            </div>
                          )}
                          <span className="truncate text-[11.5px] text-slate-600">
                            {u.deleted_by_name ?? "—"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleRestore(u.id, `${u.first_name} ${u.last_name}`)
                          }
                          className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                page={safePage}
                pageCount={pageCount}
                pageSize={PAGE_SIZE}
                totalItems={deletedUsers.length}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedUsersModal;
