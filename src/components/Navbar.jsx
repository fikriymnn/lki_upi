'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { UserContext } from '@/context/userContext';
import { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavbarCustom() {
  const [login, setLogin] = useState(true)
  const path = usePathname()
  const adminPath = path.split("/")

  

  useEffect(() => {
    const user = async () => {
      const data = await fetch("http://localhost:5000/api/user")
      if (data.success == true) {
        setLogin(true)
      }else{
        console.log('false')
      }
    }
    user()
  }, [])

  return (
    <Navbar fluid rounded className='md:h-[12vh] fixed w-full z-50'>
      <Navbar.Brand href="/" >
        <img src="/logo.svg" className="mt-[1vh] mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="mt-[1vh] self-center whitespace-nowrap text-xl font-semibold dark:text-white ">LKI UPI</span>
      </Navbar.Brand>


      <Navbar.Toggle />
      <Navbar.Collapse className='md:mr-20'>
        {adminPath[2] == "dashboard" ? <Navbar.Link href="/admin/dashboard" className="mt-[2vh]">
          Content
        </Navbar.Link> : <Navbar.Link href="/" className="mt-[2vh]">
          Home
        </Navbar.Link>}
        {adminPath[2] == "dashboard" ? "" : <Dropdown
          arrowIcon={false}
          inline
          className=''
          label={
            <Navbar.Link className='mt-[2vh]'>
              Layanan
            </Navbar.Link>
          }
        >



          <div className='bg-white md:w-[100vh] w-10vh  top-1   md:h-full grid md:grid-cols-3 grid-cols-1 justify-items-center'>
            <Navbar.Link href="/analisis" className=""><div className="flex">
              {/* <img src="/logo.svg" className=''/> */}
              <h1 className='m-auto px-5 text-lg'>Analisis</h1>
            </div></Navbar.Link>
            <Navbar.Link href="#" className="text-lg"><div className="flex">
              {/* <img src="/logo.svg"/> */}
              <h1 className='m-auto px-5'>Sertifikasi</h1>
            </div></Navbar.Link>
            <Navbar.Link href="#" className="text-lg"><div className="flex">
              {/* <img src="/logo.svg"/> */}
              <h1 className='m-auto px-5'>Pelatihan</h1>
            </div></Navbar.Link>
          </div>
        </Dropdown>}

        {adminPath[2] == "dashboard" ? <Navbar.Link href="/admin/dashboard/order" className="mt-[2vh]">Order</Navbar.Link> : <Navbar.Link href="/about" className="mt-[2vh]">About</Navbar.Link>}
        {adminPath[2] == "dashboard" ? <Navbar.Link href="/admin/dashboard/jenis_pengujian" className="mt-[2vh]">Jenis pengujian</Navbar.Link> : <Navbar.Link href="/contact" className="mt-[2vh]">Contact</Navbar.Link>}
        {adminPath[2] == "dashboard" ? <Navbar.Link href="/admin/dashboard/report" className="mt-[2vh]">Report</Navbar.Link> : ""}
        {adminPath[2] == "dashboard" ? <Navbar.Link href="/admin/dashboard/history_order" className="mt-[2vh]">History order</Navbar.Link> : ""}
        {!login?"":adminPath[2] == "dashboard" ? "" : <Navbar.Link href="/my_order" className="mt-[2vh]">My order</Navbar.Link>}
        {!login ? <Navbar.Link href={`/login?prevRoute=${path}`} className="mt-[2vh]">Login</Navbar.Link> : ""}
        {adminPath[2] == "dashboard" ? "" : <Navbar.Link href={`/login?prevRoute=${path}`} className="mt-[2vh]">Login</Navbar.Link>
}
        

      </Navbar.Collapse>
    </Navbar>
  );
}