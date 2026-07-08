import { Mail, ArrowUpRight } from "lucide-react"
import { FaFacebook } from "react-icons/fa6"

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* 🔷 Branding */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight text-white">
            E-BOARDINGHOUSE
          </h2>
          <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
            Smart Boarding House Management System — helping residents and
            admins manage rooms, payments, and updates in one place.
          </p>

          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
            >
              <FaFacebook size={16} />
            </a>
            <a href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* 🔷 Navigation Links */}
        <div className="md:justify-self-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
            Navigation
          </p>
          <div className="flex flex-col gap-3 text-sm">
            <a href="#" className="text-neutral-300 hover:text-white transition flex items-center gap-1 group w-fit">
              Home
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a href="#" className="text-neutral-300 hover:text-white transition flex items-center gap-1 group w-fit">
              About
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a href="#" className="text-neutral-300 hover:text-white transition flex items-center gap-1 group w-fit">
              Contact
              <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
            </a>
          </div>
        </div>

        {/* 🔷 Contact / Info block */}
        <div className="md:justify-self-end">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
            Get in touch
          </p>
          <div className="flex flex-col gap-3 text-sm text-neutral-300">
            <a href="mailto:support@eboardinghouse.com" className="hover:text-white transition">
              support@eboardinghouse.com
            </a>
          </div>
        </div>
      </div>

      {/* 🔷 Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} E-BOARDINGHOUSE. All rights reserved.</span>
          <span>Built for smarter boarding house management.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer