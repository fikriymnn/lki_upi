'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import barang from '../barang'



function Page({ params }) {
    const [data,setData] = useState([])
    const {id} = params

   useEffect(()=>{
      
   },[])

    return (
        <main>

            <p className="text-center md:text-3xl text-xl font-bold text-gray-800 mt-7">
                Temui Kami
            </p>
            <div className="flex justify-center">
                <hr className="md:w-[400px] w-[150px] mt-[13px] h-2.5  rounded-lg shadow grad mb-10" />
            </div>
            <div className='flex flex-col justify-center items-center mb-96'>

                <div className='bg-[#EDECECD4] w-11/12 rounded-lg shadow-2xl '>
                    <p className='text-[24px] font-bold text-center my-3'>Deskripsi Alat</p>
                    <div className='flex bg-white p-3'>
                        <div className='flex flex-col w-4/12 gap-y-10 mt-10'>
                            <Image alt='' src={`${barang[params.id].thumbnail}`} width={0} height={0} sizes='100vw' className='w-[348px] h-full' />
                            <p className='font-bold text-center ]'>{barang[params.id].nama}</p>
                            <p className='text-center'>

                                {barang[params.id].sub}
                            </p>
                        </div>
                        <div className='w-8/12 flex items-center'>
                            <p className='text-[22px] font-medium leading-10 text-[#696969]'>
                                {barang[params.id].desc}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='bg-[#EDECECD4] w-11/12 rounded-lg shadow-2xl mt-20'>
                    <p className='text-[24px] font-bold text-center my-3'>Contoh Hasil Penguji</p>
                    <div className='grid grid-cols-2 bg-white px-3 py-5'>
                        <div className='flex flex-col  gap-y-10 mt-10'>
                            <Image alt='' src={`${barang[params.id].img1}`} width={0} height={0} sizes='100vw' className='w-[348px] h-full' />

                        </div>
                        <div className='flex flex-col  gap-y-10 mt-10'>
                            <Image alt='' src={`${barang[params.id].img2}`} width={0} height={0} sizes='100vw' className='w-[348px] h-full' />

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page