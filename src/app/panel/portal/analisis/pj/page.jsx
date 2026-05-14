"use client";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import OrderList from "./Order";
import OrderDetail from "./OrderDetail";
import OrderTracking from "./OrderTracking";
import axios from "axios";

export default function MainPage() {
  const [activePage, setActivePage]             = useState('order');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [noInvoice, setNoInvoice]               = useState('');
  const [idInvoice, setIdInvoice]               = useState('');
  const [userData, setUserData]                 = useState(null);

  // ── Persist filter & data OrderList ─────────────────────
  const [orderState, setOrderState] = useState({
    invoice: [],
    page: 0,
    length: 0,
    year: "",
    month: "",
    jenis_pengujian: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setUserData(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return;
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, { withCredentials: true });
      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      window.location.href = '/panel';
    }
  };

  const getInitial = (nama) => nama ? nama.charAt(0).toUpperCase() : 'A';
  const formatRole = (role) => role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Penanggung Jawab';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="fixed z-40 w-full bg-[#b91c1c] border-b border-red-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-white font-bold md:text-xl text-sm">LAYANAN ANALISIS</p>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                <div className="w-9 h-9 bg-red-800 rounded-lg flex items-center justify-center text-white font-bold border border-red-600">
                  {getInitial(userData?.nama_lengkap)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-100">{userData?.nama_lengkap ?? 'Memuat...'}</p>
                  <p className="text-xs text-red-200">{formatRole(userData?.role)}</p>
                </div>
                <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="focus:outline-none">
                  <ChevronRight className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? 'rotate-90' : 'rotate-0'}`} />
                </button>
              </div>

              {showUserDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => { setShowUserDropdown(false); handleLogout(); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

      <main className="flex-1 overflow-y-auto mt-16">
        {activePage === 'order' && (
          <OrderList
            setActivePage={setActivePage}
            setNoInvoice={setNoInvoice}
            setIdInvoice={setIdInvoice}
            orderState={orderState}
            setOrderState={setOrderState}
          />
        )}
        {activePage === 'order-detail' && (
          <OrderDetail
            setActivePage={setActivePage}
            noInvoice={noInvoice}
            idInvoice={idInvoice}
          />
        )}
        {activePage === 'order-tracking' && (
          <OrderTracking
            setActivePage={setActivePage}
            idInvoice={idInvoice}
          />
        )}
      </main>
    </div>
  );
}