'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from 'flowbite-react';

function CardPenguji() {
    return (
        <div className='p-2 border '>
            <Image src={"/images/barang.png"} width={0} height={0} sizes='100vw' alt='' className='w-[274.89px] h-[220px]' />
            <div className='px-5'>

                <Button color='failure' href='/analisis' className='grad font-bold py-2 '>
                    Selengkapnya
                    <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    )
}

export default CardPenguji