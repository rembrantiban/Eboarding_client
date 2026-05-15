import { Home } from "lucide-react"

const tenants = [
  {
    name: "Juan Dela Cruz",
    room: "Room 01",
    image: "https://i.pravatar.cc/40?img=1",
  },
  {
    name: "Maria Santos",
    room: "Room 02",
    image: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Pedro Reyes",
    room: "Room 03",
    image: "https://i.pravatar.cc/40?img=3",
  },
]

const RecentTenants = () => {
  return (
    <div className="rounded-2xl border bg-background p-5 w-full max-w-xs shadow-sm">
      <h3 className="font-semibold mb-4">Recent Tenants</h3>

      <div className="space-y-3">
        {tenants.map((tenant, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition"
          >
            {/* 🔷 LEFT (Avatar + Name) */}
            <div className="flex items-center gap-3">
              
              {/* Avatar */}
              <img
                src={tenant.image}
                alt={tenant.name}
                className="w-9 h-9 rounded-full object-cover"
              />

              {/* Name */}
              <div>
                <p className="text-sm font-medium">{tenant.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Home size={12} />
                  {tenant.room}
                </p>
              </div>

            </div>

            {/* 🔷 OPTIONAL STATUS DOT */}
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTenants