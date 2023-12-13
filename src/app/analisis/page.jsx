
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ButtonOrder from '@/components/ButtonOrder'

 
export default function analisis(){


    return (
        <>
           <div className='h-64'>
                  <p className='text-center text-2xl font-bold'>Jenis dan Detail Layanan</p>
                  
                  <div className='flex justify-center mt-24'>
                  <ButtonOrder className=""/> 
                  </div>
                  <br/>
                  <br/>
                
           </div>
        </>
    )
}