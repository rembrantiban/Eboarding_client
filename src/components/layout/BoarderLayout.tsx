"use client";

import { Outlet } from "react-router-dom";
import Sidebar from "./BoarderSidebar";
import Header from "./BoarderHeader";
import Footer from "./Footer";

export default function BoarderLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-8 px-6 py-8">
                {/* Sidebar */}
                <Sidebar />

                {/* Content */}
                <main className="flex-1">
                    <div className="mx-auto w-full max-w-5xl">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}