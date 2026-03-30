"use client"
import React, { useState } from 'react';
import {
  Package, Users, FileText, LogOut, Menu, X, BarChart3, Box, Beaker, History, ChevronDown, ChevronRight, FlaskRound, Microscope, ShoppingCart, Archive, MapPin, UserPlus,
  ClipboardList, TestTube, ShoppingBag, Calendar, Layers, Database,
  Home, Settings, Bell, HelpCircle, Download, Upload, Printer,
  Wrench,
  Package2,
  Move3dIcon,
  PackageCheck,
  PackagePlusIcon,
  PackageMinus,
  PackagePlus,
  Notebook,
  Text,
  ChartAreaIcon,
  FileTextIcon,
  MenuIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage, onLogout }) => {
  const router = useRouter()

  const menuItems = [
    { icon: MenuIcon, label: 'Dashboard', page: 'dashboard', type: 'single' },
    { icon: ShoppingCart, label: 'Order', page: 'order', type: 'single' },
    { icon: FileTextIcon, label: 'Konten', page: 'content', type: 'single' },
    { icon: ChartAreaIcon, label: 'Laporan', page: 'report', type: 'single' },
  ];


  const onBack = ()=>{
    router.push("/panel/portal")
  }

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

        {/* Kembali */}
        <div className="p-4 border-t border-red-700">
          <button
            onClick={()=> router.push("/panel/portal")}
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