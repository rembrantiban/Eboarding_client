import BoardersTable from "@/components/Boarders/BoardersTable"
const boarders = () => {
  return (
  
        <div className="space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-2 h-screen overflow-auto">
            <BoardersTable />
        </div>
  )
}

export default boarders