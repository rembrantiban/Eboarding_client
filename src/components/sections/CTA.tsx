"use client"

import { Button } from "@/components/ui/button"

const CTA = () => {
  return (
    <section className="relative py-24 px-6 text-center overflow-hidden">
      
      {/* 🔷 GRADIENT BACKGROUND */}
      <div className="absolute inset-0 z-10 bg-linear-to-br from-purple-200 via-blue-300 to-indigo-300" />

      {/* 🔷 GLOW EFFECTS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-100 h-100 bg-purple-400/30 blur-[120px] top-0 left-0" />
        <div className="absolute w-100 h-100 bg-blue-400/30 blur-[120px] bottom-0 right-0" />
      </div>

      {/* 🔷 CONTENT */}
      <div className="relative z-10 max-w-2xl mx-auto text-white">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Ready to get started?
        </h2>

        <p className="mt-4 text-white/80">
          Start managing your boarding house the smart and efficient way today.
        </p>

        {/* 🔷 BUTTONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 transition"
          >
            Go to Dashboard
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA