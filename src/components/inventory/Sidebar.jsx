import React, { useState } from 'react';
import {
  Package, Users, FileText, LogOut, Menu, X, BarChart3, Box, Beaker, History, ChevronDown, ChevronRight, FlaskRound, Microscope, ShoppingCart, Archive, MapPin, UserPlus,
  ClipboardList, TestTube, ShoppingBag, Calendar, Layers, Database,
  Home, Settings, Bell, HelpCircle, Download, Upload, Printer,
  Wrench,
  Package2,
  Move3dIcon,
  PackageCheck
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage, onLogout }) => {
  const [inventarisDropdownOpen, setInventarisDropdownOpen] = useState(false);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [peminjamanDropdownOpen, setPeminjamanDropdownOpen] = useState(false);
  const [riwayatDropdownOpen, setRiwayatDropdownOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard', type: 'single' },
    {
      icon: ClipboardList,
      label: 'Transaksi',
      type: 'dropdown',
      submenu: [
        { icon: FlaskRound, label: 'Penggunaan Bahan', page: 'peminjaman-bahan' },
        { icon: Microscope, label: 'Peminjaman Alat', page: 'peminjaman-alat' },
        { icon: Wrench, label: 'Alat Lab Rusak', page: 'alat-rusak' },
        // { icon: Users, label: 'Praktikum', page: 'praktikum' },
      ]
    },
    {
      icon: Layers,
      label: 'Inventaris',
      type: 'dropdown',
      submenu: [
        { icon: FlaskRound, label: 'Bahan Kimia', page: 'bahan' },
        { icon: Microscope, label: 'Alat Lab', page: 'alat' },
        { icon: Package2, label: 'Pergerakan Stock', page: 'pergerakan-stock' },
        { icon: PackageCheck, label: 'Stock Opname', page: 'stock-opname' },
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
      } else if (item.label === 'Master') {
        setMasterDropdownOpen(!masterDropdownOpen);
      } else if (item.label === 'Transaksi') {
        setPeminjamanDropdownOpen(!peminjamanDropdownOpen);
      } else if (item.label === 'Riwayat') {
        setRiwayatDropdownOpen(!riwayatDropdownOpen);
      }
    } else {
      setActivePage(item.page);
    }
  };

  const isActiveDropdown = (label) => {
    if (label === 'Inventaris') {
      return activePage === 'alat' || activePage === 'bahan' ;
    } else if (label === 'Master') {
      return activePage === 'master-supplier' || activePage === 'master-peminjam' || activePage === 'master-lokasi';
    } else if (label === 'Transaksi') {
      return activePage === 'peminjaman-bahan' || activePage === 'peminjaman-alat' || activePage === 'praktikum'|| activePage === 'alat-rusak';
    } else if (label === 'Riwayat') {
      return activePage === 'riwayat-bahan' || activePage === 'riwayat-alat' || activePage === 'riwayat-pembelian-bahan' || activePage === 'riwayat-pembelian-alat' || activePage === 'riwayat-praktikum';
    }
    return false;
  };

  const getDropdownState = (label) => {
    if (label === 'Inventaris') return inventarisDropdownOpen;
    if (label === 'Master') return masterDropdownOpen;
    if (label === 'Transaksi') return peminjamanDropdownOpen;
    if (label === 'Riwayat') return riwayatDropdownOpen;
    return false;
  };

  return (
    <aside className={`bg-red-600 border-r border-red-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-red-700">
          {sidebarOpen && (
            <div className="items-center space-x-3">

                <img src='/icon/upi-white.png' className='w-44 object-center'/>
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
            <div key={index}>
              {item.type === 'single' ? (
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activePage === item.page
                    ? 'bg-white text-red-600'
                    : 'text-white hover:bg-white hover:text-red-600'
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${isActiveDropdown(item.label)
                      ? 'bg-white text-red-600'
                      : 'text-white hover:bg-white hover:text-red-600'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      getDropdownState(item.label) ?
                        <ChevronDown className="w-4 h-4 flex-shrink-0" /> :
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>

                  {/* Submenu */}
                  {sidebarOpen && getDropdownState(item.label) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.submenu.map((subitem, subindex) => (
                        <button
                          key={subindex}
                          onClick={() => setActivePage(subitem.page)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition text-sm ${activePage === subitem.page
                            ? 'bg-white text-red-600'
                            : 'text-white hover:bg-white hover:text-red-600'
                            }`}
                        >
                          <subitem.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{subitem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-red-700">
          <button
            onClick={onLogout}
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