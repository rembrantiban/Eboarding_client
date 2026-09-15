"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type { UserType } from "@/store/useAuthStore"; // TODO: adjust import path if UserType lives elsewhere
import {
    COUNTRIES,
    DIAL_OPTIONS,
    NATIONALITIES,
    DEFAULT_DIAL,
    DEFAULT_NATIONALITY,
    flagOf,
} from "@/constants/countries";
import {
    X,
    UserPlus,
    MapPin,
    LoaderCircle,
    Camera,
    ImagePlus,
    AlertCircle,
    Home,
    Briefcase,
    ChevronDown,
} from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};

type FormState = {
    first_name: string;
    last_name: string;
    username: string;
    country_code: string;
    contact_number: string;
    nationality: string;
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

const GENDER_OPTIONS = ["Male", "Female"];

const ID_TYPES = [
    "National ID",
    "Passport",
    "Driver's License",
    "PhilHealth ID",
    "SSS ID",
    "UMID",
    "Postal ID",
    "Voter's ID",
    "PRC ID",
    "TIN ID",
    "PWD ID",
    "Senior Citizen ID",
    "Student ID",
    "Barangay ID",
];

const ROLES: { value: UserType; label: string; hint: string; icon: typeof Home }[] = [
    {
        value: "Boarder" as UserType,
        label: "Boarder",
        hint: "Resident — needs ID & emergency contact",
        icon: Home,
    },
    {
        value: "Staff" as UserType,
        label: "Staff",
        hint: "Staff member with system access",
        icon: Briefcase,
    },
];

const AddUserModal = ({ open: _open, onClose }: Props) => {
    const { createUserByAdmin } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const idInputRef = useRef<HTMLInputElement>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [form, setForm] = useState<FormState>({
        first_name: "",
        last_name: "",
        username: "",
        country_code: DEFAULT_DIAL,
        contact_number: "",
        nationality: DEFAULT_NATIONALITY,
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

    /* ---------------- Location ---------------- */

    const fetchLocation = useCallback((silent = false) => {
        if (!navigator.geolocation) {
            if (!silent) toast.error("Geolocation is not supported on this device");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
                    );

                    const data = await res.json();

                    if (data?.display_name) {
                        setForm((prev) => ({ ...prev, address: data.display_name }));
                        setErrors((prev) => ({ ...prev, address: "" }));
                        if (!silent) toast.success("Address filled from your location");
                    } else if (!silent) {
                        toast.error("Could not resolve your address");
                    }
                } catch (err) {
                    console.error(err);
                    if (!silent) toast.error("Could not resolve your address");
                } finally {
                    setLoadingLocation(false);
                }
            },
            () => {
                setLoadingLocation(false);
                if (!silent) toast.error("Location permission denied");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Auto-fill address once when the modal opens
    useEffect(() => {
        if (!_open) return;
        fetchLocation(true);
    }, [_open, fetchLocation]);

    // Close on Escape
    useEffect(() => {
        if (!_open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [_open, onClose]);

    if (!_open) return null;

    const isBoarder = form.user_type === "Boarder";

    const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: sanitize(value) }));
    };

    const handleRoleChange = (role: UserType) => {
        setForm((prev) => ({ ...prev, user_type: role }));
        setErrors({});
    };

    // Selecting a dial code also updates nationality if the user hasn't touched it.
    const handleDialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dial = e.target.value;
        setForm((prev) => ({ ...prev, country_code: dial }));
        setErrors((prev) => ({ ...prev, country_code: "", contact_number: "" }));
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

    /* ---------------- Validation ---------------- */

    const nameRegex = /^[A-Za-z\s]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phRegex = /^09\d{9}$/;
    const passwordRegex = /^.{6,}$/;

    const isPH = form.country_code === "+63";

    // PH numbers keep the strict 09XXXXXXXXX rule; everything else accepts 6–15 digits.
    const validatePhone = (value: string) => {
        if (isPH) return phRegex.test(value);
        return /^\d{6,15}$/.test(value.replace(/[\s-]/g, ""));
    };

    const phoneHint = isPH ? "Format: 09XXXXXXXXX" : "Enter 6–15 digits";
    const phonePlaceholder = isPH ? "09XXXXXXXXX" : "Phone number";

    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};

        // Personal information
        if (!form.first_name) newErrors.first_name = "Required";
        else if (!nameRegex.test(form.first_name)) newErrors.first_name = "Letters only";

        if (!form.last_name) newErrors.last_name = "Required";
        else if (!nameRegex.test(form.last_name)) newErrors.last_name = "Letters only";

        if (isBoarder) {
            if (!form.nationality) newErrors.nationality = "Required";

            if (!form.gender) newErrors.gender = "Required";

            if (!form.age) newErrors.age = "Required";
            else if (Number(form.age) < 1 || Number(form.age) > 120)
                newErrors.age = "Enter a valid age";
        }

        // Account details
        if (!form.username) newErrors.username = "Required";
        else if (!usernameRegex.test(form.username))
            newErrors.username = "4–20 chars, letters/numbers/_";

        if (!form.email) newErrors.email = "Required";
        else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";

        if (isBoarder) {
            if (!form.country_code) newErrors.country_code = "Required";

            if (!form.contact_number) newErrors.contact_number = "Required";
            else if (!validatePhone(form.contact_number))
                newErrors.contact_number = phoneHint;

            if (!form.address) newErrors.address = "Required";
        }

        if (!form.password) newErrors.password = "Required";
        else if (!passwordRegex.test(form.password)) newErrors.password = "Min. 6 characters";

        // Boarder only
        if (isBoarder) {
            if (!form.emergency_contact_name) newErrors.emergency_contact_name = "Required";

            if (!form.emergency_contact_number)
                newErrors.emergency_contact_number = "Required";
            else if (!validatePhone(form.emergency_contact_number))
                newErrors.emergency_contact_number = phoneHint;

            if (!form.emergency_contact_relationship)
                newErrors.emergency_contact_relationship = "Required";
            if (!form.valid_id_type) newErrors.valid_id_type = "Required";
            if (!form.valid_id_image) newErrors.valid_id_image = "Valid ID is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            toast.error("Please complete the highlighted fields");
            return;
        }

        try {
            const payload = isBoarder
                ? form
                : {
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
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
        ((form.first_name?.[0] ?? "") + (form.last_name?.[0] ?? "")).toUpperCase();

    const selectedCountry =
        COUNTRIES.find((c) => c.dial === form.country_code) ?? null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:max-w-xl sm:rounded-2xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <UserPlus className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
                                Add New User
                            </h2>
                            <p className="text-[11.5px] leading-tight text-slate-400">
                                Fill in the details to create an account
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">

                        <div className="space-y-3">
                            <SectionLabel label="Account type" />

                            <div className="grid grid-cols-2 gap-2.5">
                                {ROLES.map(({ value, label, hint, icon: Icon }) => {
                                    const active = form.user_type === value;
                                    return (
                                        <label
                                            key={label}
                                            className={`cursor-pointer rounded-xl border p-3 transition-all ${active
                                                ? "border-slate-900 bg-slate-900"
                                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="user_type"
                                                value={label}
                                                checked={active}
                                                onChange={() => handleRoleChange(value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-white/10" : "bg-slate-100"
                                                        }`}
                                                >
                                                    <Icon
                                                        className={`h-3.5 w-3.5 ${active ? "text-white" : "text-slate-600"
                                                            }`}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-[13px] font-semibold ${active ? "text-white" : "text-slate-800"
                                                        }`}
                                                >
                                                    {label}
                                                </span>
                                            </div>
                                            <p
                                                className={`mt-1.5 text-[11px] leading-snug ${active ? "text-slate-400" : "text-slate-400"
                                                    }`}
                                            >
                                                {hint}
                                            </p>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Profile photo */}
                        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-400 transition-all hover:border-slate-300"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : initials ? (
                                    initials
                                ) : (
                                    <Camera className="h-4 w-4 text-slate-400" />
                                )}

                                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all group-hover:bg-slate-900/40">
                                    <Camera className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                                </span>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

                            <div className="min-w-0">
                                <p className="text-[12.5px] font-medium text-slate-800">
                                    Profile photo{" "}
                                    <span className="font-normal text-slate-400">(optional)</span>
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    JPG, PNG, or WEBP — up to {MAX_AVATAR_MB}MB
                                </p>

                                <div className="mt-1.5 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Upload
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="text-[11.5px] font-medium text-slate-400 transition-colors hover:text-red-500"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {errors.avatar && <ErrorText text={errors.avatar} />}
                            </div>
                        </div>

                        {/* Personal information */}
                        <div className="space-y-3">
                            <SectionLabel label="Personal information" />

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="First name" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} onBlur={handleBlur} error={errors.first_name} />
                                <Field label="Last name" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} onBlur={handleBlur} error={errors.last_name} />
                            </div>

                            {isBoarder && (
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
                            )}

                            {isBoarder && (
                                <Select
                                    label="Nationality"
                                    name="nationality"
                                    value={form.nationality}
                                    onChange={handleChange}
                                    options={NATIONALITIES}
                                    error={errors.nationality}
                                />
                            )}
                        </div>

                        {/* Account details */}
                        <div className="space-y-3">
                            <SectionLabel label="Account details" />

                            <div className={isBoarder ? "grid grid-cols-2 gap-3" : ""}>
                                <Field label="Username" name="username" placeholder="john_doe" value={form.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />

                                {isBoarder && (
                                    <PhoneField
                                        label="Contact number"
                                        name="contact_number"
                                        dial={form.country_code}
                                        onDialChange={handleDialChange}
                                        value={form.contact_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder={phonePlaceholder}
                                        error={errors.contact_number || errors.country_code}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Email address" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" error={errors.email} />
                                <Field label="Password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} type="password" error={errors.password} />
                            </div>

                            {/* Address with location — boarder only */}
                            {isBoarder && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <label className="block text-[12px] font-medium text-slate-600">
                                            Address
                                        </label>
                                        {selectedCountry && (
                                            <span className="text-[11px] text-slate-400">
                                                {flagOf(selectedCountry.iso)} {selectedCountry.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                                        <input
                                            name="address"
                                            type="text"
                                            placeholder={
                                                loadingLocation
                                                    ? "Getting your current location..."
                                                    : "Street, Barangay, City, Province"
                                            }
                                            value={form.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full resize-none rounded-lg border bg-white py-2 pl-8 pr-3 text-[13px] leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 ${errors.address
                                                ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        />
                                    </div>

                                    {errors.address ? (
                                        <ErrorText text={errors.address} />
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Emergency contact — boarder only */}
                        {isBoarder && (
                            <div className="space-y-3">
                                <SectionLabel label="Emergency contact" />

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Contact name" name="emergency_contact_name" placeholder="Jane Doe" value={form.emergency_contact_name} onChange={handleChange} onBlur={handleBlur} error={errors.emergency_contact_name} />
                                    <Field label="Contact number" name="emergency_contact_number" placeholder={phonePlaceholder} value={form.emergency_contact_number} onChange={handleChange} onBlur={handleBlur} error={errors.emergency_contact_number} />
                                </div>

                                <Field label="Relationship" name="emergency_contact_relationship" placeholder="Mother, Father, Guardian..." value={form.emergency_contact_relationship} onChange={handleChange} onBlur={handleBlur} error={errors.emergency_contact_relationship} />
                            </div>
                        )}

                        {/* Valid ID — boarder only */}
                        {isBoarder && (
                            <div className="space-y-3">
                                <SectionLabel label="Valid ID" />

                                <Select
                                    label="ID type"
                                    name="valid_id_type"
                                    value={form.valid_id_type}
                                    onChange={handleChange}
                                    options={ID_TYPES}
                                    error={errors.valid_id_type}
                                />

                                <div className="space-y-1.5">
                                    <label className="block text-[12px] font-medium text-slate-600">
                                        ID photo
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => idInputRef.current?.click()}
                                        className={`group relative flex h-28 w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed transition-all ${errors.valid_id_image
                                            ? "border-red-300 bg-red-50/30"
                                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                                            }`}
                                    >
                                        {idPreview ? (
                                            <>
                                                <img
                                                    src={idPreview}
                                                    alt="Valid ID preview"
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all group-hover:bg-slate-900/50">
                                                    <span className="text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                        Replace image
                                                    </span>
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                                                    <ImagePlus className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <span className="text-[12px] font-medium text-slate-600">
                                                    Upload valid ID
                                                </span>
                                                <span className="text-[10.5px] text-slate-400">
                                                    JPG, PNG, or WEBP — up to {MAX_ID_MB}MB
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

                                    <div className="flex items-center justify-between gap-2">
                                        {errors.valid_id_image ? (
                                            <ErrorText text={errors.valid_id_image} />
                                        ) : (
                                            <span />
                                        )}
                                        {idPreview && (
                                            <button
                                                type="button"
                                                onClick={removeId}
                                                className="text-[11px] font-medium text-slate-400 transition-colors hover:text-red-500"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-3.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-[12.5px] font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Create user
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;

/* ---------------- Small building blocks ---------------- */

const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2.5">
        <p className="whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
        </p>
        <div className="h-px flex-1 bg-slate-100" />
    </div>
);

const ErrorText = ({ text }: { text: string }) => (
    <p className="flex items-center gap-1 text-[11px] text-red-500">
        <AlertCircle className="h-3 w-3 shrink-0" />
        {text}
    </p>
);

type FieldProps = {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
    disabled?: boolean;
};

const Field = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    type = "text",
    error,
    disabled,
}: FieldProps) => (
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
            onBlur={onBlur}
            disabled={disabled}
            className={`h-9 w-full rounded-lg border bg-white px-3 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 disabled:bg-slate-50 disabled:text-slate-400
                ${error
                    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
        />
        {error && <ErrorText text={error} />}
    </div>
);

type PhoneFieldProps = {
    label: string;
    name: string;
    dial: string;
    onDialChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
};

const PhoneField = ({
    label,
    name,
    dial,
    onDialChange,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
}: PhoneFieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-600">
            {label}
        </label>

        <div
            className={`flex h-9 w-full items-center overflow-hidden rounded-lg border bg-white transition-all focus-within:ring-2
            ${error
                    ? "border-red-300 bg-red-50/30 focus-within:border-red-400 focus-within:ring-red-500/20"
                    : "border-slate-200 hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-slate-500/20"
                }`}
        >
            <div className="relative shrink-0">
                <select
                    name="country_code"
                    value={dial}
                    onChange={onDialChange}
                    aria-label="Country code"
                    className="h-9 w-18.5 cursor-pointer appearance-none bg-transparent pl-2.5 pr-5 text-[13px] text-slate-700 outline-none"
                >
                    {DIAL_OPTIONS.map((c) => (
                        <option key={c.iso} value={c.dial}>
                            {flagOf(c.iso)} {c.dial} — {c.name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>

            <span className="h-4 w-px shrink-0 bg-slate-200" />

            <input
                name={name}
                type="tel"
                inputMode="numeric"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="h-9 min-w-0 flex-1 bg-transparent px-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-300"
            />
        </div>

        {error && <ErrorText text={error} />}
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
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`h-9 w-full appearance-none rounded-lg border bg-white pl-3 pr-8 text-[13px] text-slate-800 outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20
                ${error
                        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
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
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        {error && <ErrorText text={error} />}
    </div>
);