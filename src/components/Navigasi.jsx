
'use client';

import { Breadcrumb } from 'flowbite-react';

export default function Navigasi({text1,text2}) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example" className='md:mt-8 md:ml-14 mt-8 ml-10'>
      <Breadcrumb.Item ><p className='md:text-xl text-lg'>{text1}</p></Breadcrumb.Item>
      <Breadcrumb.Item ><p className='md:text-xl text-lg'>{text2}</p></Breadcrumb.Item>
    </Breadcrumb>
  );
}
