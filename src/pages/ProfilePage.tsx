"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { DollarSign, Clock, AlertTriangle, ClipboardClock, Search, Calendar, Wallet, DoorOpen, Megaphone } from "lucide-react"
import {
  Home,
  Bell,
  LogOut,
  Edit3,
  Save,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  BedDouble,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Camera,
  X,
} from "lucide-react";
import type { User } from "@/store/useAuthStore";
import { toast } from "sonner"
import { useBoarder } from "@/hooks/useBoarder"
import { usePayment } from "@/hooks/usePayment";
import { useAnnouncement } from "@/hooks/useAnnouncement";

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const { unreadCount } = useAnnouncement()

  const initial = user?.first_name?.charAt(0).toUpperCase() || "U"
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()

  const handleLogout = () => {
    const toastId = toast.loading("Logging out…")
    try {
      toast.success("Successfully logged out.", { id: toastId })
      logout()
      navigate("/")
    } catch (error) {
      console.error("Error occurred while logging out:", error)
      toast.error("Failed to log out.", { id: toastId })
    }
  }

  const navItems = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "rooms", label: "Bed & Room", icon: BedDouble },
    { id: "payments", label: "Payments", icon: ClipboardClock },
    { id: "announcements", label: "Announcements", icon: Bell },
  ]


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Mulish:wght@300;400;500;600;700&display=swap');

        .pg-root {
          min-height: 100vh;
          display: flex;
          background: #F9FAFB;
          font-family: 'Mulish', sans-serif;
        }

        /* ── SIDEBAR ── */
        .pg-sidebar {
          width: 264px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #eef1f5;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* AVATAR CARD */
        .pg-avatar-card {
          margin: 1.5rem 1.25rem 0.5rem;
          padding: 1rem;
          border-radius: 14px;
          background: #F8FAFC;
          border: 1px solid #E7EBF0;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .pg-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px #E7EBF0;
        }
        .pg-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pg-avatar-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          font-family: 'Bricolage Grotesque', sans-serif;
        }
        .pg-avatar-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pg-avatar-role {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 4px;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #2563eb;
          background: #EFF6FF;
          border: 1px solid #DBEAFE;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }

        /* SECTION LABEL */
        .pg-section-label {
          padding: 1.25rem 1.5rem 0.5rem;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B6BFCA;
        }

        /* NAV */
        .pg-nav {
          padding: 0 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pg-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 11px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Mulish', sans-serif;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          text-align: left;
          color: #64748B;
          background: transparent;
        }
        .pg-nav-item:hover {
          background: #F5F7FA;
          color: #0F172A;
        }
        .pg-nav-item-inner {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .pg-nav-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #64748B;
          transition: background 0.18s, color 0.18s;
        }
        .pg-nav-item--active {
          background: #EFF6FF !important;
          color: #1D4ED8 !important;
          border: 1px solid #DBEAFE;
        }
        .pg-nav-item--active .pg-nav-item-icon {
          background: #2563EB;
          color: #fff;
        }
        .pg-nav-chevron { color: #93C5FD; flex-shrink: 0; }

        .pg-badge-dot {
          background: #EF4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          padding: 3px 6px;
          border-radius: 999px;
        }

        .pg-spacer { flex: 1; }

        /* LOGOUT */
        .pg-logout-wrap {
          padding: 0.9rem;
          border-top: 1px solid #F1F5F9;
        }
        .pg-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 0.75rem;
          border-radius: 11px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Mulish', sans-serif;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #94A3B8;
          transition: background 0.18s, color 0.18s;
          text-align: left;
        }
        .pg-logout:hover { background: #FEF2F2; color: #EF4444; }
        .pg-logout-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.18s, color 0.18s;
        }
        .pg-logout:hover .pg-logout-icon { background: #FEE2E2; color: #EF4444; }

        /* ── MAIN ── */
        .pg-main {
          flex: 1;
          padding: 2.5rem 3rem;
          overflow: auto;
        }
        @media (max-width: 768px) {
          .pg-main { padding: 1.5rem; }
        }
      `}</style>

      <div className="pg-root">

        {/* ── SIDEBAR ── */}
        <aside className="pg-sidebar">
          {/* Avatar card */}
          <div className="pg-avatar-card">
            <div className="pg-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={fullName} />
              ) : (
                <div className="pg-avatar-fallback">{initial}</div>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="pg-avatar-name">{fullName || "User"}</p>
              <span className="pg-avatar-role">{user?.user_type || "Member"}</span>
            </div>
          </div>

          <div className="pg-section-label">Navigation</div>

          <nav className="pg-nav">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`pg-nav-item${isActive ? " pg-nav-item--active" : ""}`}
                >
                  <span className="pg-nav-item-inner">
                    <span className="pg-nav-item-icon">
                      <Icon size={15} />
                    </span>
                    <span className="flex items-center gap-2">
                      {label}
                      {id === "announcements" && unreadCount > 0 && (
                        <span className="pg-badge-dot">{unreadCount}</span>
                      )}
                    </span>
                  </span>
                  {isActive && <ChevronRight size={14} className="pg-nav-chevron" />}
                </button>
              )
            })}
          </nav>

          <div className="pg-spacer" />

          {/* Logout */}
          <div className="pg-logout-wrap">
            <button className="pg-logout" onClick={handleLogout}>
              <span className="pg-logout-icon">
                <LogOut size={15} />
              </span>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="pg-main">
          {activeTab === "profile" && <ProfileContent user={user} />}
          {activeTab === "rooms" && <MyRooms />}
          {activeTab === "payments" && <PaymentHistory />}
          {activeTab === "announcements" && <Announcements />}
        </main>
      </div>
    </>
  )
}



type ProfileContentProps = { user: User | null };

const ProfileContent = ({ user }: ProfileContentProps) => {
  const { updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    username: user?.username || "",
    contact_number: user?.contact_number || "",
    address: user?.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Pick a new avatar image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Discard avatar selection
  const handleRemovePreview = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setEditing(false);
    handleRemovePreview();
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      username: user?.username || "",
      contact_number: user?.contact_number || "",
      address: user?.address || "",
    });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("first_name", form.first_name);
      payload.append("last_name", form.last_name);
      payload.append("email", form.email);
      payload.append("username", form.username);
      payload.append("contact_number", form.contact_number);
      payload.append("address", form.address);
      payload.append("user_type", user.user_type);

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      await updateProfile(payload);


      setStatus("success");
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const displayAvatar = avatarPreview ?? user?.avatar_url ?? null;
  const initial = user?.first_name?.charAt(0).toUpperCase() || "U";
  const firstName = user?.first_name || "there";

  return (
    <div className="w-full space-y-8">
      {/* Header — greeting style, matches dashboard pattern */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Hi, {firstName} <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Here&apos;s your personal information</p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            <Edit3 size={14} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Status banner */}
      {status !== "idle" && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
          ${status === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {status === "success"
            ? <><CheckCircle2 size={16} /> Profile updated successfully.</>
            : <><XCircle size={16} /> Something went wrong. Please try again.</>
          }
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

        {/* ── Avatar row ── */}
        <div className="flex items-center gap-5 p-6">
          <div className="relative group">
            {/* Avatar display */}
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white shadow">
              {displayAvatar ? (
                <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                  {initial}
                </div>
              )}
            </div>

            {/* Camera overlay — only in edit mode */}
            {editing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change photo"
                >
                  <Camera size={16} className="text-white" />
                </button>

                {/* Remove preview badge */}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePreview}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                    title="Remove photo"
                  >
                    <X size={10} />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {user?.user_type}
            </span>
            {editing && (
              <p className="text-[11px] text-gray-400 mt-1.5">
                Hover the photo to change it
              </p>
            )}
          </div>
        </div>

        {/* ── Fields ── */}
        <div className="p-6 grid grid-cols-2 gap-5">
          <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} disabled={!editing} icon={<UserIcon size={14} />} />
          <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} disabled={!editing} icon={<UserIcon size={14} />} />
          <Field label="Username" name="username" value={form.username} onChange={handleChange} disabled={!editing} icon={<UserIcon size={14} />} readOnly={!!user?.username} />
          <Field label="Email" name="email" value={form.email} onChange={handleChange} disabled={!editing} icon={<Mail size={14} />} type="email" />
          <Field label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} disabled={!editing} icon={<Phone size={14} />} />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} disabled={!editing} icon={<MapPin size={14} />} readOnly={!!user?.address} />
        </div>
      </div>
    </div>
  );
};



const MyRooms = () => {
  const { getMyBoarding, myBoarding, loading } = useBoarder()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    getMyBoarding()
  }, [getMyBoarding])

  const images = myBoarding?.images || []

  return (
    <div className="w-full space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Room</h1>
          <p className="text-sm text-gray-400 mt-1">Your current boarding assignment</p>
        </div>

        {myBoarding && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        )}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="h-4 bg-gray-100 w-1/3 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>

      ) : myBoarding ? (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition">

          <div className="relative h-72 w-full overflow-hidden bg-gray-100">

            {images.length > 0 ? (
              <img
                src={images[currentIndex]}
                onClick={() => setSelectedImage(images[currentIndex])}
                className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="text-gray-300" size={32} />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      (prev + 1) % images.length
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  ›
                </button>
              </>
            )}

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="absolute top-3 right-3 flex gap-1.5">
                {images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => {
                      setCurrentIndex(i)
                      setSelectedImage(img)
                    }}
                    className="w-10 h-10 rounded-lg object-cover border cursor-pointer"
                  />
                ))}
              </div>
            )}

            {/* LABEL */}
            <div className="absolute bottom-4 left-5 text-white">
              <p className="text-xl font-bold">
                Room {myBoarding.room_number}
              </p>
              <p className="text-xs opacity-80">
                Bed {myBoarding.bed_number}
              </p>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-5">

            <p className="text-sm text-gray-400">
              Comfortable and secure boarding space with essential amenities.
            </p>

            <div className="grid grid-cols-2 gap-3">

              <Info icon={<DoorOpen size={14} />} label="Room" value={myBoarding.room_number} />
              <Info icon={<BedDouble size={14} />} label="Bed" value={myBoarding.bed_number} />
              <Info icon={<Wallet size={14} />} label="Monthly" value={`₱${Number(myBoarding.price_per_month).toLocaleString()}`} />
              <Info icon={<Calendar size={14} />} label="Since"
                value={new Date(myBoarding.start_date).toLocaleDateString("en-PH")}
              />

            </div>
          </div>
        </div>

      ) : (

        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <Home className="mx-auto text-gray-300" size={28} />
          <p className="text-sm mt-3 text-gray-500 font-medium">
            No room assigned yet
          </p>
        </div>
      )}

      {/* MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-h-[80vh] rounded-lg shadow-lg"
          />
        </div>
      )}

    </div>
  )
}



const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
    <div className="bg-white p-2 rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
)



type PaymentStatus = "Paid" | "Pending" | "Overdue"

const statusDotColor: Record<PaymentStatus, string> = {
  Paid: "bg-green-500",
  Pending: "bg-yellow-500",
  Overdue: "bg-red-500",
}

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const styles: Record<PaymentStatus, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}

type CardColor = "green" | "yellow" | "red"

const iconMap: Record<CardColor, React.ReactNode> = {
  green: <DollarSign color="#10B981" size={20} />,
  yellow: <Clock color="#D97706" size={20} />,
  red: <AlertTriangle color="#EF4444" size={20} />,
}

const cardColorStyles: Record<CardColor, string> = {
  green: "bg-emerald-50 border-emerald-100",
  yellow: "bg-amber-50 border-amber-100",
  red: "bg-red-50 border-red-100",
}

const SummaryCard = ({ label, amount, color }: {
  label: string
  amount: number
  color: CardColor
}) => {
  return (
    <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${cardColorStyles[color]}`}>
      {/* TEXT */}
      <div>
        <p className="text-xs uppercase font-semibold text-gray-500 tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">₱{amount.toLocaleString()}</p>
      </div>

      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white shadow-sm">
        {iconMap[color]}
      </div>
    </div>
  )
}

