
'use client';

import { Breadcrumb } from 'flowbite-react';

export default function Navigasi({text1,text2}) {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item>{text1}</Breadcrumb.Item>
      <Breadcrumb.Item>{text2}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
