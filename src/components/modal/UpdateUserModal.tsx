"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/store/useAuthStore";


type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
onSuccess: (updatedUser: User) => void;
};

type Status = "idle" | "loading" | "success" | "error";


const UpdateUserModal = ({ open, onClose, user, onSuccess }: Props) => {
  const { updateUser } = useAuth();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    contact_number: "",
    address: "",
    user_type: "Boarder" as "Boarder" | "Staff" | "Admin",
    password: "",
    is_assigned: false
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
      is_assigned: user.is_assigned ?? false
    });

  }, [open, user]);

  /* 🔷 HANDLE CHANGE */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setStatus("loading");
      setError(null);

      await new Promise((r) => setTimeout(r, 300)); // smooth UX

      const result = await updateUser(user.id, form);

      setStatus("success");

      setTimeout(() => {
        onClose();
        onSuccess({
          ...user,
          ...result.user
        });
      }, 1200);

    } catch (err: unknown) {
      setStatus("error");

      if (typeof err === "string") setError(err);
      else setError("Failed to update user");
    }
  };

  return (
    <Dialog open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}>
      <DialogContent className="w-full max-w-xl!">

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-sm text-muted-foreground">
              Updating user...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="text-green-500" size={40} />
            <p className="font-medium">User updated successfully</p>
             <Button onClick={() => setStatus("idle")}>
              close
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <XCircle className="text-red-500" size={40} />
            <p className="text-red-500">{error}</p>

            <Button onClick={() => setStatus("idle")}>
              Try Again
            </Button>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center gap-2">
              <Pencil size={18} />
              <div>
                <h2 className="text-lg font-semibold">Update User</h2>
                <p className="text-sm text-muted-foreground">
                  Edit user details and credentials
                </p>
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
                <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Username" name="username" value={form.username} onChange={handleChange} />
                <Field label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} />

              </div>

              <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
              <Field label="Address" name="address" value={form.address} onChange={handleChange} />
            </div>

            {/* PASSWORD */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Security
              </h3>

              <PasswordField
                label="New Password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <p className="text-xs text-muted-foreground">
                Leave blank if you don’t want to change the password
              </p>
            </div>

            {/* ROLE */}
            <div className="space-y-1">
              <label className="text-sm font-medium">User Role</label>
              <select
                name="user_type"
                value={form.user_type}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Boarder">Boarder</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button onClick={handleUpdate}>
                Update User
              </Button>
            </div>

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;


type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}: FieldProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    <Input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

/* ================= PASSWORD FIELD ================= */

const PasswordField = ({
  label,
  name,
  value,
  onChange,
}: FieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <Input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-2 text-muted-foreground"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};