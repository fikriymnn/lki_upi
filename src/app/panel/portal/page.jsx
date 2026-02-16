// app/page.jsx atau pages/index.jsx
"use client"
import Image from 'next/image';
import Link from 'next/link';

export default function SiteManagementDashboard() {
  const sites = [
    {
      title: 'Inventory',
      description: 'Manajemen Inventory & Stok',
      link: '/panel/dashboard',
      status: 'active'
    },
    {
      title: 'Affiliate',
      description: 'Program Affiliate & Partner',
      link: '/affiliate',
      status: 'active'
    },
    {
      title: 'Layanan Analisis',
      description: 'Analisis Data & Reporting',
      link: '/analisis',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-red-600">
      {/* Logo di tengah atas dengan background putih subtle */}
      <div className="pt-6 pb-4 text-center">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
          <Image
            src="/icon/upi-white.png"
            alt="UPI Logo"
            width={100}
            height={50}
            className="mx-auto object-contain"
          />
        </div>
      </div>

      {/* Header */}
      <div className="pt-4 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
          PORTAL DASHBOARD LKI UPI
        </h1>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl p-6 hover:shadow-black/50 hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              <div className="flex flex-col h-full">
                {/* Title dengan accent merah */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                  <h2 className="text-xl font-bold bg-clip-text text-black">
                    {site.title}
                  </h2>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 text-sm mb-auto pl-3">
                  {site.description}
                </p>

                {/* Button/Link */}
                <div className="mt-6 text-right">
                  {site.status === 'active' ? (
                    <Link
                      href={site.link}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-sm hover:from-red-700 hover:to-gray-900 transition-all duration-200 shadow-sm hover:shadow-lg"
                    >
                      View Dashboard
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-600 font-semibold text-sm rounded-lg">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}