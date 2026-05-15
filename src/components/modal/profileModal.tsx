"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, FileUser } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

const ProfileModal = ({ open, onClose }: Props) => {
    const { user } = useAuth();

    const [form, setForm] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        username: user?.username || "",
        password: user?.password || "",
    });

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const initial = user?.first_name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-md shadow-2xl border border-white/30 overflow-hidden">

                {/* 🔷 HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-white/60 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-semibold">Profile Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your personal information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* 🔷 BODY */}
                <div className="grid grid-cols-3 gap-2 p-8">

                    {/* 🔷 LEFT (PROFILE CARD) */}
                    <div className="col-span-1 bg-white/70 rounded-2xl p-6 border shadow-sm flex flex-col justify-between items-center text-center space-y-4">
                        <div className="space-y-2">
                            <div className="w-30 h-30 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                                {initial}
                            </div>

                            <div>
                                <p className="font-semibold text-lg">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                                {user?.user_type}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button variant="outline" className="w-full bg-green-700 hover:bg-green-800 hover:text-white text-white">
                                <FileUser className="w-4 h-4 mr-1" />
                                Change Avatar
                            </Button>
                            <Button variant="outline" className="w-full bg-blue-700 hover:bg-blue-800 hover:text-white text-white">
                                <Edit2 className="w-4 h-4 mr-1" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>

                    {/* 🔷 RIGHT (FORM) */}
                    <div className="col-span-2 space-y-6">

                        {/* SECTION: PERSONAL */}
                        <div className="bg-white/70 rounded-2xl p-6 border shadow-sm space-y-4">
                            <h3 className="font-semibold">Personal Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
                                <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
                            </div>

                            <Field label="Username" name="username" value={form.username} onChange={handleChange} disabled />
                        </div>

                        {/* SECTION: CONTACT */}
                        <div className="bg-white/70 rounded-2xl p-6 border shadow-sm space-y-4">
                            <h3 className="font-semibold">Contact Information</h3>

                            <Field label="Email Address" name="email" value={form.email} onChange={handleChange} />
                            <Field label="Password" name="password" value={form.password} onChange={handleChange} type="password" />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button>
                                Save Changes
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;



/* 🔥 Reusable Field */
type FieldProps = {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    disabled?: boolean; // ✅ add this
};

const Field = ({
    label,
    name,
    value,
    placeholder,
    onChange,
    type = "text",
    disabled = false,
}: FieldProps) => (
    <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>

        <Input
            name={name}
            value={value}
            placeholder={placeholder}
            type={type}
            onChange={onChange}
            disabled={disabled} // ✅ apply it
            className={`
        bg-white/80 border border-gray-300
        focus:ring-2 focus:ring-blue-500
        ${disabled ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}
      `}
        />
    </div>
);