"use client"

import { Users, CreditCard, BarChart } from "lucide-react"

const features = [
  {
    title: "Boarder Management",
    desc: "Manage tenant records, profiles, and room assignments efficiently.",
    icon: Users,
    number: "01",
    accent: "#3b82f6",
  },
  {
    title: "Payment Tracking",
    desc: "Track rent payments and monitor financial transactions in real-time.",
    icon: CreditCard,
    number: "02",
    accent: "#6366f1",
  },
  {
    title: "Analytics Dashboard",
    desc: "Get real-time insights into occupancy and system performance.",
    icon: BarChart,
    number: "03",
    accent: "#0ea5e9",
  },
]

const Features = () => {
  return (
    <section
      id="features"
      className="relative px-6 py-28 overflow-hidden bg-[#f8fafc]"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Soft blue blob */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-slate-100 rounded-full blur-[120px] opacity-60 -z-10 translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-20">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-blue-500 uppercase mb-4">
            Platform Features
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-5xl font-bold text-slate-900 leading-tight"
            >
              Everything you need
              <br />
              <span className="text-blue-600">in one place.</span>
            </h2>
            <p className="text-slate-500 text-base max-w-xs leading-relaxed md:text-right">
              Built for boarding house owners who want clarity, speed, and control.
            </p>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px bg-linear-to-r from-blue-200 via-slate-200 to-transparent" />
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Large ghost number */}
                <span
                  className="absolute -top-4 -right-2 text-[7rem] font-black leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110"
                  style={{ color: `${feature.accent}0d` }}
                >
                  {feature.number}
                </span>

                {/* Top row: number + icon */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-bold tracking-widest text-slate-300">
                    {feature.number}
                  </span>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-slate-800 shadow-md transition-transform duration-300 group-hover:-translate-y-1"
                    
                  >
                    <Icon size={20} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                  style={{
                    background: `linear-gradient(to right, ${feature.accent}, ${feature.accent}44)`,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* BOTTOM STATS ROW */}
        <div className="mt-16 grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {[
            { value: "500+", label: "Boarding Houses" },
            { value: "99.9%", label: "Uptime Guaranteed" },
            { value: "24/7", label: "Support Available" },
          ].map((stat, i) => (
            <div key={i} className="px-8 py-6 text-center">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1 tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features