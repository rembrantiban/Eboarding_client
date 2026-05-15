"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";

type Props = {
  latitude?: number;
  longitude?: number;
  address?: string;
};

const LocationCard = ({
  latitude = 14.5995,
  longitude = 120.9842,
  address = " Bateria Poblacion Guihulngan City Negros Oriental Philippines",
}: Props) => {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d233.3331703012142!2d123.2750128738598!3d10.126198119093628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sph!4v1776860023843!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade`;
  return (
    <div className="bg-white rounded shadow-lg overflow-hidden h-fit sticky top-24">
      
      {/* 🗺️ MAP SECTION */}
      <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>
      </div>

      {/* 📄 INFO SECTION */}
      <div className="p-6 space-y-6">
        
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            E-Bourdings
          </h2>
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-blue-600 mt-1 shrink-0" />
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="border-t border-b py-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Welcome to E-Bourdings, your perfect boarding solution! Discover comfortable and affordable rooms in the heart of the city. Our modern facilities and convenient location make it ideal for students and professionals.
          </p>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">Contact Us</h3>
          
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-blue-600 shrink-0" />
            <a href="tel:+639123456789" className="text-sm text-gray-700 hover:text-blue-600 transition">
              +63 912 345 6789
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={16} className="text-blue-600 shrink-0" />
            <a href="mailto:info@ebourdings.com" className="text-sm text-gray-700 hover:text-blue-600 transition">
              info@ebourdings.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Globe size={16} className="text-blue-600 shrink-0" />
            <a href="https://ebourdings.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-blue-600 transition">
              www.ebourdings.com
            </a>
          </div>
        </div>

        {/* FEATURES */}
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-xl space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm">Why Choose Us?</h3>
          <ul className="text-xs text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Affordable monthly rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Modern facilities & amenities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Safe and secure location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>

        {/* CTA BUTTON */}
        <a
          href={`https://maps.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold text-center block"
        >
          Visit Our Location
        </a>
      </div>
    </div>
  );
};

export default LocationCard;
