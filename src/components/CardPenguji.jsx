'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

function CardPenguji({ id, nama, foto }) {
    return (
        <div className='bg-white rounded-lg overflow-hidden shadow-md border border-gray-200'>
            {/* Image Container */}
            <div className='relative h-64 w-full bg-gray-100'>
                <Image 
                    src={foto} 
                    width={0} 
                    height={0} 
                    sizes='100vw' 
                    alt={nama}
                    className='w-full h-full object-cover'
                />
            </div>

            {/* Content Container */}
            <div className='p-6'>
                {/* Title */}
                <h3 className='text-xl font-bold text-gray-800 mb-4 line-clamp-2 min-h-[3.5rem] leading-tight'>
                    {nama}
                </h3>

                {/* Divider */}
                <div className='w-12 h-1 bg-red-700 mb-4'></div>

                {/* Button */}
                <Link 
                    href={`/layanan/${id}`}
                    className='inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white bg-red-700 rounded-md'
                >
                    <span>Selengkapnya</span>
                    <svg 
                        className="ml-2 h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </Link>
            </div>

            {/* Corner Accent */}
            <div className='absolute top-0 right-0 w-20 h-20 bg-red-700/10 rounded-bl-full'></div>
        </div>
    )
}

export default CardPenguji