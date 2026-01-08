import React, { useState } from 'react';
import { Save, Bell, Lock, User, Building, Database, AlertCircle, Check } from 'lucide-react';

const PengaturanPage = () => {
  const [activeTab, setActiveTab] = useState('umum');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Umum
    labName: 'Laboratorium Kimia UPI',
    labAddress: 'Jl. Dr. Setiabudhi No. 229, Bandung',
    labPhone: '022-2013163',
    labEmail: 'labkimia@upi.edu',
    
    // Peminjaman
    maxPinjamDays: 7,
    maxPinjamItems: 5,
    autoReminder: true,
    reminderDays: 1,
    
    // Sanksi
    dendaPerHari: 5000,
    maxKeterlambatan: 14,
    autoBlock: true,
    maxPelanggaran: 3,
    
    // Notifikasi
    emailNotif: true,
    whatsappNotif: false,
    notifStokMenipis: true,
    notifKeterlambatan: true,
    notifPeminjaman: true,
    
    // Backup
    autoBackup: true,
    backupSchedule: 'daily',
    lastBackup: '2024-01-07 08:00:00'
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'umum', label: 'Umum', icon: Building },
    { id: 'peminjaman', label: 'Peminjaman', icon: User },
    { id: 'sanksi', label: 'Sanksi', icon: AlertCircle },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { id: 'keamanan', label: 'Keamanan', icon: Lock },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h1>
          <p className="text-gray-600">Konfigurasi sistem inventory laboratorium</p>
        </div>

        {/* Save Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Umum Tab */}
              {activeTab === 'umum' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Laboratorium</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Laboratorium
                        </label>
                        <input
                          type="text"
                          value={settings.labName}
                          onChange={(e) => handleChange('labName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat
                        </label>
                        <textarea
                          value={settings.labAddress}
                          onChange={(e) => handleChange('labAddress', e.target.value)}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telepon
                          </label>
                          <input
                            type="tel"
                            value={settings.labPhone}
                            onChange={(e) => handleChange('labPhone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={settings.labEmail}
                            onChange={(e) => handleChange('labEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Peminjaman Tab */}
              {activeTab === 'peminjaman' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Aturan Peminjaman</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksimal Durasi Peminjaman (hari)
                          </label>
                          <input
                            type="number"
                            value={settings.maxPinjamDays}
                            onChange={(e) => handleChange('maxPinjamDays', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksimal Item per Peminjaman
                          </label>
                          <input
                            type="number"
                            value={settings.maxPinjamItems}
                            onChange={(e) => handleChange('maxPinjamItems', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Pengingat Otomatis</div>
                          <div className="text-sm text-gray-600">Kirim reminder sebelum jatuh tempo</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoReminder}
                            onChange={(e) => handleChange('autoReminder', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      {settings.autoReminder && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kirim Reminder (hari sebelum jatuh tempo)
                          </label>
                          <input
                            type="number"
                            value={settings.reminderDays}
                            onChange={(e) => handleChange('reminderDays', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sanksi Tab */}
              {activeTab === 'sanksi' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Aturan Sanksi</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Denda per Hari (Rp)
                          </label>
                          <input
                            type="number"
                            value={settings.dendaPerHari}
                            onChange={(e) => handleChange('dendaPerHari', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksimal Keterlambatan (hari)
                          </label>
                          <input
                            type="number"
                            value={settings.maxKeterlambatan}
                            onChange={(e) => handleChange('maxKeterlambatan', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Blokir Otomatis</div>
                          <div className="text-sm text-gray-600">Blokir user yang melanggar batas pelanggaran</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoBlock}
                            onChange={(e) => handleChange('autoBlock', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      {settings.autoBlock && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maksimal Pelanggaran
                          </label>
                          <input
                            type="number"
                            value={settings.maxPelanggaran}
                            onChange={(e) => handleChange('maxPelanggaran', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifikasi Tab */}
              {activeTab === 'notifikasi' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Notifikasi</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Notifikasi Email</div>
                          <div className="text-sm text-gray-600">Kirim notifikasi via email</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.emailNotif}
                            onChange={(e) => handleChange('emailNotif', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Notifikasi WhatsApp</div>
                          <div className="text-sm text-gray-600">Kirim notifikasi via WhatsApp</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.whatsappNotif}
                            onChange={(e) => handleChange('whatsappNotif', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-3">Jenis Notifikasi</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-900">Stok Menipis</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifStokMenipis}
                                onChange={(e) => handleChange('notifStokMenipis', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-900">Keterlambatan Pengembalian</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifKeterlambatan}
                                onChange={(e) => handleChange('notifKeterlambatan', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-900">Peminjaman Baru</div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifPeminjaman}
                                onChange={(e) => handleChange('notifPeminjaman', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Keamanan Tab */}
              {activeTab === 'keamanan' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Keamanan Sistem</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Lama
                        </label>
                        <input
                          type="password"
                          placeholder="Masukkan password lama"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          placeholder="Masukkan password baru"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          placeholder="Konfirmasi password baru"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Ubah Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup Tab */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Backup Database</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Backup Otomatis</div>
                          <div className="text-sm text-gray-600">Backup database secara otomatis</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => handleChange('autoBackup', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      {settings.autoBackup && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jadwal Backup
                          </label>
                          <select
                            value={settings.backupSchedule}
                            onChange={(e) => handleChange('backupSchedule', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                          </select>
                        </div>
                      )}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-blue-900">
                          <div className="font-medium mb-1">Backup Terakhir</div>
                          <div>{settings.lastBackup}</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Backup Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <Save className="w-5 h-5" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;