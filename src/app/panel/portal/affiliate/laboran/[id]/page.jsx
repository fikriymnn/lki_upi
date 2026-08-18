"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, LogOut } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../../../../../components/affiliate/SidebarAffiliateLaboran';
import AffiliateOrder from './AffiliateOrder';
import AffiliateCatalog from './AffiliateCatalog';
import AffiliateLayananAnalisis from './AffiliateLayananAnalisis';

const HEADER_TITLE = {
  order: 'LAB AFFILIATE',
  catalog: 'LAB AFFILIATE',
  layanan_analisis: 'LAB AFFILIATE',
};

const ROLE_LABEL = {
  ketua_lab: 'Ketua Lab',
  laboran: 'Laboran',
};

export default function LaboranPage() {
  // id di URL = id_affiliate (ref ke model LabAffiliate)
  const { id: idAffiliate } = useParams();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // page: 'order' | 'catalog' | 'layanan_analisis' — navigasi tab sekarang dikontrol dari Sidebar
  const [page, setPage] = useState('order');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [userData, setUserData] = useState(null);
  const [labName, setLabName] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // ── Fetch user data ──────────────────────────────────────────────────
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

  // ── Fetch nama lab affiliate ─────────────────────────────────────────
  useEffect(() => {
    if (!idAffiliate) return;
    axios.get(`${process.env.NEXT_PUBLIC_URL}/api/lab_affiliate/${idAffiliate}`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) setLabName(res.data.data.nama_laboratorium);
      })
      .catch(() => {});
  }, [idAffiliate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/panel');
  };

  const getInitial = (nama) => {
    if (!nama) return 'A';
    return nama.charAt(0).toUpperCase();
  };

  const formatRole = (role) => ROLE_LABEL[role] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Affiliate');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        page={page}
        setPage={setPage}
        setSelectedOrder={setSelectedOrder}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white font-bold md:text-2xl text-sm">{HEADER_TITLE[page] || 'LAB AFFILIATE — LABORAN'}</p>
              {labName && <p className="text-red-200 text-xs mt-0.5">{labName}</p>}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-3 pl-4 border-l border-red-400">
                  {/* Avatar */}
                  <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold border border-red-400">
                    {getInitial(userData?.nama_lengkap)}
                  </div>

                  {/* Nama & Role */}
                  <div>
                    <p className="text-sm font-bold text-gray-100">
                      {userData?.nama_lengkap ?? 'Memuat...'}
                    </p>
                    <p className="text-xs text-red-200">
                      {formatRole(userData?.role)}
                    </p>
                  </div>

                  {/* Chevron Toggle */}
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="focus:outline-none"
                  >
                    <ChevronRight
                      className={`w-4 h-4 text-red-200 transition-transform duration-200 ${showUserDropdown ? 'rotate-90' : 'rotate-0'}`}
                    />
                  </button>
                </div>

                {showUserDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {page === 'order' && (
            <AffiliateOrder
              affiliateId={idAffiliate}
              setActivePage={setPage}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {page === 'catalog' && (
            <AffiliateCatalog affiliateId={idAffiliate} setActivePage={setPage} />
          )}

          {page === 'layanan_analisis' && (
            <AffiliateLayananAnalisis idAffiliate={idAffiliate} setActivePage={setPage} />
          )}
        </main>
      </div>
    </div>
  );
}