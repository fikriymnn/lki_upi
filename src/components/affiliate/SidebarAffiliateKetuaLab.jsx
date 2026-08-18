"use client"
import React from 'react';
import {
  LogOut, Menu, X, ClipboardList, BookOpen, FlaskConical,
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, page, setPage, setSelectedOrder, onLogout }) => {

  // ── Navigasi internal (order/catalog/layanan_analisis) — bukan route Next.js, cuma ganti tab ──
  const menuItems = [
    { key: 'order', icon: ClipboardList, label: 'Order' },
    { key: 'catalog', icon: BookOpen, label: 'Katalog' },
    { key: 'layanan_analisis', icon: FlaskConical, label: 'Layanan Analisis' },
  ];

  const goToMenu = (key) => {
    setPage(key);
    setSelectedOrder?.(null);
  };

  return (
    <aside className={`bg-[#b91c1c] border-r border-red-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-red-700">
          {sidebarOpen && (
            <div className="items-center space-x-3">
              <img src='/icon/upi-white.png' className='w-40 object-center mx-auto' />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-red-700 rounded-lg transition text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuItems.map((item) => {
            const isActive = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => goToMenu(item.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                  ? 'bg-white text-red-600'
                  : 'text-white hover:bg-white hover:text-red-600'
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;