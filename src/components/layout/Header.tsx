"use client";

import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Phone, Star, Warehouse } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { HashLink } from "react-router-hash-link"

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();


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
            <div className="w-8 h-8 rounded-md border-2 border-green-400 bg-linear-to-r from-purple-600 to-teal-700 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm leading-none"><Warehouse size={20} /></span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">

              E- <span className="bg-linear-to-r from-blue-600 to-teal-700 bg-clip-text text-transparent select-none ">BOARDING</span>
            </h1>
          </div>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

            <a href="/" className="relative group">
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-2 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>

            {user && (
              <Link to="/viewroom" className="relative group">
                Rooms
                <span className="absolute left-0 -bottom-1 w-0 h-2 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
            )}

            <HashLink smooth to="/#features" className="relative group">
              Features
              <span className="absolute left-0 -bottom-1 w-0 h-2 bg-blue-500 transition-all group-hover:w-full"></span>
            </HashLink>

            <HashLink smooth to="/#about" className="relative group">
              About
              <span className="absolute left-0 -bottom-1 w-0 h-2 bg-blue-500 transition-all group-hover:w-full"></span>
            </HashLink>

            <HashLink smooth to="/#location" className="relative group">
              Location
              <span className="absolute left-0 -bottom-1 w-0 h-2 bg-blue-500 transition-all group-hover:w-full"></span>
            </HashLink>

          </nav>

          {/* ACTIONS */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition">

                  {/* 🔷 AVATAR */}
                  <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                    {user?.first_name
                      ?.split(" ")
                      .map(n => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  {/* 🔷 USER INFO */}
                  <div className="flex flex-col items-start leading-tight">

                    <span className="text-sm font-medium max-w-30 truncate">
                      {user?.first_name} {user?.last_name}
                    </span>

                    <Badge className="text-[11px] bg-blue-200 text-blue-800  capitalize">
                      {user?.user_type}
                    </Badge>

                  </div>

                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User size={16} className="mr-2" />
                  Profile
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
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>

              <Button
                onClick={() => navigate("/register")}
                className="bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
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