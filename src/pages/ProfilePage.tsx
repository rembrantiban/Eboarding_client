"use client";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  User,
  Mail,
  AtSign,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type FieldProps = {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  icon?: React.ElementType;
};

function Field({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = "text",
  disabled = false,
  icon: Icon,
}: FieldProps) {
  return (

    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={`h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all
                        focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100
                        ${Icon ? "pl-9" : ""}
                        ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        />
      </div>
    </div>
  );
}

export default function EditProfile() {
  const { user, updateProfileSettings } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    contact_number: user?.contact_number || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    user?.avatar_url || null
  );
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""
    }`.toUpperCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarSrc(ev.target?.result as string);
      setShowAvatarOptions(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarSrc(null);
    setSelectedFile(null);
    setShowAvatarOptions(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    const toastId = toast.loading("Updating profile...");
    setSaving(true);
    try {
      await updateProfileSettings({
        first_name: form.first_name,
        last_name: form.last_name,
        contact_number: form.contact_number,
        email: form.email,
        password: form.password,
        avatar: selectedFile,
      });
      toast.success("Profile updated successfully!", { id: toastId });
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (

    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-background">


        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Edit profile
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  Update your details on file with management
                </p>
              </div>
            </div>
          </div>

          {/* Identity card w/ avatar */}
          <section className="rounded-2xl bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-400 bg-white/10 text-lg font-semibold text-white">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={`${user?.first_name} ${user?.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  onClick={() => setShowAvatarOptions((v) => !v)}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900"
                  title="Change avatar"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                    <AtSign size={11} />
                    {user?.username}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    {user?.user_type}
                  </span>
                </div>
              </div>

              {showAvatarOptions && (
                <div className="flex w-full gap-2 sm:w-auto">
                  <label className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 sm:flex-none">
                    <Upload size={12} />
                    Upload photo
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 sm:flex-none"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Personal information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Personal information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                icon={User}
              />
              <Field
                label="Last name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                icon={User}
              />
  
            </div>
          </section>

          {/* Contact & security */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Contact & security
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pl-9 pr-9 text-sm text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}