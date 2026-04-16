"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Menu, X, ChevronDown } from "lucide-react";

function getRoleFromStorage() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("user_role") || "";
}

export default function NavbarCustom() {
  const [userRole, setUserRole] = useState(""); // ← fix: always "" on first render
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layananDesktopOpen, setLayananDesktopOpen] = useState(false);
  const [layananMobileOpen, setLayananMobileOpen] = useState(false);

  const layananRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const isUser = userRole === "user";

  // ── Hydration-safe: read localStorage only after mount ──
  useEffect(() => {
    setUserRole(getRoleFromStorage());
  }, []);

  // ── Sync role dari server ──
  useEffect(() => {
    const syncRole = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUserRole("");
        localStorage.removeItem("user_role");
        return;
      }
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );
        if (data.success) {
          const role = data.data.role;
          localStorage.setItem("user_role", role);
          setUserRole(role);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        setUserRole("");
      }
    };
    syncRole();
  }, [pathname]);

  // ── Custom event authChange ──
  useEffect(() => {
    const onAuthChange = () => setUserRole(getRoleFromStorage());
    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  // ── Scroll detection ──
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close DESKTOP dropdown on outside click ──
  useEffect(() => {
    const onClickOutside = (e) => {
      if (layananRef.current && !layananRef.current.contains(e.target))
        setLayananDesktopOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Reset semua dropdown & mobile menu saat ganti halaman ──
  useEffect(() => {
    setMobileMenuOpen(false);
    setLayananDesktopOpen(false);
    setLayananMobileOpen(false);
  }, [pathname]);

  // ── Logout ──
  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      setUserRole("");
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
        withCredentials: true,
      });
      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } catch {
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  if (pathname.startsWith("/panel")) return null;

  const mutedLinkCls =
    "text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-red-700 text-zinc-400";
  const activeLinkCls =
    "text-[10px] font-semibold tracking-[0.2em] uppercase transition-all hover:text-red-700 text-zinc-900 border-b border-red-700 pb-1";

  const layananItems = [
    { label: "Analisis", href: "/analisis" },
    { label: "Pelatihan", href: "/pelatihan" },
    { label: "Sertifikasi", href: "/sertifikasi" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl py-4 border-b border-gray-100 shadow-sm"
            : "bg-white py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-3">
            <img src="/UPI.png" alt="UPI Logo" className="w-28 md:w-36" />
          </a>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-10">
            <a href="/" className={mutedLinkCls}>Home</a>

            {/* Layanan Dropdown — Desktop */}
            <div ref={layananRef} className="relative">
              <button
                onClick={() => setLayananDesktopOpen((v) => !v)}
                className={`${mutedLinkCls} flex items-center gap-1 cursor-pointer`}
              >
                Layanan
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${
                    layananDesktopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {layananDesktopOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-zinc-900/10 overflow-hidden">
                  {layananItems.map((item) => (
                    
                    <a  key={item.href}
                      href={item.href}
                      onClick={() => setLayananDesktopOpen(false)}
                      className="block px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-red-700 hover:bg-red-50/50 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/about" className={mutedLinkCls}>Tentang Kami</a>
            <a href="/contact" className={mutedLinkCls}>Kontak</a>

            {isUser ? (
              <>
                <a href="/my_order" className={mutedLinkCls}>Order Saya</a>
                <a href="/history_order" className={mutedLinkCls}>Riwayat</a>
                <a href="/profil" className={mutedLinkCls}>Profil</a>
                <button onClick={handleLogout} className={`${mutedLinkCls} cursor-pointer`}>
                  Logout
                </button>
              </>
            ) : (
              <a href={`/login?prevRoute=${pathname}`} className={activeLinkCls}>
                Login
              </a>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden text-zinc-900 p-1"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-6 flex flex-col gap-5">
            <a href="/" className={mutedLinkCls}>Home</a>

            {/* Layanan Accordion — Mobile */}
            <div>
              <button
                onClick={() => setLayananMobileOpen((v) => !v)}
                className={`${mutedLinkCls} flex items-center gap-2 w-full`}
              >
                Layanan
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${
                    layananMobileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  layananMobileOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 flex flex-col gap-3 border-l-2 border-red-100 pl-4">
                  {layananItems.map((item) => (
                    
                     <a key={item.href}
                      href={item.href}
                      onClick={() => {
                        setLayananMobileOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className={mutedLinkCls}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a href="/about" onClick={() => setMobileMenuOpen(false)} className={mutedLinkCls}>
              Tentang Kami
            </a>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className={mutedLinkCls}>
              Kontak
            </a>

            {isUser ? (
              <>
                <a href="/my_order" onClick={() => setMobileMenuOpen(false)} className={mutedLinkCls}>
                  Order Saya
                </a>
                <a href="/history_order" onClick={() => setMobileMenuOpen(false)} className={mutedLinkCls}>
                  Riwayat
                </a>
                <a href="/profil" onClick={() => setMobileMenuOpen(false)} className={mutedLinkCls}>
                  Profil
                </a>
                <button onClick={handleLogout} className={`${mutedLinkCls} text-left`}>
                  Logout
                </button>
              </>
            ) : (
              
               <a href={`/login?prevRoute=${pathname}`}
                onClick={() => setMobileMenuOpen(false)}
                className={activeLinkCls}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}