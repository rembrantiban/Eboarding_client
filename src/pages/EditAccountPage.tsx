"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Camera,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Check,
    ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

export default function EditAccountPage() {
    const { user, updateProfileSettings , isLoading } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [saved, setSaved] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        user?.avatar_url ?? null
    )

    const [form, setForm] = useState({
        firstName: "Rembrant",
        lastName: "Iban",
        email: user?.email ?? "",
        contact_number: user?.contact_number ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange =
        (field: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: e.target.value }));
            };

    const handleSave = async () => {
    try {
        // Validate password confirmation
        if (
            form.newPassword &&
            form.newPassword !== form.confirmPassword
        ) {
            alert("New password and confirm password do not match.");
            return;
        }

        await updateProfileSettings({
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            contact_number: form.contact_number,
            password:
                form.newPassword.trim() !== ""
                    ? form.newPassword
                    : undefined,
            avatar,
        });

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);

    } catch (error) {
        console.error(error);

        alert(
            error instanceof Error
                ? error.message
                : String(error)
        );
    }
};


    const initials = `${user?.first_name?.charAt(0) ?? ""}${user?.last_name?.charAt(0) ?? ""
        }`.toUpperCase();

    console.log(initials);
    return (
        <div className="pb-28 min-h-full">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Account settings
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage your profile and security
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
                {/* Avatar */}
                <section className="rounded-2xl bg-white p-6">
                    <div className="flex items-center gap-5">
                        <div className="group relative">
                            <Avatar className="h-20 w-20">
                                {preview ? (
                                    <AvatarImage src={preview} />
                                ) : (
                                    <AvatarFallback className="bg-slate-900 text-2xl font-bold text-emerald-100">
                                        {initials}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/0 text-white opacity-0 transition-all group-hover:bg-slate-900/50 group-hover:opacity-100">
                                <Camera size={20} />

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (!file) return;

                                        setAvatar(file);

                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                Profile photo
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                JPG or PNG, at least 200×200px
                            </p>
                            <button className="mt-2 text-xs font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900">
                                Upload new photo
                            </button>
                        </div>
                    </div>
                </section>

                {/* Personal info */}
                <section className="rounded-2xl border bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Personal information
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        This is how your name appears across the app
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="First name" icon={User}>
                            <input
                                value={form.firstName}
                                onChange={handleChange("firstName")}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="First name"
                            />
                        </Field>

                        <Field label="Last name" icon={User}>
                            <input
                                value={form.lastName}
                                onChange={handleChange("lastName")}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="Last name"
                            />
                        </Field>

                        <Field label="Email address" icon={Mail}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="you@example.com"
                            />
                        </Field>

                        <Field label="Phone number" icon={Phone}>
                            <input
                                type="tel"
                                value={form.contact_number}
                                onChange={handleChange("contact_number")}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="09XX XXX XXXX"
                            />
                        </Field>
                    </div>
                </section>

                {/* Password */}
                <section className="rounded-2xl border bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Change password
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Leave blank to keep your current password
                    </p>

                    <div className="mt-5 space-y-4">
                        <Field label="Current password" icon={Lock}>
                            <input
                                type="password"
                                value={form.currentPassword}
                                onChange={handleChange("currentPassword")}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="New password" icon={Lock}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.newPassword}
                                    onChange={handleChange("newPassword")}
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </Field>

                            <Field label="Confirm new password" icon={Lock}>
                                <input
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    value={form.confirmPassword}
                                    onChange={handleChange("confirmPassword")}
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((v) => !v)
                                    }
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </Field>
                        </div>
                    </div>
                </section>
            </div>

            {/* Action bar */}
            <div className="sticky bottom-0 z-10 mt-8 border-t border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        {saved && (
                            <>
                                <Check size={14} className="text-emerald-600" />
                                <span>Changes saved</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                        >
                           {isLoading ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    icon: Icon,
    children,
}: {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}
            </label>
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-2.5 transition-colors focus-within:border-slate-400">
                <Icon size={16} className="shrink-0 text-slate-400" />
                {children}
            </div>
        </div>
    );
}