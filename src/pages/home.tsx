"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import CTA from "@/components/sections/CTA"
import LocationSection from "@/components/sections/locationSection"
import AboutSection from "@/components/sections/AboutSection"
import { Separator } from "@/components/ui/separator"
const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <LocationSection />
      <Separator className="my-12" />
      <AboutSection />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home