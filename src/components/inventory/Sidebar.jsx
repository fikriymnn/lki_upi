"use client"
import React, { useState } from 'react';
import {
  Package, Users, FileText, LogOut, Menu, X, Box,
  ChevronDown, ChevronRight, FlaskRound, Microscope,
  ClipboardList, Layers, Database, Home,
  Wrench, Package2, PackageCheck, PackageMinus, PackagePlus,
  ShoppingCart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage }) => {

  const [inventarisDropdownOpen, setInventarisDropdownOpen] = useState(false);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [transaksiDropdownOpen, setTransaksiDropdownOpen] = useState(false);
  const [aktivitasDropdownOpen, setAktivitasDropdownOpen] = useState(false);

  const router = useRouter();

  const menuItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard', type: 'single' },
    {
      icon: ShoppingCart,
      label: 'Transaksi',
      type: 'dropdown',
      submenu: [
        { icon: FlaskRound, label: 'Penggunaan Bahan', page: 'peminjaman-bahan' },
        { icon: Microscope, label: 'Peminjaman Alat', page: 'peminjaman-alat' },
      ]
    },
    {
      icon: ClipboardList,
      label: 'Inventaris',
      type: 'dropdown',
      submenu: [
        { icon: FlaskRound, label: 'Bahan Kimia', page: 'bahan' },
        { icon: Microscope, label: 'Alat Lab', page: 'alat' },
        { icon: Wrench, label: 'Alat Lab Rusak', page: 'alat-rusak' },
      ]
    },
    {
      icon: Layers,
      label: 'Aktivitas',
      type: 'dropdown',
      submenu: [
        { icon: PackagePlus, label: 'Stok Masuk', page: 'stock-in' },
        { icon: PackageMinus, label: 'Stok Keluar', page: 'stock-out' },
        { icon: PackageCheck, label: 'Stok Opname', page: 'stock-opname' },
        { icon: Package2, label: 'Stok Movement', page: 'stock-movement' },
      ]
    },
    {
      icon: Database,
      label: 'Master',
      type: 'dropdown',
      submenu: [
        { icon: Package, label: 'Supplier', page: 'master-supplier' },
        { icon: Users, label: 'Peminjam', page: 'master-peminjam' },
        { icon: Box, label: 'Lokasi Penyimpanan', page: 'master-lokasi' }
      ]
    },
    { icon: FileText, label: 'Laporan', page: 'laporan', type: 'single' },
    { icon: Users, label: 'Pengguna', page: 'pengguna', type: 'single' },
  ];

  const handleItemClick = (item) => {
    if (item.type === 'dropdown') {
      if (item.label === 'Inventaris') {
        setInventarisDropdownOpen(!inventarisDropdownOpen);
      } else if (item.label === 'Transaksi') {
        setTransaksiDropdownOpen(!transaksiDropdownOpen);
      } else if (item.label === 'Master') {
        setMasterDropdownOpen(!masterDropdownOpen);
      } else if (item.label === 'Aktivitas') {
        setAktivitasDropdownOpen(!aktivitasDropdownOpen);
      }
    } else {
      setActivePage(item.page);
    }
  };

  const isActiveDropdown = (label) => {
    if (label === 'Inventaris') return ['bahan', 'alat', 'alat-rusak'].includes(activePage);
    if (label === 'Transaksi') return ['peminjaman-bahan', 'peminjaman-alat'].includes(activePage);
    if (label === 'Aktivitas') return ['stock-in', 'stock-out', 'stock-opname', 'stock-movement'].includes(activePage);
    if (label === 'Master') return ['master-supplier', 'master-peminjam', 'master-lokasi'].includes(activePage);
    return false;
  };

  const getDropdownState = (label) => {
    if (label === 'Inventaris') return inventarisDropdownOpen;
    if (label === 'Master') return masterDropdownOpen;
    if (label === 'Transaksi') return transaksiDropdownOpen;
    if (label === 'Aktivitas') return aktivitasDropdownOpen;
    return false;
  };

  return (
    <aside
      className={`bg-[#b91c1c] border-r border-red-700 transition-all duration-300 flex flex-col h-full overflow-hidden ${sidebarOpen ? 'w-64' : 'w-20'
        }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-red-700 shrink-0">
        {sidebarOpen && (
          <img src='/icon/upi-white.png' className='w-36 object-contain' />
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-red-700 rounded-lg transition text-white ml-auto"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.type === 'single' ? (
              <button
                onClick={() => setActivePage(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${activePage === item.page
                  ? 'bg-white text-red-600'
                  : 'text-white hover:bg-white hover:text-red-600'
                  }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            ) : (
              <div>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActiveDropdown(item.label)
                    ? 'bg-white text-red-600'
                    : 'text-white hover:bg-white hover:text-red-600'
                    }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left truncate">
                        {item.label}
                      </span>
                      {getDropdownState(item.label)
                        ? <ChevronDown className="w-4 h-4 shrink-0" />
                        : <ChevronRight className="w-4 h-4 shrink-0" />
                      }
                    </>
                  )}
                </button>

                {/* Submenu */}
                {sidebarOpen && getDropdownState(item.label) && (
                  <div className="mt-1 ml-3 space-y-1">
                    {item.submenu.map((subitem, subindex) => (
                      <button
                        key={subindex}
                        onClick={() => setActivePage(subitem.page)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${activePage === subitem.page
                          ? 'bg-white text-red-600'
                          : 'text-white hover:bg-white hover:text-red-600'
                          }`}
                      >
                        <subitem.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate text-left">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Kembali */}
      <div className="p-3 border-t border-red-700 shrink-0">
        <button
          onClick={() => router.push("/panel/portal")}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white hover:text-red-600 rounded-lg transition"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && (
            <span className="text-sm font-medium truncate">Kembali</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;