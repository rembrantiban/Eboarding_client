"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { UserType } from "@/store/useAuthStore"; // TODO: adjust import path if UserType lives elsewhere
import { Check } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

type FormState = {
    first_name: string;
    last_name: string;
    username: string;
    contact_number: string;
    email: string;
    address: string;
    password: string;
    user_type: UserType;
    avatar: File | null;

    // Boarder-only fields
    gender: string;
    age: string;
    valid_id_type: string;
    emergency_contact_name: string;
    emergency_contact_number: string;
    emergency_contact_relationship: string;
    valid_id_image: File | null;
};

const MAX_AVATAR_MB = 5;
const MAX_ID_MB = 5;
const TOTAL_STEPS = 4;

const GENDER_OPTIONS = ["Male", "Female"];

const STEP_INFO = [
    { title: "Account type", subtitle: "Who is this account for?" },
    { title: "Personal information", subtitle: "Who is this account for?" },
    { title: "Account details", subtitle: "Login credentials and contact info" },
    { title: "Photo & documents", subtitle: "Finish setting up the account" },
];

// Which fields are relevant/validated per step, depending on the selected role
const getStepFields = (step: number, userType: UserType): (keyof FormState)[] => {
    const isBoarder = userType === "Boarder";

    switch (step) {
        case 1:
            return [];
        case 2:
            return isBoarder
                ? ["first_name", "last_name", "gender", "age"]
                : ["first_name", "last_name"];
        case 3:
            return isBoarder
                ? [
                    "username",
                    "contact_number",
                    "email",
                    "address",
                    "password",
                    "emergency_contact_name",
                    "emergency_contact_number",
                    "emergency_contact_relationship",
                ]
                : ["username", "contact_number", "email", "address", "password"];
        case 4:
        default:
            return [];
    }
};

