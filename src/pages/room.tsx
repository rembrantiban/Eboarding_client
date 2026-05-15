import RoomsTable from "@/components/Room/Roomstable"

const room = () => {
    return (
        <div className="space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-2 h-screen ">
            <div>
        <h1 className="text-xl font-bold">Rooms</h1>
            <p className="text-muted-foreground">
            Manage your boarding house rooms and availability
        </p>
      </div>
            <RoomsTable />
        </div>
    )
}

export default room