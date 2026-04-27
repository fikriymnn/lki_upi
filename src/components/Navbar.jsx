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
  const [userRole, setUserRole] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layananDesktopOpen, setLayananDesktopOpen] = useState(false);
  const [layananMobileOpen, setLayananMobileOpen] = useState(false);

  const layananRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const isUser = userRole === "user";

  // ── INIT AUTH (NO FLICKER) ──
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      const cachedRole = localStorage.getItem("user_role");

      if (cachedRole) setUserRole(cachedRole);

      if (!token) {
        setUserRole("");
        setIsAuthLoaded(true);
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
        } else {
          throw new Error();
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        setUserRole("");
      } finally {
        setIsAuthLoaded(true);
      }
    };

    initAuth();
  }, []);

  // ── Auth Change Listener ──
  useEffect(() => {
    const onAuthChange = () => setUserRole(getRoleFromStorage());
    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  // ── Scroll ──
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Outside click ──
  useEffect(() => {
    const onClickOutside = (e) => {
      if (layananRef.current && !layananRef.current.contains(e.target))
        setLayananDesktopOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Reset menu ──
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

  // ── Active Link Helper ──
  const isActive = (path) => {
    if (path === "/") return pathname === "/"; // 🔥 fix Home
    return pathname.startsWith(path);
  };
  const getLinkClass = (path) =>
    isActive(path) ? activeLinkCls : mutedLinkCls;

  const mutedLinkCls =
    "text-[9px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:text-red-700 text-zinc-400";

  const activeLinkCls =
    "text-[9px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 text-zinc-900 border-b border-red-700 pb-1";

  const layananItems = [
    { label: "Analisis", href: "/analisis" },
    { label: "Pelatihan", href: "/pelatihan" },
    { label: "Sertifikasi", href: "/sertifikasi" },
  ];

  const isLayananActive = layananItems.some((item) =>
    pathname.startsWith(item.href)
  );

  // ── SKELETON NAVBAR (ANTI COLLAPSE) ──
  if (!isAuthLoaded) {
    return (
      <>
        <nav className="fixed w-full z-50 bg-white py-4 border-b border-gray-100">
          <div className="container max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/UPI.png" alt="UPI Logo" className="w-28 md:w-36" />
            </div>

            <div className="hidden md:flex items-center gap-10">
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </nav>
        <div className="h-16" />
      </>
    );
  }

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/80 backdrop-blur-xl py-4 border-b border-gray-100 shadow-sm"
          : "bg-white py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">

          <a href="/" className="flex items-center gap-3">
            <img src="/UPI.png" alt="UPI Logo" className="w-28 md:w-36" />
          </a>

          <div className="hidden md:flex items-center gap-10">
            <a href="/" className={getLinkClass("/")}>Home</a>

            <div ref={layananRef} className="relative">
              <button
                onClick={() => setLayananDesktopOpen((v) => !v)}
                className={`${isLayananActive ? activeLinkCls : mutedLinkCls
                  } flex items-center gap-1 cursor-pointer`}
              >
                Layanan
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${layananDesktopOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {layananDesktopOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                  {layananItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setLayananDesktopOpen(false)}
                      className={`block px-5 py-3 text-[9px] font-semibold tracking-[0.2em] uppercase ${isActive(item.href)
                        ? "text-red-700 bg-red-50"
                        : "text-zinc-400 hover:text-red-700 hover:bg-red-50/50"
                        }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/about" className={getLinkClass("/about")}>Tentang Kami</a>
            <a href="/contact" className={getLinkClass("/contact")}>Kontak</a>

            {isUser ? (
              <>
                <a href="/my_order" className={getLinkClass("/my_order")}>Order Saya</a>
                <a href="/history_order" className={getLinkClass("/history_order")}>Riwayat</a>
                <a href="/profil" className={getLinkClass("/profil")}>Profil</a>
                <button onClick={handleLogout} className={mutedLinkCls}>
                  Logout
                </button>
              </>
            ) : (
              <a href={`/login?prevRoute=${pathname}`} className={getLinkClass("/login")}>
                Login
              </a>
            )}
          </div>

          <button
            className="md:hidden text-zinc-900 p-1"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white px-6 py-6 flex flex-col gap-5">
            <a href="/" className={getLinkClass("/")}>Home</a>

            <div>
              <button
                onClick={() => setLayananMobileOpen((v) => !v)}
                className={`${isLayananActive ? activeLinkCls : mutedLinkCls
                  } flex items-center gap-2 w-full`}
              >
                Layanan
                <ChevronDown
                  size={12}
                  className={`transition-transform ${layananMobileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div className={`${layananMobileOpen ? "mt-3" : ""}`}>
                {layananItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={getLinkClass(item.href)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <a href="/about" className={getLinkClass("/about")}>Tentang Kami</a>
            <a href="/contact" className={getLinkClass("/contact")}>Kontak</a>

            {isUser ? (
              <>
                <a href="/my_order" className={getLinkClass("/my_order")}>Order Saya</a>
                <a href="/history_order" className={getLinkClass("/history_order")}>Riwayat</a>
                <a href="/profil" className={getLinkClass("/profil")}>Profil</a>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <a href={`/login?prevRoute=${pathname}`} className={getLinkClass("/login")}>
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  );
}