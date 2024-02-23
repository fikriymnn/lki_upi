'use client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ButtonOrder from '@/components/ButtonOrder'
import Image from 'next/image'
import CardPenguji from '@/components/CardPenguji';
import { useEffect, useState } from 'react';
import axios from 'axios'

export default function Analisis() {
    const [data, setData] = useState([])


    useEffect(()=>{
       async function getData(){
        try{
            const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content?resize=true`, { withCredentials: true })
            if(data.data.success){
                setData(data.data.data)
            }
            
        }catch(err){
            alert(err.message)
        }
       }
       getData()
    },[])


    return (
        <>
            <main className=''>

                <div className=" flex md:h-[229px] h-40 w-full  ">
                    <Image
                        alt=""
                        src={"/carousel.jpg"}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className=" md:h-[229px] h-40 w-full"
                    />
                    <div className="bg-neutral-900 bg-opacity-70 w-full md:h-[229px] h-40  absolute flex flex-col justify-center items-center">
                        <p className="text-white md:text-5xl sm:text-xl text-lg font-bold">
                            Layanan Jasa Analisis LKI UPI
                        </p>
                        <div className="flex justify-center mt-5">
                            <div className="px-10 py-2 bg-slate-900 text-white grad rounded-xl font-bold md:text-lg sm:text-base text-sm">
                                Tentang Kami
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-[60px]'>
                    <p className='text-center md:text-4xl text-2xl font-bold text-gray-800 mt-7'>Layanan Pengujian Laboratorium Kimia Instrumen LKI UPI</p>
                    <div className='flex justify-center'>
                        <hr className='grad h-2 mb-8 mt-5 w-56 text-center' />
                    </div>
                    <div className='grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-3'>

                        {data.map((v, i) => (
                            <>
                                <CardPenguji key={i} id={v._id} nama={v.title} foto={`data:${v.foto.contentType};base64,${v.foto.data.toString('base64')}`}/>
                            </>
                        ))}

                    </div>


                    <br />
                  
                    <ButtonOrder/>
                    <br />
                    <div className='my-10'>

                        <p className='text-center md:text-4xl text-2xl font-bold text-gray-800 mt-7'>Alur Pengujian Laboratorium Kimia Instrumen  UPI</p>
                        <div className='flex justify-center'>
                            <hr className='grad h-2 mb-8 mt-5 w-8/12 text-center' />
                        </div>
                    </div>
                    <div className='flex justify-center items-center translate-x-10'>
                        <Image
                            src={'/images/diagram.png'}
                            alt=''
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-[600px] md:h-[900px] h-full'
                        />
                    </div>
                    <div className='my-10 '>
                        <p className='font-medium md:text-xl text-sm'>
                            Catatan:  Sampel akan dimusnahkan dalam waktu 7 hari setelah pesanan selesai
                            Komplain hasil pengujian dapat dilakukan maksimal 7 hari setelah pesanan selesai melalui menu
                            kontak kami
                        </p>
                    </div>
                    <div className='mt-24 mb-10'>

                        <p className='text-center md:text-4xl text-2xl font-bold text-gray-800 mt-7'>Daftar Harga Pengujian Laboratorium Kimia Instrumen UPI</p>
                        <div className='flex justify-center'>
                            <hr className='grad h-2 mb-8 mt-5 w-8/12 text-center' />
                        </div>
                    </div>
                    <p className='font-semibold text-xl md:ml-32 ml-0 my-3'>Pengukuran</p>
                    <div className='flex justify-center items-center'>

                        <Image
                            src={'/images/tabel1.png'}
                            alt=''
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-[1000px] h-full'
                        />

                    </div>
                    <p className='text-red-700 md:font-bold font-semibold text-end md:mx-28 mx-0 md:text-base text-sm'>*Biaya per Jam</p>
                    <div className='mb-24'>


                        <p className='md:text-[29px] text-xl font-bold md:mx-28 mx-0 mt-20 mb-5'>PENGUKURAN DAN ANALISIS LANJUTAN</p>
                        <div className='flex justify-center items-center'>

                            <Image
                                src={'/images/tabel2.png'}
                                alt=''
                                width={0}
                                height={0}
                                sizes='100vw'
                                className='w-[1000px] h-full'
                            />

                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}