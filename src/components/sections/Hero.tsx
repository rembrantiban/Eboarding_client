"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Hero = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { id: 1, image: "url('./Background.jpg')", title: "Manage Tenants" },
    { id: 2, image: "url('./E1.jpg')", title: "Track Payments" },
    { id: 3, image: "url('./E2.jpg')", title: "Monitor Rooms" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">

      {/* 🖼 FULLSCREEN BACKGROUND SLIDES */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          style={{
            backgroundImage: slide.image,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* 🌑 DARK OVERLAY for readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ◀ ▶ NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-300 z-20 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-300 z-20 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>

      {/* ● SLIDE INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 w-2 hover:bg-white/70"
              }`}
          />
        ))}
      </div>

      {/* 📝 CONTENT — sits above the overlay */}
      <div className="relative z-10 w-full max-w-3xl text-center space-y-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 backdrop-blur-sm rounded-full">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-white">Next Generation Solution</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg"
        >
          E
          <span className=" uppercase text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 text-5xl">-BOARDING</span> <br />
          A Computerized Boarding House Management System for Ermings
        </h1>

        {/* Description */}


        {/* Features List */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center text-left">
          {[
            "Real-time tenant and room management",
            "Automated payment tracking and reports",
            "Beautiful analytics and insights",
          ].map((feat) => (
            <div key={feat} className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex-1">
              <div className="w-5 h-5 rounded-full bg-blue-500/80 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white font-bold text-xs">✓</span>
              </div>
              <span className="text-white/90 text-sm font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white/50  text-black hover:text-white hover:bg-white/10 backdrop-blur-sm font-semibold rounded-lg px-8 py-4 transition-all duration-300"
            size="lg"
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Learn More
          </Button>
        </div>

        {/* Trust Text */}
        <p className="text-sm text-white/60 pt-2">
          ✨ Trusted by 500+ boarding houses worldwide
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        #home .relative.z-10 {
          animation: fadeInUp 0.7s ease-out;
        }
      `}</style>
    </section>
  )
}

export default Hero