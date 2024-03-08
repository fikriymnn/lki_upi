
'use client';

import { Breadcrumb } from 'flowbite-react';

export default function Navigasi({text1,text2}) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example" className='md:mt-20 md:ml-20 mt-14 ml-10'>
      <Breadcrumb.Item className='md:text-xl text-lg'>{text1}</Breadcrumb.Item>
      <Breadcrumb.Item className='md:text-xl text-lg'>{text2}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
