"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/store/useAuthStore";
import { useAuthStore } from "@/store/useAuthStore"

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess?: (user: User) => void;
};

const AddUserModal = ({ open: _open, onClose }: Props) => {
    const { createUserByAdmin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        contact_number: "",
        email: "",
        address: "",
        password: "",
        user_type: "Boarder" as "Boarder" | "Staff",
    });

    const [errors, setErrors] = useState<Partial<typeof form>>({});

    if (!_open) return null;

    const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: sanitize(value) });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const nameRegex = /^[A-Za-z\s]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;
    const passwordRegex = /^.{6,}$/;

    const validateForm = () => {
        const newErrors: Partial<typeof form> = {};
        if (!form.first_name) newErrors.first_name = "Required";
        else if (!nameRegex.test(form.first_name)) newErrors.first_name = "Letters only";
        if (!form.last_name) newErrors.last_name = "Required";
        else if (!nameRegex.test(form.last_name)) newErrors.last_name = "Letters only";
        if (!form.username) newErrors.username = "Required";
        else if (!usernameRegex.test(form.username)) newErrors.username = "4–20 chars, letters/numbers/_";
        if (!form.email) newErrors.email = "Required";
        else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";
        if (!form.contact_number) newErrors.contact_number = "Required";
        else if (!phoneRegex.test(form.contact_number)) newErrors.contact_number = "Format: 09XXXXXXXXX";
        if (!form.address) newErrors.address = "Required";
        if (!form.password) newErrors.password = "Required";
        else if (!passwordRegex.test(form.password)) newErrors.password = "Min. 6 characters";
        return newErrors;
    };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setIsSubmitting(false);
    return;
  }

  try {
    const result = await createUserByAdmin(form);

    toast.success("User created successfully");

    // ✅ UPDATE GLOBAL STATE (NO REFRESH NEEDED)
    useAuthStore.setState((state) => ({
      users: [result.user, ...state.users],
    }));

    onClose();

  } catch (err: unknown) {
    let message = "Failed to create user";
    if (typeof err === "string") message = err;
    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
};
    const initials =
        (form.first_name?.[0] ?? "") + (form.last_name?.[0] ?? "");

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-130 bg-white rounded-t-2xl sm:rounded-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

                <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <div className="px-6 py-5">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 transition-all duration-200">
                                {initials.toUpperCase() || (
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                                    Add New User
                                </h2>
                                <p className="text-[13px] text-gray-400 mt-0.5">
                                    Fill in the details to create an account
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-2">

                        {/* Section: Personal Info */}
                        <SectionLabel label="Personal information" />

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="First name" name="first_name" placeholder="John" onChange={handleChange} error={errors.first_name} />
                            <Field label="Last name" name="last_name" placeholder="Doe" onChange={handleChange} error={errors.last_name} />
                        </div>

                        {/* Section: Account */}
                        <SectionLabel label="Account details" />

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Username" name="username" placeholder="john_doe" onChange={handleChange} error={errors.username} />
                            <Field label="Contact number" name="contact_number" placeholder="09XXXXXXXXX" onChange={handleChange} error={errors.contact_number} />
                        </div>

                        <Field label="Email address" name="email" placeholder="john@example.com" onChange={handleChange} type="email" error={errors.email} />

                        <Field label="Address" name="address" placeholder="Street, City, Province" onChange={handleChange} error={errors.address} />

                        <Field label="Password" name="password" placeholder="Min. 6 characters" onChange={handleChange} type="password" error={errors.password} />

                        {/* Section: Role */}
                        <SectionLabel label="Role" />

                        <div className="grid grid-cols-2 gap-3">
                            {(["Boarder", "Staff"] as const).map((role) => (
                                <label
                                    key={role}
                                    className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                                        form.user_type === role
                                            ? "border-indigo-400 bg-indigo-50/60 text-indigo-700"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="user_type"
                                        value={role}
                                        checked={form.user_type === role}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                        form.user_type === role
                                            ? "border-indigo-500"
                                            : "border-gray-300"
                                    }`}>
                                        {form.user_type === role && (
                                            <span className="w-2 h-2 rounded-full bg-indigo-500 block" />
                                        )}
                                    </span>
                                    <span className="text-[13px] font-medium">{role}</span>
                                </label>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 pt-1" />

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-lg transition-all disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-indigo-200"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Create user
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;


const SectionLabel = ({ label }: { label: string }) => (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
    </p>
);

type FieldProps = {
    label: string;
    name: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
};

const Field = ({ label, name, placeholder, onChange, type = "text", error }: FieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-gray-600">
            {label}
        </label>
        <input
            name={name}
            placeholder={placeholder}
            type={type}
            onChange={onChange}
            className={`w-full h-9 px-3 text-[13px] rounded-lg border bg-white placeholder:text-gray-300 text-gray-800 outline-none transition-all duration-150
                focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                ${error
                    ? "border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-400"
                    : "border-gray-200 hover:border-gray-300"
                }`}
        />
        {error && (
            <p className="flex items-center gap-1 text-[11px] text-red-500">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c.31-.31.73-.483 1.169-.483h.187a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V11.81a.75.75 0 0 1 .394-.675ZM12 15a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" clipRule="evenodd" />
                </svg>
                {error}
            </p>
        )}
    </div>
);