'use client';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { UserContext } from '@/context/userContext';
import { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Router from 'next/router';
import Image from 'next/image';

export default function NavbarCustom() {
  const [login, setLogin] = useState(false)
  const [role, setRole] = useState("")
  const path = usePathname()
  const router = useRouter()
  const adminPath = path.split("/")
  const [comp, setComp] = useState(1)


  useEffect(() => {
    const user = async () => {
      try {
        const data = await axios("http://localhost:5000/api/user", { withCredentials: true })
        console.log(data)
        if (data.data.success == true) {
          setRole(data.data.data.role)
          if (data.data.data.role == "user") {
            setLogin(true)
          }
        }
      } catch (err) {
        return false
      }
    }
    user()
  }, [])

  const toggleNav = () => {
    setComp((prevComp) => (prevComp === 1 ? 0 : 1));
  };

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/logout", { withCredentials: true })
      window.location.replace('/')
    } catch (err) {
      alert(err.message)
    }

  }

  return (
    <>
      <div className='fixed z-50 w-full'>

        <Navbar fluid className='  bg-[#202020]  '>

          <Navbar.Brand href="/" >
            <img src="/footer.png" className="mt-[1vh] mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />

          </Navbar.Brand>

          <Navbar.Toggle className='bg-white' />
          <Navbar.Collapse className='md:mr-20 '>
            {/* ADMIN */}
            {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard/admin" className="mt-[2vh] font-bold text-white">
              Content
            </Navbar.Link> : ''}

            {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard/admin/order" className="mt-[2vh] font-bold text-white"> Order </Navbar.Link> : ""}

            {adminPath[2] == "dashboard" && role == "admin" ? <Navbar.Link href="/admin/dashboard/admin/report" className="mt-[2vh] font-bold text-white">Report</Navbar.Link> : ""}

            {adminPath[2] == "dashboard" || (adminPath[1] == "admin" && role) ? <Navbar.Link onClick={handleLogout} className="mt-[2vh] font-bold text-white">Logout</Navbar.Link> : ""}

            {/* UMUM */}

            {adminPath[2] !== "dashboard" ? <Navbar.Link href="/about" className="mt-[2vh] font-bold text-white">About</Navbar.Link> : ""}

            {adminPath[2] !== "dashboard" ? <Navbar.Link href="/contact" className="mt-[2vh] font-bold text-white">Contact</Navbar.Link> : ""}

            {adminPath[2] !== "dashboard" ? <Navbar.Link href="/analisis" className="mt-[2vh] font-bold text-white">
              Layanan
            </Navbar.Link> : ""}

            {!login && adminPath[2] !== "dashboard" ? <Navbar.Link href={`/login?prevRoute=${path}`} className="mt-[2vh] font-bold text-white">Login</Navbar.Link> : ""}

            {/* LOGIN */}

            {login && adminPath[2] !== "dashboard" ? <Navbar.Link href="/my_order" className="mt-[2vh] font-bold text-white">Order saya</Navbar.Link> : ""}

            {login && adminPath[2] !== "dashboard" ? <Navbar.Link href="/history_order" className="mt-[2vh] font-bold text-white">History order </Navbar.Link> : ""}

            <div className=''>

              <button onClick={toggleNav} className='md:px-0 px-2'><Image src={"/images/profil.svg"} alt="" width={0} height={0} sizes='100vw' className='w-[50px] h-[50px] ' /></button>
              {comp == 0 ? (
                <>
                  <div className='md:absolute md:bg-[#CDCCCC]  px-5 py-2 z-50'>
                    {login && adminPath[2] !== "dashboard" ? <Navbar.Link href="/profil" className="mt-[2vh] font-bold md:text-black text-white">Profile</Navbar.Link> : ""}

                    {login && adminPath[2] !== "dashboard" ? <Navbar.Link onClick={handleLogout} className="mt-[2vh] font-bold text-white md:text-black">Logout</Navbar.Link> : ""}

                  </div>
                </>
              ) : ("")}
            </div>





          </Navbar.Collapse>
        </Navbar>
        <div className='bg-red-700 w-full h-3'>

        </div>
      </div>
    </>
  );
}