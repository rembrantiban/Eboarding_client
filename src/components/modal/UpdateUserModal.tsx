"use client";

import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/store/useAuthStore";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess: (updatedUser: User) => void;
};

const UpdateUserModal = ({ open, onClose, user, onSuccess }: Props) => {
  const { updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact_number: "",
    address: "",
    user_type: "Boarder" as "Boarder" | "Staff" | "Admin",
    password: "",
    is_assigned: false,
  });

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      username: user.username || "",
      address: user.address || "",
      contact_number: user.contact_number || "",
      password: "",
      user_type: user.user_type || "Boarder",
      is_assigned: user.is_assigned ?? false,
    });
  }, [open, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300)); // smooth UX

      const result = await updateUser(user.id, form);

      setTimeout(() => {
        setIsSaving(false);
        onClose();
        onSuccess({
          ...user,
          ...result.user,
        });
      }, 1200);
    } catch (err: unknown) {
      console.log(err);
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex w-full max-w-xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Pencil size={16} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Update User</h2>
              <p className="text-xs text-slate-400">Edit user details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto px-6 py-6">

          {/* BASIC INFO */}
          <div className="space-y-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Basic Information
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
              <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
            </div>
            {form.user_type !== "Staff" && (
              <>
                <Field label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} />

                <Field label="Address" name="address" value={form.address} onChange={handleChange} />
              </>
            )}
          </div>

          {user.user_type !== "Staff" && (
            <>
              <div className="h-px bg-slate-100" />

              {/* ROLE */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">User Role</label>
                <select
                  name="user_type"
                  value={form.user_type}
                  onChange={handleChange}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="Boarder">Boarder</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </>
          )}

          {user.user_type === "Staff" && (
            <>
              <div className="h-px bg-slate-100" />

              {/* DETAILS */}
              <div className="space-y-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Details
                </p>

                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <InfoRow label="Role" value={user.user_type} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Username" value={user.username} />
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2.5 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving ? "Updating..." : "Update User"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateUserModal;

/* ================= INFO ROW ================= */

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <span className="truncate text-slate-900">{value || "—"}</span>
  </div>
);

/* ================= FIELD ================= */

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Field = ({ label, name, value, onChange, type = "text" }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-slate-600">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />
  </div>
);
