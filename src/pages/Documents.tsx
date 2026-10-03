import DocumentsModule from "@/components/Document/DocumentsModule"
import { FolderOpen } from "lucide-react"

const Documents = () => {
    return (
        <div className="h-full overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 px-10 pb-15 pt-4 bg-gray-50 ">
                <div className=" mb-3 border-b pb-3 border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 w-10 h-10 px-2.5 py-2.5 rounded-lg">
                            <FolderOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Document Management
                            </h1>
                            <p className=" max-w-3xl text-sm text-slate-500">
                                Review, verify, and manage boarder identification documents.
                            </p>
                        </div>
                    </div>
                </div>

                <DocumentsModule />
            </div>
        </div>
    )
}

export default Documents