"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut, Bell } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../../../../components/affiliate/SidebarAffiliateAdmin'; // ← sesuaikan path ke Sidebar yg kamu kasih
import AffiliateList from './AffiliateList';
import AffiliateDetail from './AffiliateDetail';

const ROLE_LABEL = {
  ketua_lab: 'Ketua Lab',
  laboran: 'Laboran',
  admin: 'Admin',
};

export default function AffiliateAdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('/panel/portal/affiliate/admin');
  const [page, setPage] = useState('list'); // list | detail
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [newOrders, setNewOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(()=>{
    console.log("hai")
  },[])

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

  // ── Fetch new orders for admin ──────────────────────────────────────
  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Cek role user terlebih dahulu
        if (userData?.role !== 'admin' && userData?.role !== 'superadmin') return;

        setLoadingOrders(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/order_affiliate`, {
          params: {
            status: 'Menunggu Order Dikonfirmasi',
            limit: 10,
            page: 1
          },
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data.length > 0) {
          setNewOrders(res.data.data);
          setHasNewOrder(true);
        }
      } catch (err) {
        console.error('Gagal mengambil data order baru:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userData?.role === 'admin' || userData?.role === 'superadmin') {
      fetchNewOrders();
      
      // Polling setiap 30 detik untuk cek order baru
      const interval = setInterval(fetchNewOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [userData?.role]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/panel');
  };

  const getInitial = (nama) => {
    if (!nama) return 'A';
    return nama.charAt(0).toUpperCase();
  };

  const formatRole = (role) => ROLE_LABEL[role] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Affiliate');

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    if (!showNotification) {
      setHasNewOrder(false);
    }
  };

  const handleOrderClick = (order) => {
    // Navigasi ke detail order atau halaman order
    setShowNotification(false);
    // Implementasikan navigasi ke detail order di sini
    console.log('Order clicked:', order);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white font-bold md:text-2xl text-sm">LAB AFFILIATE</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              {(userData?.role === 'admin' || userData?.role === 'superadmin') && (
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 rounded-lg hover:bg-red-700 transition focus:outline-none"
                  >
                    <Bell className="w-5 h-5 text-white" />
                    {hasNewOrder && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#b91c1c]"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotification && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotification(false)} />
                      <div className="absolute right-0 mt-2 w-96 max-h-[500px] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Order Baru</h3>
                            <span className="text-xs text-gray-500">{newOrders.length} order</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Order menunggu konfirmasi</p>
                        </div>
                        
                        {loadingOrders ? (
                          <div className="p-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse mb-3">
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                              </div>
                            ))}
                          </div>
                        ) : newOrders.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {newOrders.map((order) => (
                              <button
                                key={order._id}
                                onClick={() => handleOrderClick(order)}
                                className="w-full p-4 text-left hover:bg-gray-50 transition"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{order.nama_lengkap}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{order.no_invoice}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {order.id_affiliate?.nama_laboratorium || 'Lab Affiliate'}
                                    </p>
                                  </div>
                                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {formatDate(order.date)}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium">
                                    Menunggu Order Dikonfirmasi
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">Tidak ada order baru</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* User Profile */}
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
          {page === 'list' && (
            <AffiliateList
              setActivePage={setPage}
              setSelectedAffiliate={setSelectedAffiliate}
            />
          )}
          {page === 'detail' && selectedAffiliate && (
            <AffiliateDetail
              affiliate={selectedAffiliate}
              setActivePage={setPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}