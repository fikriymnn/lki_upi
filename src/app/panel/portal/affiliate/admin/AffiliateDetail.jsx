"use client";
import { useState } from 'react';
import {
  ChevronLeft, Building2, MessageCircle, Mail, MapPin,
  Info, ShoppingBag, Wrench, ClipboardList, Users,
  Settings
} from 'lucide-react';
import AffiliateCatalog from './AffiliateCatalog';
import AffiliateOrder from './AffiliateOrder';
import AffiliateUser from './AffiliateUserManagement';
import AffiliateLayananAnalisis from './AffiliateLayananAnalisis';

export default function AffiliateDetail({ affiliate, setActivePage }) {
  const [activeTab, setActiveTab] = useState('info'); // info | katalog | layanan | order | user

  const tabs = [
    { key: 'info', label: 'Informasi', icon: <Info className="w-4 h-4" /> },
    { key: 'katalog', label: 'Katalog', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'order', label: 'Order', icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'layanan_analisis', label: 'Layanan Analisis', icon: <Settings className="w-4 h-4" /> },
    { key: 'user', label: 'User Management', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setActivePage('list')}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Lab Affiliate</h1>
          <p className="text-sm text-gray-500">Informasi mitra, katalog produk, layanan, order, dan user</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Nama Laboratorium</p>
          <p className="text-base font-semibold text-gray-900 mt-1">{affiliate.nama_laboratorium}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">No. WhatsApp</p>
          <p className="text-base font-semibold text-gray-900 mt-1">{affiliate.no_whatsapp}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">Email</p>
          <p className="text-base font-semibold text-gray-900 mt-1">{affiliate.email}</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition ${activeTab === t.key ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Informasi */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" /> Informasi Tambahan
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Alamat</p>
              <p className="text-sm font-medium mt-0.5">{affiliate.alamat || 'Belum diisi'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Status Mitra</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${affiliate.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {affiliate.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
      )}

  
      {activeTab === 'katalog' && <AffiliateCatalog affiliateId={affiliate._id} />}


      {activeTab === 'order' && <AffiliateOrder affiliateId={affiliate._id} />}


      {activeTab === 'layanan_analisis' && <AffiliateLayananAnalisis affiliateId={affiliate._id} />}


      {activeTab === 'user' && <AffiliateUser affiliateId={affiliate._id} />}
    </div>
  );
}