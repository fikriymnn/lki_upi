"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Router from "next/router";
import Image from "next/image";
import { Cantarell } from 'next/font/google'
const inter = Cantarell({ subsets: ['latin'], weight: "700" });

export default function NavbarCustom() {

  const [login, setLogin] = useState(false);
  const [role, setRole] = useState("");
  const path = usePathname();
  const router = useRouter();
  const adminPath = path.split("/");
  const [comp, setComp] = useState(1);

  useEffect(() => {
    const user = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const data = await axios(
          `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
          { withCredentials: true }
        );

        if (data.data.success == true) {
          setRole(data.data.data.role);
          if (data.data.data.role == "user") {
            setLogin(true);
          }
        }
      } catch (err) {
        return false;
      }
    };
    user();
  }, []);

  const toggleNav = () => {
    setComp((prevComp) => (prevComp === 1 ? 0 : 1));
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
        withCredentials: true,
      });
      window.location.replace("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="fixed z-50 w-full">
        <div className={inter.className}>
          <Navbar fluid className="  bg-[#202020]  ">
            <Navbar.Brand href="/">
              <img
                src="/footer.png"
                className="mt-[1vh] mr-3 h-6 sm:h-9"
                alt="Flowbite React Logo"
              />
            </Navbar.Brand>

          
            <Navbar.Toggle className="bg-white" />
            <Navbar.Collapse className="md:mr-20 ">
              {/* SUPER ADMIN */}
              {adminPath[2] == "dashboard" && role == "superadmin" ? (
                <Navbar.Link
                  href="/admin/dashboard/superadmin"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  {" "}
                  Arsip{" "}
                </Navbar.Link>
              ) : (
                ""
              )}

              {/* {adminPath[2] == "dashboard" && role == "superadmin" ? (
                <Navbar.Link
                  href="/admin/dashboard/superadmin/report"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  {" "}
                  Report{" "}
                </Navbar.Link>
              ) : (
                ""
              )} */}

              {adminPath[2] == "dashboard" ||
                (adminPath[1] == "superadmin" && role) ? (
                <Navbar.Link
                  onClick={handleLogout}
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Logout
                </Navbar.Link>
              ) : (
                ""
              )}
              {/* ADMIN */}
              {adminPath[2] == "dashboard" && role == "admin" ? (
                <Navbar.Link
                  href="/admin/dashboard/admin"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Content
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] == "dashboard" && role == "admin" ? (
                <Navbar.Link
                  href="/admin/dashboard/admin/order"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  {" "}
                  Order{" "}
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] == "dashboard" && role == "admin" ? (
                <Navbar.Link
                  href="/admin/dashboard/admin/history_order"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  {" "}
                  History Order
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] == "dashboard" && role == "admin" ? (
                <Navbar.Link
                  href="/admin/dashboard/admin/user"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  {" "}
                  User{" "}
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] == "dashboard" && role == "admin" ? (
                <Navbar.Link
                  href="/admin/dashboard/admin/report"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Report
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] == "dashboard" ||
                (adminPath[1] == "admin" && role) ? (
                <Navbar.Link
                  onClick={handleLogout}
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Logout
                </Navbar.Link>
              ) : (
                ""
              )}

              {/* UMUM */}

              {adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href="/"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  <h2>Home</h2>
                </Navbar.Link>
              ) : (
                ""
              )}

              {adminPath[2] !== "dashboard" ? (
                <Dropdown className="bg-[#202020] border-b-2 border-white" dismissOnClick={false} renderTrigger={() => <span className="mt-[2vh] font-extrabold text-white md:ml-0 sm:ml-0 ml-3">Layanan</span>}>
                  <Dropdown.Item className="text-white flex justify-center"><Navbar.Link
                    href="/layanan"
         className="text-white flex justify-center"
                  >Analisis</Navbar.Link></Dropdown.Item>
                  <Dropdown.Item className="text-white flex justify-center"><Navbar.Link
                    href="/pelatihan"
         className="text-white flex justify-center"
                  >Pelatihan</Navbar.Link></Dropdown.Item>
                  <Dropdown.Item className="text-white flex justify-center"><Navbar.Link
                    href="/sertifikasi"
                   className="text-white flex justify-center"
                  >Sertifikasi</Navbar.Link></Dropdown.Item>
                </Dropdown>
              ) : (
                ""
              )}

              {adminPath[2] !== "dashboard" ? (
                <h2>
                  <Navbar.Link
                    href="/about"
                    className="mt-[2vh] font-extrabold text-white border-t border-white"
                  >
                    About
                  </Navbar.Link>
                </h2>
              ) : (
                ""
              )}

              {adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href="/contact"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  <h2>Contact</h2>
                </Navbar.Link>
              ) : (
                ""
              )}

              {!login && adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href={`/login?prevRoute=${path}`}
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Login
                </Navbar.Link>
              ) : (
                ""
              )}

              {/* LOGIN */}

              {login && adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href="/my_order"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  Order saya
                </Navbar.Link>
              ) : (
                ""
              )}

              {login && adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href="/history_order"
                  className="mt-[2vh] font-extrabold text-white "
                >
                  History order{" "}
                </Navbar.Link>
              ) : (
                ""
              )}
              {login && adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  href="/profil"
                  className="mt-[2vh] font-extrabold   text-white"
                >
                  Profile
                </Navbar.Link>
              ) : (
                ""
              )}

              {login && adminPath[2] !== "dashboard" ? (
                <Navbar.Link
                  onClick={handleLogout}
                  className="mt-[2vh] font-extrabold text-white  "
                >
                  Logout
                </Navbar.Link>
              ) : (
                ""
              )}

              {/* <div className=''>

              <button onClick={toggleNav} className='md:px-0 px-2'><Image src={"/images/profil.svg"} alt="" width={0} height={0} sizes='100vw' className='w-[50px] h-[50px] ' /></button>
              {comp == 0 ? (
                <>
                  <div className='md:absolute md:bg-[#CDCCCC]  px-5 py-2 z-50'>
                   
                  </div>
                </>
              ) : ("")}
            </div> */}
            </Navbar.Collapse>
          </Navbar>
          <div className="bg-red-700 w-full h-3"></div>
        </div>
      </div >
    </>
  );
}
