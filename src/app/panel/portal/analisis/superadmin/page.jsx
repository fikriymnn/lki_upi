"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import OrderList from "./Order";
import OrderDetail from "./OrderDetail";

export default function MainPage() {
    const [activePage, setActivePage] = useState("order");
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [noInvoice, setNoInvoice] = useState("");
    const [idInvoice, setIdInvoice] = useState("");

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            {/* ── Header ── */}
            <header className="fixed z-40 w-full bg-[#b91c1c] border-b border-red-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-2xl">LAYANAN ANALISIS</p>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                                <div className="w-9 h-9 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold border border-red-600">
                                    S
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-100">Super Admin</p>
                                    <p className="text-xs text-red-200">Arsip & History</p>
                                </div>
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="focus:outline-none"
                                >
                                    <ChevronRight
                                        className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? "rotate-90" : "rotate-0"
                                            }`}
                                    />
                                </button>
                            </div>

                            {showUserDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                        <button
                                            onClick={() => setShowUserDropdown(false)}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition"
                                        >
                                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-semibold text-red-600">S</span>
                                            </div>
                                            <span>Profil Saya</span>
                                        </button>
                                        <div className="border-t border-gray-100 my-1" />
                                        <button
                                            onClick={() => {
                                                setShowUserDropdown(false);
                                                if (confirm("Yakin ingin keluar?"))
                                                    window.location.href = "/login";
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>Keluar</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto mt-16">
                {activePage === "order" && (
                    <OrderList
                        setActivePage={setActivePage}
                        setNoInvoice={setNoInvoice}
                        setIdInvoice={setIdInvoice}
                    />
                )}
                {activePage === "order-detail" && (
                    <OrderDetail
                        setActivePage={setActivePage}
                        noInvoice={noInvoice}
                        idInvoice={idInvoice}
                    />
                )}
            </main>
        </div>
    );
}