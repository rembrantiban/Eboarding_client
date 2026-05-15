"use client";

import { MapPin, Phone, Mail } from "lucide-react";

const LocationSection = () => {
  return (
    <section id="location" className="py-16 px-6 bg-background">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* 🔷 LEFT CONTENT */}
        <div className="space-y-6">

          <div>
            <h2 className="text-3xl font-bold">Our Location</h2>
            <p className="text-muted-foreground mt-2">
              Visit our boarding house or contact us for inquiries.
            </p>
          </div>

          {/* INFO CARDS */}
          <div className="space-y-4">

            {/* ADDRESS */}
            <div className="flex items-start gap-3 bg-white/60 backdrop-blur rounded-xl p-4 border shadow-sm">
              <MapPin className="text-blue-500 mt-1" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  Ermings Boarding House, Bateria Poblacion Guihulngan City Negros Oriental Philippines
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-3 bg-white/60 backdrop-blur rounded-xl p-4 border shadow-sm">
              <Phone className="text-green-500 mt-1" />
              <div>
                <p className="font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">
                  +63 900 123 4567
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-3 bg-white/60 backdrop-blur rounded-xl p-4 border shadow-sm">
              <Mail className="text-purple-500 mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  support@eboarding.com
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 🔷 MAP */}
        <div className="w-full h-100 rounded overflow-hidden border shadow-lg">
          <iframe
             src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d245.47902420680265!2d123.2751554!3d10.1265331!3m2!1i1024!2i768!4f13.1!2m1!1sbateria%20poblacion%20guihulngan%20city%20negros%20oriental!5e0!3m2!1sen!2sph!4v1776516184451!5m2!1sen!2sph"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
};

export default LocationSection;