"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
//import Hero from "@/components/sections/Hero"
import Features from "@/components/sections/Features"
import CTA from "@/components/sections/CTA"
import LocationSection from "@/components/sections/locationSection"
import AboutSection from "@/components/sections/AboutSection"
import { Separator } from "@/components/ui/separator"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"


const Home = () => {
    const { user } = useAuth();

  if (user) {
    if (user.user_type === "Admin" || user.user_type === "Staff") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.user_type === "Boarder") {
      return <Navigate to="/boarder-dashboard" replace />;
    }
  }

  return (  
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <img src="/Background.png" alt="Hero" className="w-full h-screen object-fit" />
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