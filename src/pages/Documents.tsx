

import DocumentsModule from "@/components/Document/DocumentsModule"
const Documents = () => {
    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-10 pb-15 pt-4 bg-gray-50 ">
                <div className=" mb-3">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Document Management
                    </h1>

                    <p className="mt-1 max-w-3xl text-sm text-slate-500">
                        Review, verify, and manage boarder identification documents.
                    </p>
                </div>
                <DocumentsModule />
            </div>
        </div>
    )
}

export default Documents