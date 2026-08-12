"use client";
import { useState } from 'react';
import Sidebar from '../../../../../../components/affiliate/SidebarAffiliateAdmin'; // TODO: ganti ke Sidebar khusus role Ketua Lab kalau berbeda dari admin
import AffiliateOrder from './AffiliateOrder';
import AffiliateOrderDetail from './AffiliateOrderDetail';
import AffiliateOrderEdit from './AffiliateOrderEdit';
import AffiliateCatalog from './AffiliateCatalog';
import AffiliateService from './AffiliateService';
import { ClipboardList, BookOpen, Wrench } from 'lucide-react';

// ── Tab menu internal Ketua Lab — order, katalog, layanan ──
const MENU = [
  { key: 'order', label: 'Order', icon: ClipboardList },
  { key: 'catalog', label: 'Katalog', icon: BookOpen },
  { key: 'service', label: 'Layanan', icon: Wrench },
];

const HEADER_TITLE = {
  order: 'DAFTAR ORDER',
  orderDetail: 'DETAIL ORDER',
  orderEdit: 'EDIT ORDER',
  catalog: 'KATALOG LAYANAN',
  service: 'LAYANAN LAB',
};

export default function KetuaLabPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('/panel/portal/affiliate/admin/ketua_lab');

  // page: 'order' | 'orderDetail' | 'orderEdit' | 'catalog' | 'service'
  const [page, setPage] = useState('order');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ── Menu tab (order/catalog/service) yang sedang aktif secara visual ──
  const activeMenu = page === 'orderDetail' || page === 'orderEdit' ? 'order' : page;

  const goToMenu = (key) => {
    setPage(key);
    setSelectedOrder(null);
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
        <header className="bg-[#b91c1c] border-b border-red-700 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-white font-bold md:text-2xl text-sm">{HEADER_TITLE[page] || 'LAB AFFILIATE — KETUA LAB'}</p>

          {/* ── Tab menu, disembunyikan saat sedang di detail/edit order ── */}
          {page !== 'orderDetail' && page !== 'orderEdit' && (
            <nav className="flex items-center gap-1 bg-red-800/40 rounded-lg p-1">
              {MENU.map((m) => (
                <button
                  key={m.key}
                  onClick={() => goToMenu(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    activeMenu === m.key ? 'bg-white text-red-700' : 'text-white/80 hover:bg-red-700/60'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              ))}
            </nav>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          {page === 'order' && (
            <AffiliateOrder
              setActivePage={setPage}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {page === 'orderDetail' && selectedOrder && (
            <AffiliateOrderDetail
              order={selectedOrder}
              setActivePage={setPage}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {page === 'orderEdit' && selectedOrder && (
            <AffiliateOrderEdit
              order={selectedOrder}
              setActivePage={setPage}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {page === 'catalog' && (
            <AffiliateCatalog setActivePage={setPage} />
          )}

          {page === 'service' && (
            <AffiliateService setActivePage={setPage} />
          )}
        </main>
      </div>
    </div>
  );
}