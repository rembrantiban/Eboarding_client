"use client";

import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-12">

                <div className="grid gap-10 md:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            E-BOARDING
                        </h2>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                            A modern boarding house management platform for
                            managing rooms, tenants, payments, announcements,
                            and reservations in one centralized system.
                        </p>

                        <div className="mt-6 flex gap-3">

                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
                            >
                            </a>

                            <a
                                href="mailto:support@eboarding.com"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
                            >
                                <Mail size={18} />
                            </a>

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col gap-3 text-sm">

                            <Link
                                to="/"
                                className="text-slate-500 transition hover:text-orange-600"
                            >
                                Home
                            </Link>

                            <Link
                                to="/rooms"
                                className="text-slate-500 transition hover:text-orange-600"
                            >
                                Rooms
                            </Link>

                            <Link
                                to="/about"
                                className="text-slate-500 transition hover:text-orange-600"
                            >
                                About
                            </Link>

                            <Link
                                to="/contact"
                                className="text-slate-500 transition hover:text-orange-600"
                            >
                                Contact
                            </Link>

                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                            Contact
                        </h3>

                        <div className="mt-4 space-y-4 text-sm text-slate-500">

                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-4 w-4 text-orange-600" />
                                support@eboarding.com
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-4 w-4 text-orange-600" />
                                +63 912 345 6789
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-orange-600" />
                                Dumaguete City, Philippines
                            </div>

                        </div>
                    </div>

                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row">

                    <p>
                        © {new Date().getFullYear()}{" "}
                        <span className="font-semibold text-slate-700">
                            E-BOARDING
                        </span>
                        . All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/privacy"
                            className="transition hover:text-orange-600"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            to="/terms"
                            className="transition hover:text-orange-600"
                        >
                            Terms of Service
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}