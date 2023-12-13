import Image from 'next/image'
import CarouselCustom from '@/components/CarouselCustom'

export default function Home() {
  return (
    <>
      <CarouselCustom/>
      <div className='p-14'>
        <h1 className='text-center text-3xl font-bold'>LAB KIMIA UPI</h1>
        <p className='text-center mt-14 font-semibold'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda sint qui libero neque natus veritatis delectus in praesentium vero saepe commodi impedit quis aspernatur, similique voluptas totam repellat fugiat ullam!</p>
        
      </div>
    </>
  )
}
