
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ButtonOrder from '@/components/ButtonOrder'

 
export default function analisis(){


    return (
        <>
        <div className='bg-gray-600 h-96 w-full'>
            
        </div>
           <div className='h-64'>
                  <p className='text-center text-4xl font-bold text-gray-800 mt-7'>JENIS DAN DETAIL LAYANAN</p>
                  <div className='flex justify-center'>
        <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center'/>
        </div>


                  <div className='flex justify-center mt-24'>
                  <ButtonOrder className=""/> 
                  </div>
                  <br/>
                  <br/>
                
           </div>
        </>
    )
}