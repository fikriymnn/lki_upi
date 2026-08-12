"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../../../../../components/affiliate/SidebarAffiliateAdmin'; // ← sesuaikan path ke Sidebar yg kamu kasih
import AffiliateList from './AffiliateList';
import AffiliateDetail from './AffiliateDetail';

export default function AffiliateAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('/panel/portal/affiliate/admin');
  const [page, setPage] = useState('list'); // list | detail
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  useEffect(()=>{
    console.log("hai")
  },[])

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
          <p className="text-white font-bold md:text-2xl text-sm">LAB AFFILIATE</p>
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