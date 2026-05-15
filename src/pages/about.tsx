"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black overflow-hidden">

      {/* 🔷 FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-2 h-2 bg-purple-600 rounded-full opacity-60 animate-pulse top-20 left-20" style={{ animationDelay: '0s' }} />
        <div className="absolute w-1 h-1 bg-blue-600 rounded-full opacity-40 animate-pulse top-40 right-32" style={{ animationDelay: '1s' }} />
        <div className="absolute w-3 h-3 bg-indigo-600 rounded-full opacity-50 animate-pulse bottom-32 left-40" style={{ animationDelay: '2s' }} />
        <div className="absolute w-1.5 h-1.5 bg-pink-600 rounded-full opacity-70 animate-pulse top-60 right-20" style={{ animationDelay: '0.5s' }} />
      </div>

      <header className="w-full border-b border-black/10 bg-white/80 backdrop-blur-xl sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2 animate-slide-in-left">
           <img src="/logo.png" alt="Logo" className="h-15 hover:scale-110 transition-transform duration-300" />
          </div>

            <Button variant="ghost" className="hover:bg-black/10 transition-all duration-300">Home</Button>
            <Button variant="outline" className="border-black/20 hover:border-black/40 hover:bg-black/5 transition-all duration-300">Login</Button>
        </div>
      </header>

      {/* 🔷 HERO */}
      <section className="text-center py-24 px-6 relative overflow-hidden animate-fade-in-up">

        {/* Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-96 h-96 bg-purple-200/30 blur-[150px] top-10 left-10 animate-pulse" />
          <div className="absolute w-96 h-96 bg-blue-200/30 blur-[150px] bottom-10 right-10 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-64 h-64 bg-indigo-200/20 blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-black via-purple-600 to-blue-600 bg-clip-text text-transparent animate-slide-in-up">
          About E-BOARDINGHOUSE
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-black/80 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          A futuristic web-based system designed to revolutionize boarding house management with AI-powered efficiency and immersive tenant experiences.
        </p>
      </section>

      {/* 🔷 ABOUT SECTION */}
      <section className="px-6 pb-24 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div className="animate-slide-in-left">
            <h2 className="text-3xl font-semibold mb-4 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              What is E-BOARDINGHOUSE?
            </h2>

            <p className="text-black/70 leading-relaxed hover:text-black transition-colors duration-300">
              E-BOARDINGHOUSE is an intelligent management system that empowers landlords and administrators with cutting-edge tools for tenant records, room assignments, payments, and analytics. It transforms traditional processes into a seamless digital ecosystem.
            </p>

            <p className="text-black/60 mt-4 hover:text-black/80 transition-colors duration-300">
              Powered by advanced algorithms and real-time data processing, the system delivers unparalleled organization, instant insights, and strategic decision-making capabilities.
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border border-black/20 rounded-2xl shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 animate-slide-in-right">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-black">Quantum Benefits</h3>
              <ul className="text-sm text-black/70 space-y-2">
                <li className="hover:text-purple-600 transition-colors duration-300">⚡ AI-driven tenant management</li>
                <li className="hover:text-blue-600 transition-colors duration-300">💎 Real-time holographic tracking</li>
                <li className="hover:text-indigo-600 transition-colors duration-300">🔮 Predictive analytics engine</li>
                <li className="hover:text-pink-600 transition-colors duration-300">🛡️ Quantum-secure infrastructure</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* 🔷 FEATURES */}
      <section className="px-6 pb-24 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-4xl font-semibold text-center mb-12 bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
          Why Choose Our Quantum System?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          <Card className="bg-linear-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-xl border border-purple-200/30 rounded-2xl shadow-xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-500 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-purple-600">Efficiency</h3>
              <p className="text-sm text-black/70">
                Automate operations with neural networks and eliminate manual drudgery.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-xl border border-blue-200/30 rounded-2xl shadow-xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-500 animate-slide-in-up" style={{ animationDelay: '1s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-blue-600">Accuracy</h3>
              <p className="text-sm text-black/70">
                Achieve perfection with AI validation and error-free digital precision.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-indigo-50/50 to-purple-50/50 backdrop-blur-xl border border-indigo-200/30 rounded-2xl shadow-xl hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-500 animate-slide-in-up" style={{ animationDelay: '1.2s' }}>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-indigo-600">Scalability</h3>
              <p className="text-sm text-black/70">
                Expand infinitely with cloud-native architecture and limitless potential.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* 🔷 CTA */}
      <section className="relative py-20 text-center px-6 overflow-hidden animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
        <div className="absolute inset-0 z-10 bg-linear-to-r from-purple-200 via-blue-200 to-indigo-200 animate-pulse" />
        <div className="absolute inset-0 z-10 bg-white/20" />

        <h2 className="text-3xl md:text-4xl font-semibold text-black relative z-20 animate-bounce">
          Enter the Future of Management
        </h2>

        <Button className="mt-6 bg-black text-white hover:bg-purple-600 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 animate-pulse">
          Launch Experience
        </Button>
      </section>

      <footer className="text-center text-sm text-black/50 py-6 border-t border-black/10 animate-fade-in" style={{ animationDelay: '1.6s' }}>
        © {new Date().getFullYear()} E-BOARDINGHOUSE - Pioneering the Digital Frontier
      </footer>
    </div>
  )
}

export default About