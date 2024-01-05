'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { UserContext } from '@/context/userContext';
import { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Router from 'next/router';

export default function NavbarCustom() {
  const [login, setLogin] = useState(false)
  const [role, setRole] = useState("")
  const path = usePathname()
  const router = useRouter()
  const adminPath = path.split("/")

  useEffect(()=>{
    const user = async () => {
      try{
        const data = await axios("http://localhost:5000/api/user",{ withCredentials: true })
        console.log(data)
        if (data.data.success == true) {
          console.log(data)
          setLogin(true)
          setRole(data.data.role)
        }else{
          console.log('false')
        }
      }catch(err){
        console.log(err.message)
      }
      
    }
    user()
  },[])

  const handleLogout = async ()=>{
    try{
      await axios.delete("http://localhost:5000/api/logout",{ withCredentials: true })
      window.location.replace('/')
    }catch(err){
      alert(err.message)
    }
    
  }

  return (
    <Navbar fluid rounded className='md:h-[12vh] fixed w-full z-50'>
      <Navbar.Brand href="/" >
        <img src="/logo.svg" className="mt-[1vh] mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="mt-[1vh] self-center whitespace-nowrap text-2xl font-semibold dark:text-white ">LKI UPI</span>
      </Navbar.Brand>


      <Navbar.Toggle />
      <Navbar.Collapse className='md:mr-20'>
        {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard" className="mt-[2vh] font-semibold">
          Content
        </Navbar.Link> : ''}
        {adminPath[2] !== "dashboard" ? <Navbar.Link href="/analisis" className="mt-[2vh] font-semibold">
          Layanan
        </Navbar.Link>:""
        // <Dropdown
        //   arrowIcon={false}
        //   inline
        //   className=''
        //   label={
        //     <Navbar.Link className='mt-[2vh] font-semibold'>
        //       Layanan
        //     </Navbar.Link>
        //   }
        // >



        //   <div className='bg-white md:w-[100vh] w-10vh  top-1   md:h-full grid md:grid-cols-3 grid-cols-1 justify-items-center'>
        //     <Navbar.Link href="/analisis" className=""><div className="flex">
        //       {/* <img src="/logo.svg" className=''/> */}
        //       <h1 className='m-auto px-5 text-lg font-semibold'>Analisis</h1>
        //     </div></Navbar.Link>
        //     <Navbar.Link href="#" className="text-lg"><div className="flex">
        //       {/* <img src="/logo.svg"/> */}
        //       <h1 className='m-auto px-5 font-semibold'>Sertifikasi</h1>
        //     </div></Navbar.Link>
        //     <Navbar.Link href="#" className="text-lg"><div className="flex">
        //       {/* <img src="/logo.svg"/> */}
        //       <h1 className='m-auto px-5 font-semibold'>Pelatihan</h1>
        //     </div></Navbar.Link>
        //   </div>
        // </Dropdown>
        }

        {adminPath[2] == "dashboard" && role == "admin"? <Navbar.Link href="/admin/dashboard/admin/order" className="mt-[2vh] font-semibold"> Order </Navbar.Link> : ""}
        {adminPath[2] == "dashboard" && role == "operator"? <Navbar.Link href="/admin/dashboard/operator/order_operator" className="mt-[2vh] font-semibold">Order Operator</Navbar.Link> : ""}

        

        {adminPath[2] !== "dashboard"?<Navbar.Link href="/about" className="mt-[2vh] font-semibold">About</Navbar.Link>:""}

        {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard/admin/jenis_pengujian" className="mt-[2vh] font-semibold">Jenis pengujian</Navbar.Link> : ""}

        {adminPath[2] !== "dashboard"?<Navbar.Link href="/contact" className="mt-[2vh] font-semibold">Contact</Navbar.Link>:""}

        {adminPath[2] == "dashboard" && role == "admin"? <Navbar.Link href="/admin/dashboard/admin/report" className="mt-[2vh] font-semibold">Report</Navbar.Link> : ""}

        {login?adminPath[2] !== "dashboard"?<Navbar.Link href="/my_order" className="mt-[2vh] font-semibold">My order</Navbar.Link>:"":<Navbar.Link href={`/login?prevRoute=${path}`} className="mt-[2vh] font-semibold">Login</Navbar.Link> }
        {login&&adminPath[2] !== "dashboard"?<Navbar.Link onClick={handleLogout} className="mt-[2vh] font-semibold">Logout</Navbar.Link>:""}
        {login&&adminPath[2] !== "dashboard"?<Navbar.Link href="/profile" className="mt-[2vh] font-semibold">Profile</Navbar.Link>:""}


      </Navbar.Collapse>
    </Navbar>
  );
}