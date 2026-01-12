import React, { useState } from 'react';
import { Package, Users, FileText, LogOut, Menu, X, BarChart3, Box, Beaker, History, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage, onLogout }) => {
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', page: 'dashboard', type: 'single' },
    { icon: Package, label: 'Peminjaman', page: 'peminjaman', type: 'single' },
    { icon: History, label: 'Riwayat', page: 'riwayat', type: 'single' },
    { 
      icon: Box, 
      label: 'Item', 
      type: 'dropdown',
      submenu: [
        { icon: Box, label: 'Alat Lab', page: 'alat' },
        { icon: Beaker, label: 'Bahan Kimia', page: 'bahan' },
      ]
    },
    { 
      icon: Users, 
      label: 'Master', 
      type: 'dropdown',
      submenu: [
        { icon: Package, label: 'Supplier', page: 'master-supplier' },
        { icon: Users, label: 'Peminjam', page: 'master-peminjam' },
        { icon: Box, label: 'Lokasi Penyimpanan', page: 'master-lokasi' },
      ]
    },
    { icon: FileText, label: 'Laporan', page: 'laporan', type: 'single' },
    { icon: Users, label: 'Pengguna', page: 'pengguna', type: 'single' },
  ];

  const handleItemClick = (item) => {
    if (item.type === 'dropdown') {
      if (item.label === 'Item') {
        setItemDropdownOpen(!itemDropdownOpen);
      } else if (item.label === 'Master') {
        setMasterDropdownOpen(!masterDropdownOpen);
      }
    } else {
      setActivePage(item.page);
    }
  };

  const isActiveDropdown = (label) => {
    if (label === 'Item') {
      return activePage === 'alat' || activePage === 'bahan';
    } else if (label === 'Master') {
      return activePage === 'master-supplier' || activePage === 'master-peminjam' || activePage === 'master-lokasi';
    }
    return false;
  };

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <img src='/logo-upi.png' className='w-10' alt="Logo UPI"/>
              <div>
                <h2 className="font-bold text-red-600">LKI UPI</h2>
                <p className="text-xs text-gray-800">Inventory System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activePage === item.page
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isActiveDropdown(item.label)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      (item.label === 'Item' ? itemDropdownOpen : masterDropdownOpen) ? 
                        <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {sidebarOpen && (item.label === 'Item' ? itemDropdownOpen : masterDropdownOpen) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.submenu.map((subitem, subindex) => (
                        <button
                          key={subindex}
                          onClick={() => setActivePage(subitem.page)}
                          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition text-sm ${
                            activePage === subitem.page
                              ? 'bg-red-100 text-red-600'
                              : 'text-gray-600 hover:bg-gray-50'
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;