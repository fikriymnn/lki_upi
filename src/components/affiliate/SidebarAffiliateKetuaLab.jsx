"use client"
import React, { useState } from 'react';
import {
  LogOut, Menu, X, Users,
  ClipboardList,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage, onLogout }) => {
  const router = useRouter()

  const menuItems = [
    { icon: Users, label: 'Lab Affiliate', path: '/panel/portal/affiliate/ketualab' },
    { icon: ClipboardList, label: 'Lab Affiliate', path: '/panel/portal/affiliate/ketualab/catalog' },
    { icon: Settings, label: 'Lab Affiliate', path: '/panel/portal/affiliate/ketualab/layanan_analisis' },
  ];

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
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activePage === item.path
                ? 'bg-white text-red-600'
                : 'text-white hover:bg-white hover:text-red-600'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Kembali */}
        <div className="p-4 border-t border-red-700">
          <button
            onClick={() => router.push("/panel/portal")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white hover:text-red-600 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Kembali</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;