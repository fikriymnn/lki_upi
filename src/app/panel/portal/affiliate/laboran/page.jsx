"use client";
import { useState } from 'react';
import Sidebar from '../../../../../components/affiliate/SidebarAffiliateAdmin'; // TODO: ganti ke Sidebar khusus role Laboran kalau berbeda dari admin

import AffiliateOrder from './AffiliateOrder';
import AffiliateOrderDetail from './AffiliateOrderDetail';
import AffiliateOrderEdit from './AffiliateOrderEdit';

const HEADER_TITLE = {
  order: 'DAFTAR ORDER',
  orderDetail: 'DETAIL ORDER',
  orderEdit: 'EDIT ORDER',
};

export default function LaboranPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('/panel/portal/affiliate/laboran');

  // page: 'order' | 'orderDetail' | 'orderEdit'
  const [page, setPage] = useState('order');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          <p className="text-white font-bold md:text-2xl text-sm">
            {HEADER_TITLE[page] || 'LAB AFFILIATE — LABORAN'}
          </p>
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
        </main>
      </div>
    </div>
  );
}