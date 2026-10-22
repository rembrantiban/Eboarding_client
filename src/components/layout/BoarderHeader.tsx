"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Wallet,
  Home,
  Megaphone,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { IoHomeSharp } from "react-icons/io5";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import { useEffect } from "react";

const categoryIcons = {
  General: Home,
  Billing: Wallet,
  Maintenance: Wrench,
} as const;

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { announcements, getAnnouncements, unreadCount, getUnreadCount, markAsRead } = useAnnouncement();

  useEffect(() => {
    if (!user) return;

    getAnnouncements();
    getUnreadCount();
    //eslint-disable-next-line
  }, [user]);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logout();
      toast.success("Logged out successfully!", { id: toastId });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed. Try again.", { id: toastId });
    }
  };

  const initials = `${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""}`.toUpperCase();
  const preview = user?.avatar_url ?? null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* LOGO */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 shadow-sm">
            <IoHomeSharp size={17} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            E-<span className="text-slate-500">Boarding</span>
          </h1>
        </div>

        {/* WELCOME */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
              {user?.first_name ? `Welcome, ${user.first_name}` : "Welcome to"}
            </span>
            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-base font-semibold tracking-tight text-transparent lg:text-lg">
              {user?.first_name && "to "}Ermings Boarding House
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        {user ? (
          <div className="flex items-center gap-2">
            {/* NOTIFICATIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {announcements.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400">
                      You're all caught up.
                    </p>
                  ) : (
                    announcements.map((item) => {
                      const CategoryIcon =
                        categoryIcons[item.category] ?? Megaphone;

                      return (
                        <div
                          key={item.notification_id}
                          onClick={async () => {
                            if (!item.is_read) {
                              await markAsRead(item.notification_id);
                              await getAnnouncements();
                              await getUnreadCount();
                            }
                            navigate("/boarder/announcements");
                          }}
                          className="flex cursor-pointer items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <CategoryIcon
                              size={14}
                              className="text-slate-500"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {item.title}
                              </p>

                              {!item.is_read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              )}
                            </div>

                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                              {item.description}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {new Date(item.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-slate-100 px-4 py-2.5">
                  <button
                    onClick={() => navigate("/boarder/announcements")}
                    className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    View all announcements
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PROFILE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-slate-100">
                  <div className="relative shrink-0">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Avatar"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                        {initials}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-white">
                      <User size={10} className="text-slate-500" />
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => navigate("/boarder-dashboard")}
                  className="cursor-pointer"
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-slate-600 hover:text-slate-900"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;