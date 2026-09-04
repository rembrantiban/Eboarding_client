"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
    X,
    Wrench,
    ImagePlus,
    AlertCircle,
    ChevronDown,
    LoaderCircle,
    Send,
} from "lucide-react";
import { useMaintenance } from "@/hooks/useMaintenace";
import { useRoom } from "@/hooks/useRoom"

type Props = {
    open: boolean;
    onClose: () => void;
    defaultRoomNumber?: string;
    defaultBedNumber?: string;
    onCreated?: () => void;
};

type FormState = {
    category: string;
    room_id: string;
    description: string;
    image: File | null;
};

const CATEGORIES = [
    "Plumbing",
    "Electrical",
    "Air Conditioning",
    "Door / Lock",
    "Painting",
    "Furniture",
    "Water Supply",
    "Internet",
];

const MAX_IMAGE_MB = 5;
const MAX_DESCRIPTION = 300;

const AddMaintenanceRequestModal = ({
    open,
    onClose,
    onCreated,
}: Props) => {
    const { createMaintenanceRequest } = useMaintenance();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const { rooms, getRooms } = useRoom();


    useEffect(() => {
        getRooms();
    }, [getRooms]);

    const [form, setForm] = useState<FormState>({
        category: "",
        room_id: "",
        description: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setErrors((prev) => ({ ...prev, image: "Use a JPG, PNG, or WEBP file" }));
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: `Max file size is ${MAX_IMAGE_MB}MB` }));
            return;
        }

        setErrors((prev) => ({ ...prev, image: "" }));
        setForm((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: "" }));
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};

        if (!form.category) newErrors.category = "Pick a category";

        if (!form.room_id) newErrors.room_id = "Required";

        if (!form.description.trim()) newErrors.description = "Required";
        else if (form.description.trim().length < 10)
            newErrors.description = "Please describe the issue in a bit more detail";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please complete the highlighted fields");
            return;
        }

        setIsSubmitting(true);

        try {
            await createMaintenanceRequest({
                category: form.category,
                room_id: form.room_id,
                description: form.description.trim(),
                image: form.image,
            } as never);

            toast.success("Maintenance request submitted");
            onCreated?.();
            onClose();
        } catch (err: unknown) {
            let message = "Failed to submit request";
            if (typeof err === "string") message = err;
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const remaining = MAX_DESCRIPTION - form.description.length;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:max-w-lg sm:rounded-2xl">

                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <Wrench className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
                                New Maintenance Request
                            </h2>
                            <p className="text-[11.5px] leading-tight text-slate-400">
                                Tell us what needs fixing
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

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">

                        {/* Category */}
                        <section className="space-y-3">
                            <SectionLabel label="Category" />

                            <Select
                                label="Issue category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                options={CATEGORIES}
                                error={errors.category}
                            />
                        </section>

                        {/* Location */}
                        <section className="space-y-3">
                            <SectionLabel label="Location" />

                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1.5">
                                    <label className="block text-[12px] font-medium text-slate-600">
                                        Room Number
                                    </label>

                                    <div className="relative">
                                        <select
                                            name="room_id"
                                            value={form.room_id}
                                            onChange={handleChange}
                                            className={`h-9 w-full appearance-none rounded-lg border bg-white pl-3 pr-8 text-[13px] outline-none transition-all
                                          ${form.room_id === ""
                                                    ? "text-slate-400"
                                                    : "text-slate-800"
                                                }
                                          ${errors.room_id
                                                    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                                                    : "border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                                                }`}
                                        >
                                            <option value="">
                                                Select a room...
                                            </option>

                                            {rooms.map((room) => (
                                                <option
                                                    key={room.id}
                                                    value={room.id}
                                                >
                                                    Room {room.room_number}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>

                                    {errors.room_id && (
                                        <ErrorText text={errors.room_id} />
                                    )}
                                </div>

                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-3">
                            <SectionLabel label="Details" />

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <label className="block text-[12px] font-medium text-slate-600">
                                        Description
                                    </label>
                                    <span
                                        className={`text-[10.5px] tabular-nums ${remaining < 0 ? "text-red-500" : "text-slate-400"
                                            }`}
                                    >
                                        {form.description.length}/{MAX_DESCRIPTION}
                                    </span>
                                </div>

                                <textarea
                                    name="description"
                                    rows={4}
                                    maxLength={MAX_DESCRIPTION}
                                    placeholder="Describe the issue — what's wrong, where exactly, and when it started."
                                    value={form.description}
                                    onChange={handleChange}
                                    className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-[13px] leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 ${errors.description
                                        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                                        : "border-slate-200 hover:border-slate-300"
                                        }`}
                                />

                                {errors.description && <ErrorText text={errors.description} />}
                            </div>
                        </section>

                        {/* Photo */}
                        <section className="space-y-3">
                            <SectionLabel label="Photo (optional)" />

                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className={`group relative flex h-32 w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed transition-all ${errors.image
                                    ? "border-red-300 bg-red-50/30"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                                    }`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Issue preview"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all group-hover:bg-slate-900/50">
                                            <span className="text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                Replace photo
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                                            <ImagePlus className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <span className="text-[12px] font-medium text-slate-600">
                                            Add a photo of the issue
                                        </span>
                                        <span className="text-[10.5px] text-slate-400">
                                            JPG, PNG, or WEBP — up to {MAX_IMAGE_MB}MB
                                        </span>
                                    </>
                                )}
                            </button>

                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <div className="flex items-center justify-between gap-2">
                                {errors.image ? <ErrorText text={errors.image} /> : <span />}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="text-[11px] font-medium text-slate-400 transition-colors hover:text-red-500"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-white px-5 py-3.5">
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
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-3.5 w-3.5" />
                                    Submit request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaintenanceRequestModal;

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
    error?: string;
};

const Field = ({ label, name, placeholder, value, onChange, error }: FieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-600">{label}</label>
        <input
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`h-9 w-full rounded-lg border bg-white px-3 text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20
                ${error
                    ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
        />
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
        <label className="block text-[12px] font-medium text-slate-600">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`h-9 w-full appearance-none rounded-lg border bg-white pl-3 pr-8 text-[13px] outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20
                ${value === "" ? "text-slate-400" : "text-slate-800"}
                ${error
                        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
            >
                <option value="" disabled>
                    Select a category...
                </option>
                {options.map((opt) => (
                    <option key={opt} value={opt} className="text-slate-800">
                        {opt}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        {error && <ErrorText text={error} />}
    </div>
);