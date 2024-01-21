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
            setRole(data.data.data.role)
            if(data.data.data.role=="user"){
              setLogin(true)
            }
        }
      }catch(err){
       return false
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
        </Navbar.Link>:""}

        {adminPath[2] == "dashboard" && role == "admin"? <Navbar.Link href="/admin/dashboard/admin/order" className="mt-[2vh] font-semibold"> Order </Navbar.Link> : ""}

        {/* {adminPath[2] == "dashboard" && role == "operator"? <Navbar.Link href="/admin/dashboard/operator" className="mt-[2vh] font-semibold">Order Operator</Navbar.Link> : ""}
        {adminPath[2] == "dashboard" && role == "pj"? <Navbar.Link href="/admin/dashboard/pj" className="mt-[2vh] font-semibold">Order Penanggung Jawab</Navbar.Link> : ""} */}

        {adminPath[2] !== "dashboard"?<Navbar.Link href="/about" className="mt-[2vh] font-semibold">About</Navbar.Link>:""}

        {/* {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard/admin/jenis_pengujian" className="mt-[2vh] font-semibold">Jenis pengujian</Navbar.Link> : ""} */}

        {adminPath[2] !== "dashboard"?<Navbar.Link href="/contact" className="mt-[2vh] font-semibold">Contact</Navbar.Link>:""}

        {adminPath[2] == "dashboard" && role == "admin"? <Navbar.Link href="/admin/dashboard/admin/report" className="mt-[2vh] font-semibold">Report</Navbar.Link> : ""}

        {login&&adminPath[2] !== "dashboard"?<Navbar.Link href="/my_order" className="mt-[2vh] font-semibold">My order</Navbar.Link>:""}
        {!login&&adminPath[2] !== "dashboard"?<Navbar.Link href={`/login?prevRoute=${path}`} className="mt-[2vh] font-semibold">Login</Navbar.Link>:""}
        {login&&adminPath[2] !== "dashboard"?<Navbar.Link onClick={handleLogout} className="mt-[2vh] font-semibold">Logout</Navbar.Link>:""}
       
        {adminPath[2] == "dashboard" || (adminPath[1] == "admin"&& role)?<Navbar.Link onClick={handleLogout} className="mt-[2vh] font-semibold">Logout</Navbar.Link>:""}
        {login&&adminPath[2] !== "dashboard"?<Navbar.Link href="/profile" className="mt-[2vh] font-semibold">Profile</Navbar.Link>:""}
      </Navbar.Collapse>
    </Navbar>
  );
}