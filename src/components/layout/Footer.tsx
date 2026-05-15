import { Mail } from "lucide-react"
import { FaFacebook } from "react-icons/fa6";



const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* 🔷 Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold tracking-tight">
            E-BOARDINGHOUSE
          </h2>
          <p className="text-sm text-muted-foreground">
            Smart Boarding House Management System
          </p>
        </div>

        {/* 🔷 Navigation Links */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition">
            Home
          </a>
          <a href="#" className="hover:text-foreground transition">
            About
          </a>
          <a href="#" className="hover:text-foreground transition">
            Contact
          </a>
        </div>

        {/* 🔷 Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition">
            <FaFacebook size={18} />
          </a>
         
          <a href="#" className="hover:text-foreground transition">
            <Mail size={18} />
          </a>
        </div>
      </div>

      {/* 🔷 Bottom Bar */}
      <div className="text-center text-xs text-muted-foreground pb-4">
        © {new Date().getFullYear()} E-BOARDINGHOUSE. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer