'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import parse from 'html-react-parser'

function Page({ params }) {
    const [data,setData] = useState({
        title:'',
        sub_title:'',
        deskripsi:''
    })
    const [file1,setFile1] = useState('')
    const [file2,setFile2] = useState('')
    const {id} = params

   useEffect(()=>{
    async function getData(){
        try{
            const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/content/${id}`, { withCredentials: true })
            if(data.data.success){
                console.log(data.data.data)
                setData(data.data.data)
                setFile1(data.data.data.foto)
                setFile2(data.data.data.contoh_hasil)

            }      
        }catch(err){
            alert(err.message)
        }
       }
       getData()
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
                    <div className='md:flex sm:flex bg-white p-3 gap-5'>
                        <div className='flex flex-col align-start items-start md:w-4/12 sm:w-4/12 gap-y-10 mt-10 justify-center'>
                            <div>
                            <Image alt='' src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${data?.foto}`} width={0} height={0} sizes='100vw' className='w-[348px]' />
                            <p className='font-bold text-center md:text-xl sm:text-base text-base mt-5'>{data?.title}</p>
                            <p className='text-center md:text-lg sm:text-base text-sm'>

                               { parse(data?.sub_title)}
                            </p>
                            </div>
                        </div>
                        <div className='md:w-8/12 sm:w-6/12 flex items-center'>
                            <div className='md:text-[18px] sm:text-[10px] text-[10px] font-medium mt-5 md:mt-0 sm:mt-5'>
                                {parse(data?.deskripsi)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-[#EDECECD4] w-11/12 rounded-lg shadow-2xl mt-20'>
                    <p className='text-[24px] font-bold text-center my-3'>Contoh Hasil Pengujian</p>
                    <div className=' bg-white px-3 py-5'>
                        <div className='mt-10 flex justify-center'>
                            <Image alt='' src={`${process.env.NEXT_PUBLIC_FILE_URL}/file/files/${data?.contoh_hasil}`} width={0} height={0} sizes='100vw' className='w-10/12 h-full' />

                        </div>
                       
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page