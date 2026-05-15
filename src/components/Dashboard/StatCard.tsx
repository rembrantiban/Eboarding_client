import type { ReactNode } from "react"

type Props = {
  title: string
  value: string
  icon: ReactNode
}

const StatCard = ({ title, value, icon }: Props) => {
  return (
    <div className="relative rounded-md border bg-background p-5 shadow-sm hover:shadow-md transition overflow-hidden">
      
      {/* 🔷 Content */}
      <div className="relative z-10">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </div>

      {/* 🔷 Icon (Top Right - Large & Faded) */}
      <div className="absolute right-3 top-3 text-muted-foreground/20">
        <div className="w-20 h-20">
          {icon}
        </div>
      </div>

    </div>
  )
}

export default StatCard