const AddUserModal = ({ open: _open, onClose }: Props) => {
    const { createUserByAdmin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const idInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);

    const [form, setForm] = useState<FormState>({
        first_name: "",
        last_name: "",
        username: "",
        contact_number: "",
        email: "",
        address: "",
        password: "",
        user_type: "Boarder" as UserType,
        avatar: null,

        gender: "",
        age: "",
        valid_id_type: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_contact_relationship: "",
        valid_id_image: null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [idPreview, setIdPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    if (!_open) return null;

    const isBoarder = form.user_type === "Boarder";

    const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: sanitize(value) }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRoleChange = (role: UserType) => {
        setForm((prev) => ({ ...prev, user_type: role }));
        setErrors({});
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setErrors((prev) => ({ ...prev, avatar: "Use a JPG, PNG, or WEBP file" }));
            return;
        }
        if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, avatar: `Max file size is ${MAX_AVATAR_MB}MB` }));
            return;
        }

        setErrors((prev) => ({ ...prev, avatar: "" }));
        setForm((prev) => ({ ...prev, avatar: file }));
        setAvatarPreview(URL.createObjectURL(file));
    };

    const removeAvatar = () => {
        setForm((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview(null);
        setErrors((prev) => ({ ...prev, avatar: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setErrors((prev) => ({ ...prev, valid_id_image: "Use a JPG, PNG, or WEBP file" }));
            return;
        }
        if (file.size > MAX_ID_MB * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, valid_id_image: `Max file size is ${MAX_ID_MB}MB` }));
            return;
        }

        setErrors((prev) => ({ ...prev, valid_id_image: "" }));
        setForm((prev) => ({ ...prev, valid_id_image: file }));
        setIdPreview(URL.createObjectURL(file));
    };

    const removeId = () => {
        setForm((prev) => ({ ...prev, valid_id_image: null }));
        setIdPreview(null);
        setErrors((prev) => ({ ...prev, valid_id_image: "" }));
        if (idInputRef.current) idInputRef.current.value = "";
    };

    const nameRegex = /^[A-Za-z\s]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^09\d{9}$/;
    const passwordRegex = /^.{6,}$/;

    const validateForm = (currentStep: number) => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};

        // STEP 2 - Personal Information
        if (currentStep >= 2) {
            if (!form.first_name)
                newErrors.first_name = "Required";
            else if (!nameRegex.test(form.first_name))
                newErrors.first_name = "Letters only";

            if (!form.last_name)
                newErrors.last_name = "Required";
            else if (!nameRegex.test(form.last_name))
                newErrors.last_name = "Letters only";

            if (isBoarder) {
                if (!form.gender)
                    newErrors.gender = "Required";

                if (!form.age)
                    newErrors.age = "Required";
                else if (Number(form.age) < 1 || Number(form.age) > 120)
                    newErrors.age = "Enter a valid age";
            }
        }

        // STEP 3 - Account Details
        if (currentStep >= 3) {
            if (!form.username)
                newErrors.username = "Required";
            else if (!usernameRegex.test(form.username))
                newErrors.username = "4–20 chars, letters/numbers/_";

            if (!form.email)
                newErrors.email = "Required";
            else if (!emailRegex.test(form.email))
                newErrors.email = "Invalid email";

            if (!form.contact_number)
                newErrors.contact_number = "Required";
            else if (!phoneRegex.test(form.contact_number))
                newErrors.contact_number = "Format: 09XXXXXXXXX";

            if (!form.address)
                newErrors.address = "Required";

            if (!form.password)
                newErrors.password = "Required";
            else if (!passwordRegex.test(form.password))
                newErrors.password = "Min. 6 characters";
        }

        // STEP 4 - Boarder Only
        if (currentStep >= 4 && isBoarder) {
            if (!form.emergency_contact_name)
                newErrors.emergency_contact_name = "Required";

            if (!form.emergency_contact_number)
                newErrors.emergency_contact_number = "Required";
            else if (!phoneRegex.test(form.emergency_contact_number))
                newErrors.emergency_contact_number = "Format: 09XXXXXXXXX";

            if (!form.emergency_contact_relationship)
                newErrors.emergency_contact_relationship = "Required";
            if (!form.valid_id_type)
                newErrors.valid_id_type = "Required";
            if (!form.valid_id_image)
                newErrors.valid_id_image = "Valid ID is required";
        }

        return newErrors;
    };

    const goNext = () => {
        const allErrors = validateForm(step);
        const relevantKeys = getStepFields(step, form.user_type);
        const stepErrors: Partial<Record<keyof FormState, string>> = {};
        relevantKeys.forEach((key) => {
            if (allErrors[key]) stepErrors[key] = allErrors[key];
        });

        if (Object.keys(stepErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...stepErrors }));
            return;
        }

        if (form.user_type === "Boarder" && step === 2) {
            setStep(4);
            return;
        }

        setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const goBack = () => setStep((s) => Math.max(s - 1, 1));

    const goToStep = (target: number) => {
        // Only allow jumping to a step you've already reached or completed
        if (target < step) setStep(target);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm(TOTAL_STEPS);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            for (let s = 1; s <= TOTAL_STEPS; s++) {
                if (getStepFields(s, form.user_type).some((key) => validationErrors[key])) {
                    setStep(s);
                    break;
                }
            }
            return;
        }

        try {
            const payload = isBoarder
                ? form
                : {
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    contact_number: form.contact_number,
                    email: form.email,
                    address: form.address,
                    password: form.password,
                    user_type: form.user_type,
                    avatar: form.avatar,
                };

            await createUserByAdmin(payload as never);

            toast.success("User created successfully");

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

    const { title, subtitle } = STEP_INFO[step - 1];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-130 bg-white rounded-t-2xl sm:rounded-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 border border-slate-100 max-h-[92vh] flex flex-col">

                <div className="px-6 py-5 overflow-y-auto">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-[15px] font-semibold text-slate-900 leading-tight">
                                Add New User
                            </h2>
                            <p className="text-[13px] text-slate-400 mt-0.5">
                                Fill in the details to create an account
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step indicator / tabs */}
                    <div className="flex items-center gap-2 mb-5">
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                            <div key={s} className="flex items-center gap-2 flex-1">
                                <button
                                    type="button"
                                    onClick={() => goToStep(s)}
                                    disabled={s > step}
                                    className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${s < step
                                        ? "bg-slate-900 text-white cursor-pointer"
                                        : s === step
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        }`}
                                >
                                    {s < step ? <Check size={12} /> : s}
                                </button>
                                {s !== TOTAL_STEPS && (
                                    <div className={`h-0.5 flex-1 rounded-full transition-colors ${s < step ? "bg-slate-900" : "bg-slate-100"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <p className="text-[13px] font-semibold text-slate-800">{title}</p>
                        <p className="text-[12px] text-slate-400">{subtitle}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* STEP 1 — Account type / role */}
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-3">
                                {(["Boarder", "Staff"] as const).map((role) => (
                                    <label
                                        key={role}
                                        className={`relative flex flex-col gap-1 px-4 py-4 rounded-xl border cursor-pointer transition-all duration-150 ${form.user_type === role
                                            ? "border-slate-400 bg-slate-50 text-slate-800 ring-1 ring-slate-300"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="user_type"
                                            value={role}
                                            checked={form.user_type === role}
                                            onChange={() => handleRoleChange(role)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-semibold">{role}</span>
                                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${form.user_type === role ? "border-slate-600" : "border-slate-300"
                                                }`}>
                                                {form.user_type === role && (
                                                    <span className="w-2 h-2 rounded-full bg-slate-600 block" />
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-snug">
                                            {role === "Boarder"
                                                ? "Resident with emergency contact & ID on file"
                                                : "Staff member with system access"}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* STEP 2 — Personal information */}
                        {step === 2 && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="First name" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} error={errors.first_name} />
                                    <Field label="Last name" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} error={errors.last_name} />
                                </div>

                                {isBoarder && (
                                    <>
                                        <SectionLabel label="Additional details" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Select
                                                label="Gender"
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                options={GENDER_OPTIONS}
                                                error={errors.gender}
                                            />
                                            <Field label="Age" name="age" placeholder="18" value={form.age} onChange={handleChange} type="number" error={errors.age} />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* STEP 3 — Account details */}
                        {step === 3 && (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Username" name="username" placeholder="john_doe" value={form.username} onChange={handleChange} error={errors.username} />
                                    <Field label="Contact number" name="contact_number" placeholder="09XXXXXXXXX" value={form.contact_number} onChange={handleChange} error={errors.contact_number} />
                                </div>

                                <Field label="Email address" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} type="email" error={errors.email} />

                                <Field label="Address" name="address" placeholder="Street, City, Province" value={form.address} onChange={handleChange} error={errors.address} />

                                <Field label="Password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} type="password" error={errors.password} />

                                {isBoarder && (
                                    <>
                                        <SectionLabel label="Emergency contact" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Contact name" name="emergency_contact_name" placeholder="Jane Doe" value={form.emergency_contact_name} onChange={handleChange} error={errors.emergency_contact_name} />
                                            <Field label="Contact number" name="emergency_contact_number" placeholder="09XXXXXXXXX" value={form.emergency_contact_number} onChange={handleChange} error={errors.emergency_contact_number} />
                                        </div>
                                        <Field label="Relationship" name="emergency_contact_relationship" placeholder="Mother, Father, Guardian..." value={form.emergency_contact_relationship} onChange={handleChange} error={errors.emergency_contact_relationship} />
                                    </>
                                )}
                            </>
                        )}

                        {/* STEP 4 — Photo & documents */}
                        {step === 4 && (
                            <>
                                <SectionLabel label="Profile photo" />

                                <div className="flex items-center gap-4 pb-1">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative w-14 h-14 shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500 overflow-hidden transition-all duration-200 hover:border-slate-300"
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                        ) : initials.toUpperCase() || (
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        )}

                                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-150">
                                            <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 8.586 5.5h6.828c.685 0 1.34.276 1.759.675M6.827 6.175 5.907 8.25a2.25 2.25 0 0 0-2.157 2.243v7.007c0 1.243 1.007 2.25 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-7.007a2.25 2.25 0 0 0-2.157-2.243l-.92-2.075m-9.146 0a2.31 2.31 0 0 0-1.759.675M12 17.25a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                                            </svg>
                                        </span>

                                        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 8.586 5.5h6.828c.685 0 1.34.276 1.759.675M6.827 6.175 5.907 8.25a2.25 2.25 0 0 0-2.157 2.243v7.007c0 1.243 1.007 2.25 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-7.007a2.25 2.25 0 0 0-2.157-2.243l-.92-2.075m-9.146 0a2.31 2.31 0 0 0-1.759.675M12 17.25a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                                            </svg>
                                        </span>
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-[13px] font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2 decoration-slate-300 hover:decoration-slate-500 transition-colors"
                                            >
                                                Upload photo
                                            </button>
                                            {avatarPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="text-[13px] font-medium text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            JPG, PNG, or WEBP — up to {MAX_AVATAR_MB}MB
                                        </p>
                                        {errors.avatar && (
                                            <p className="flex items-center gap-1 text-[11px] text-red-500">
                                                {errors.avatar}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {isBoarder && (
                                    <>

                                        <SectionLabel label="Valid ID Information" />

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400">ID Type</label>

                                            <select
                                                name="valid_id_type"
                                                value={form.valid_id_type}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-slate-300 placeholder:text-xs bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500"
                                            >
                                                <option value="" disabled>
                                                    Select ID Type
                                                </option>
                                                <option value="National ID">National ID</option>
                                                <option value="Passport">Passport</option>
                                                <option value="Driver's License">Driver's License</option>
                                                <option value="PhilHealth ID">PhilHealth ID</option>
                                                <option value="SSS ID">SSS ID</option>
                                                <option value="UMID">UMID</option>
                                                <option value="Postal ID">Postal ID</option>
                                                <option value="Voter's ID">Voter's ID</option>
                                                <option value="PRC ID">PRC ID</option>
                                                <option value="TIN ID">TIN ID</option>
                                                <option value="PWD ID">PWD ID</option>
                                                <option value="Senior Citizen ID">Senior Citizen ID</option>
                                                <option value="Student ID">Student ID</option>
                                                <option value="Barangay ID">Barangay ID</option>
                                            </select>

                                            {errors.valid_id_type && (
                                                <p className="text-xs text-red-500">
                                                    {errors.valid_id_type}
                                                </p>
                                            )}
                                        </div>
                                        <SectionLabel label="Valid ID" />

                                        <button
                                            type="button"
                                            onClick={() => idInputRef.current?.click()}
                                            className={`group relative w-full h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 overflow-hidden transition-all duration-200 ${errors.valid_id_image
                                                ? "border-red-300 bg-red-50/30"
                                                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                                                }`}
                                        >
                                            {idPreview ? (
                                                <>
                                                    <img src={idPreview} alt="Valid ID preview" className="absolute inset-0 w-full h-full object-cover" />
                                                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-150">
                                                        <span className="text-[12px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Replace image
                                                        </span>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                    </svg>
                                                    <span className="text-[12px] font-medium text-slate-600">
                                                        Upload valid ID
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        <input
                                            ref={idInputRef}
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={handleIdChange}
                                            className="hidden"
                                        />

                                        <div className="flex items-center justify-between">
                                            <p className="text-[11px] text-slate-400">
                                                JPG, PNG, or WEBP — up to {MAX_ID_MB}MB
                                            </p>
                                            {idPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removeId}
                                                    className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        {errors.valid_id_image && (
                                            <p className="flex items-center gap-1 text-[11px] text-red-500">
                                                {errors.valid_id_image}
                                            </p>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* Divider */}
                        <div className="border-t border-slate-100 pt-1" />

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={step === 1 ? onClose : goBack}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50"
                            >
                                {step === 1 ? "Cancel" : "Back"}
                            </button>

                            {step < TOTAL_STEPS ? (
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="px-5 py-2 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg transition-all shadow-sm shadow-slate-300"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg transition-all disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-slate-300"
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
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;


const SectionLabel = ({ label }: { label: string }) => (
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
        {label}
    </p>
);

type FieldProps = {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
};

const Field = ({ label, name, placeholder, value, onChange, type = "text", error }: FieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-600">
            {label}
        </label>
        <input
            name={name}
            placeholder={placeholder}
            value={value}
            type={type}
            onChange={onChange}
            className={`w-full h-9 px-3 text-[13px] rounded-lg border bg-white placeholder:text-slate-300 text-slate-800 outline-none transition-all duration-150
                focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400
                ${error
                    ? "border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-400"
                    : "border-slate-200 hover:border-slate-300"
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

type SelectProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    error?: string;
};

const Select = ({ label, name, value, onChange, options, error }: SelectProps) => (
    <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-600">
            {label}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full h-9 px-3 text-[13px] rounded-lg border bg-white text-slate-800 outline-none transition-all duration-150 appearance-none
                focus:ring-2 focus:ring-slate-500/20 focus:border-slate-400
                ${error
                    ? "border-red-300 bg-red-50/30 focus:ring-red-500/20 focus:border-red-400"
                    : "border-slate-200 hover:border-slate-300"
                }`}
        >
            <option value="" disabled>
                Select...
            </option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
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