const PaymentHistory = () => {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All")
  const [search, setSearch] = useState("")
  const { getMyPaid, getUserPaid } = usePayment()

  useEffect(() => {
    getUserPaid()
  }, [getUserPaid])

  const filteredPayments = getMyPaid.filter((p) => {
    const searchLower = search.toLowerCase()

    const date = new Date(p.due_date)

    const fullMonth = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    }).toLowerCase()

    const shortMonth = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }).toLowerCase()

    const matchesSearch =
      p.due_date.toLowerCase().includes(searchLower) ||
      fullMonth.includes(searchLower) ||
      shortMonth.includes(searchLower) ||
      p.status.toLowerCase().includes(searchLower) ||
      p.amount.toString().includes(searchLower)

    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter

    return matchesSearch && matchesStatus
  })
  const totalPaid = getMyPaid
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => {
      const amount = Number(p.amount) || 0
      const penalty = Number(p.penalty_amount) || 0
      return sum + amount + penalty
    }, 0)

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payment History</h1>
        <p className="text-gray-400 text-sm mt-1">Track your monthly rent payments</p>
      </div>

      {/* STAT STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Paid" amount={totalPaid} color="green" />

        <div className="md:col-span-2 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center">
          <div className="flex flex-wrap items-center gap-3 w-full">
            <div className="relative flex-1 min-w-50">
              {/* 🔍 ICON */}
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              {/* INPUT */}
              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 
              bg-gray-50 text-gray-700 placeholder:text-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400
              transition-all"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* 🔵 STATUS FILTER */}
            <div className="flex gap-2">
              {["All", "Paid", "Pending", "Overdue"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as PaymentStatus | "All")}
                  className={`px-4 py-2 text-[13px] font-medium rounded-full border transition
                      ${statusFilter === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }
                    `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Billing Period</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Penalty</th>
              <th className="text-left px-4 py-3">Method</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full ${statusDotColor[p.status]}`}
                      />

                      {/* TEXT */}
                      <p className="font-medium text-gray-800">
                        {new Date(p.due_date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-800">
                    ₱{p.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    {Number(p.penalty_amount) > 0 ? (
                      <span className="px-2 py-1 text-sm font-semibold rounded-full bg-red-50 text-red-600">
                        +₱{Number(p.penalty_amount).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No penalty</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    Cash
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────
   ANNOUNCEMENTS
───────────────────────────────────────── */
const Announcements = () => {
  const {
    announcements,
    fetchAnnouncements,
    markAsRead,
  } = useAnnouncement();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <div className="w-full space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Announcements
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Latest updates from management
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <Megaphone className="mx-auto text-gray-300" size={28} />
            <p className="text-sm mt-3 text-gray-500 font-medium">
              No announcements yet
            </p>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.notification_id}
              onClick={() => {
                if (!item.is_read) {
                  markAsRead(item.notification_id);
                }
              }}
              className={`group cursor-pointer bg-white rounded-2xl border p-5 space-y-1 shadow-sm transition
              ${item.is_read
                  ? "border-gray-100 hover:shadow-md"
                  : "border-blue-200 bg-blue-50/40 hover:shadow-md"
                }`}
            >
              {/* TOP */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <Megaphone size={18} />
                    {item.title}
                  </p>

                  {/* NEW BADGE */}
                  {!item.is_read && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      NEW
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* BODY */}
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                {item.description?.split("\n").map((line, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.75" />
                    <span>{line}</span>
                  </div>
                )) || "No description"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────── */
type FieldProps = {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
};

const Field = ({ label, name, value, readOnly, onChange, type = "text", disabled, icon }: FieldProps) => {
  const isDisabled = disabled || readOnly;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <Input
          name={name}
          value={value}
          type={type}
          onChange={onChange}
          disabled={isDisabled}
          className={`text-sm ${icon ? "pl-9" : ""} rounded-xl border-gray-300 bg-gray-50 text-gray-800
            ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}
          focus:ring-4 focus:ring-blue-100 focus:border-blue-400
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-default
          transition-all duration-200`}
        />
      </div>
    </div>
  )
};



export default ProfilePage;