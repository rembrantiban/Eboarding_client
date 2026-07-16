"use client";

import { Info } from "lucide-react";

const DocumentInfoBanner = () => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Info size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Keep your documents up to date</p>
        <p className="mt-0.5 text-sm text-slate-500">
          Ensure your documents are valid and not expired. You will be notified if any document is rejected.
        </p>
      </div>
    </div>
  );
};

export default DocumentInfoBanner;