"use client";

import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Home, LayoutDashboard, Megaphone, Phone, Star, User, Wallet, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { HashLink } from "react-router-hash-link"
import { IoHomeSharp } from "react-icons/io5";
import { useEffect } from "react";
import { useAnnouncement } from "@/hooks/useAnnouncement";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features", hash: true },
  { label: "About", to: "/#about", hash: true },
  { label: "Location", to: "/#location", hash: true },
];;


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

  const initials = `${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""
    }`.toUpperCase();

  const preview = user?.avatar_url ?? null;


  const content = (
    <>
      <p className="font-medium">🏠 #1 Boarding House Management System</p>

      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} fill="white" />
        ))}
        <span className="ml-1">4.8/5 Rating</span>
      </div>

      <div className="flex items-center gap-1">
        <Phone size={12} />
        <span>+63 900 123 4567</span>
      </div>
    </>
  )


  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logout();

      toast.success("Logged out successfully!", {
        id: toastId,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Logout failed. Try again.", {
        id: toastId,
      });
    }
  };
  return (
    <>
      <div className="relative w-full bg-gray-900 text-white text-xs py-2 overflow-hidden">

        {/* gradient edges (optional but 🔥) */}
        <div className="absolute left-0 top-0 h-full w-10 bg-linear-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-10 bg-linear-to-l from-gray-900 to-transparent z-10" />

        <div className="marquee-track flex gap-12 whitespace-nowrap">

          {/* 🔁 TRIPLE DUPLICATION = ZERO RESET FEEL */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 shrink-0">
              {content}
            </div>
          ))}

        </div>
      </div>

      {/* 🔷 MAIN HEADER */}
      <header className="w-full border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-slate-400 bg-linear-to-r from-slate-800 to-slate-700 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm leading-none"><IoHomeSharp size={20} /></span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">

              E- <span className="text-slate-700 ">BOARDING</span>
            </h1>
          </div>

          {/* NAV */}
          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((item) =>
                item.hash ? (
                  <HashLink
                    key={item.label}
                    smooth
                    to={item.to}
                    className="rounded-md px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item.label}
                  </HashLink>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="rounded-md px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {user && (
                <Link
                  to="/viewroom"
                  className="rounded-md px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Rooms
                </Link>
              )}
            </nav>
          </nav>

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
                      onClick={() => navigate("/notifications")}
                      className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      View all notifications
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
    </>
  );
};

export default Header;