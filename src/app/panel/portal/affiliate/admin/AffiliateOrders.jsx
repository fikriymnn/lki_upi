"use client";
import AffiliateOrder from './AffiliateOrder';

export default function AffiliateOrders() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Semua Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau dan proses order dari seluruh laboratorium affiliate
        </p>
      </div>

      {/* Tanpa affiliateId → menampilkan order dari SEMUA lab */}
      <AffiliateOrder />
    </div>
  );
}