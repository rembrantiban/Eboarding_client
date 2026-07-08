"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    X,
    Camera,
    Upload,
    Trash2,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";
import { toast } from "sonner"
type Props = {
    open: boolean;
    onClose: () => void;
};

const ProfileModal = ({ open, onClose }: Props) => {
    const { user, updateProfileSettings } = useAuth();

    const [form, setForm] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        username: user?.username || "",
        password: "",
        contact_number: user?.contact_number || "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(user?.avatar_url || null);
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const initial =
        (user?.first_name?.charAt(0) ?? "U").toUpperCase();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log("📸 File selected:", file.name, file.size, file.type);
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

        const toastId = toast.loading("Updating profile...")
        try {
            console.log("💾 Saving profile with file:", selectedFile ? `${selectedFile.name} (${selectedFile.size} bytes)` : "No file");

            await updateProfileSettings({
                first_name: form.first_name,
                last_name: form.last_name,
                contact_number: form.contact_number,
                email: form.email,
                password: form.password,
                avatar: selectedFile,
            });

            toast.success("Profile updated successfully!", { id: toastId })
            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 2500);

        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.", { id: toastId })
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full  max-w-5xl bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-[15px] font-medium text-gray-900 leading-tight">
                            Profile settings
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Manage your personal information
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* ── BODY ── */}
                <div className="grid grid-cols-[200px_1fr]">

                    {/* LEFT PANEL */}
                    <div className="flex flex-col items-center gap-4 px-5 py-6 border-r border-gray-100 bg-gray-50">

                        {/* Avatar */}
                        <div className="relative">
                            <div
                                className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-medium border-2 transition-all
                                  ${avatarSrc ? "border-blue-400" : "border-gray-200 bg-blue-100 text-blue-700"}`}
                            >
                                {avatarSrc ? (
                                    <img
                                        src={avatarSrc}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    initial
                                )}
                            </div>
                            <button
                                onClick={() => setShowAvatarOptions((v) => !v)}
                                className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-colors"
                                title="Change avatar"
                            >
                                <Camera size={12} />
                            </button>
                        </div>

                        {/* Avatar Options */}
                        {showAvatarOptions && (
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="flex items-center justify-center gap-1.5 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
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
                                    className="flex items-center justify-center gap-1.5 h-8 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    Remove
                                </button>
                            </div>
                        )}

                        <p className="text-sm font-medium text-gray-800 text-center leading-tight">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-400 text-center -mt-3">
                            {user?.email}
                        </p>

                        <span className="text-[11px] px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {user?.user_type}
                        </span>

                        <div className="w-full h-px bg-gray-200" />
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex flex-col gap-5 px-6 py-6">

                        {/* Personal Info */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
                                Personal information
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field
                                    label="First name"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                                <Field
                                    label="Last name"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <Field
                                label="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                disabled
                            />
                            <div className="hidden">
                              <input type="text" placeholder="Contact number" 
                              value={form.contact_number} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Contact & Security */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
                                Contact & security
                            </p>
                            <Field
                                label="Email address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                            {/* Password with show/hide */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-medium text-gray-500">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 pr-9 text-[13px] text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── FOOTER ── */}
              {isUpdate ? (
                    <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-gray-100">
                    {saved && (
                        <span className="flex items-center gap-1 text-xs text-green-600 mr-auto">
                            <Check size={12} /> Saved
                        </span>
                    )}
                    <button
                        onClick={() => {setIsUpdate(false); onClose();}}
                        className="h-8 px-4 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-[13px] text-white font-medium transition-colors"
                    >
                        Save changes
                    </button>
                </div>
                ): (
                 <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-gray-100">
                        <button
                            onClick={() => {setIsUpdate(true);}}
                            className="h-8 px-4 rounded-lg border border-gray-200 text-[13px] text-gray-50 bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Update
                        </button>
                       
                    </div>
               
)}
            </div>
        </div>
    );
};

export default ProfileModal;


/* ── Reusable Field ── */
type FieldProps = {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    disabled?: boolean;
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
        <label className="text-[11px] font-medium text-gray-500">{label}</label>
        <input
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            className={`w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-900 outline-none
        focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all
        ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
        />
    </div>
);