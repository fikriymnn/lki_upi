import Image from 'next/image'
import CarouselCustom from '@/components/CarouselCustom'
import LayananCard from '@/components/LayananCard'

export default function Home() {
  return (
    <>
      <CarouselCustom />
      <div className=' '>

        {/* <p className='text-center mt-14 font-semibold'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda sint qui libero neque natus veritatis delectus in praesentium vero saepe commodi impedit quis aspernatur, similique voluptas totam repellat fugiat ullam!</p> */}
        <div className=''>
          <h1 className='text-center text-4xl font-bold mt-10 mb-5 text-gray-800'>LAYANAN DAN JASA LAB KIMIA UPI</h1>
          <div className='flex justify-center'>
            <hr className='text-red-700 bg-red-600 h-2 mb-8 w-56 text-center' />
          </div>
        </div>
        <div className='p-16 '>

          <div className='grid grid-cols-3 justify-items-center '>
            <LayananCard title={'Layanan Analisis '} selengkapnya={'Selengkapnya'} />
            <LayananCard title={'Sertifikasi'} selengkapnya={'Segera Hadir'} />
            <LayananCard title={'Pelatihan'} selengkapnya={'Segera Hadir'} />

          </div>
          <div className='flex justify-center mt-[86px]'>

            <div className='px-20 py-4 bg-slate-900 text-white bg-gradient-to-r from-red-700 via-red-700 to-rose-950 rounded-xl font-bold text-lg'>Pesan Sekarang</div>
          </div>
        </div>
      </div>
    </>
  )
}
