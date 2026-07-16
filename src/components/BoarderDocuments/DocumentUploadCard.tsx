"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/hooks/useDocuments";

 const ID_TYPES = [
  "National ID (PhilSys)",
  "Passport",
  "Driver's License",
  "Student ID",
  "UMID",
  "SSS ID",
  "GSIS ID",
  "PhilHealth ID",
  "Voter's ID",
  "PRC ID",
  "Senior Citizen ID",
  "PWD ID",
  "TIN ID",
  "Barangay ID",
  "Police Clearance ID",
  "NBI Clearance",
  "Company ID",
];

interface DocumentUploadCardProps {
  mode: "upload" | "replace";
  defaultIdType?: string;
}

const DocumentUploadCard = ({ mode, defaultIdType }: DocumentUploadCardProps) => {
  const { uploadDocument, uploading } = useDocument();
  const inputRef = useRef<HTMLInputElement>(null);

  const [idType, setIdType] = useState(defaultIdType ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!idType || !file) return;
    const success = await uploadDocument(idType, file);
    if (success) handleClearFile();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">
        {mode === "replace" ? "Replace Your Valid ID" : "Upload Your Valid ID"}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "replace"
          ? "Upload a new document to replace your rejected submission."
          : "Accepted formats: JPG, PNG, PDF. Max size 5MB."}
      </p>

      <div className="mt-5 space-y-4">
        {/* ID Type select */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            ID Type
          </label>
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="" disabled>
              Select ID type
            </option>
            {ID_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Upload dropzone */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            ID Image
          </label>

          {!preview ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <UploadCloud size={22} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-slate-400">JPG, PNG, or PDF</span>
            </button>
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-slate-200">
              <img
                src={preview}
                alt="Selected ID preview"
                className="h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearFile}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!idType || !file || uploading}
          className="w-full gap-2 rounded-lg bg-slate-900 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <UploadCloud size={15} />
          )}
          {mode === "replace" ? "Submit Replacement" : "Submit Document"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadCard;