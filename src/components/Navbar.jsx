"use client";

import { Dropdown, Navbar } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

export default function NavbarCustom() {
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const pathSegments = pathname.split("/");
  const isDashboard = pathSegments[2] === "dashboard";
  const isUser = userRole === "user";
  const isAdmin = userRole === "admin";
  const isSuperAdmin = userRole === "superadmin";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
        { withCredentials: true }
      );

      if (data.success) {
        setUserRole(data.data.role);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
        withCredentials: true,
      });
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Gagal logout. Silakan coba lagi.");
    }
  };

  const NavLink = ({ href, children, onClick }) => (
    <Navbar.Link
      href={href}
      onClick={onClick}
      className="text-xs font-semibold text-white hover:text-red-500 transition-colors duration-200 py-2 md:py-0"
    >
      {children}
    </Navbar.Link>
  );

  return (
    <>
      <div className="fixed z-50 w-full bg-[#202020] shadow-lg">
        <Navbar fluid className="bg-[#202020] max-w-7xl mx-auto">
          <Navbar.Brand href="/">
            <img
              src="/footer.png"
              className="h-8 sm:h-10 md:px-8"
              alt="Logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle className="bg-white hover:bg-gray-200 transition-colors" />
          
          <Navbar.Collapse className="md:flex md:items-center md:gap-1 md:px-8">{/* Super Admin Navigation */}
            {isDashboard && isSuperAdmin && (
              <>
                <NavLink href="/admin/dashboard/superadmin">Arsip</NavLink>
              </>
            )}

            {/* Admin Navigation */}
            {isDashboard && isAdmin && (
              <>
                <NavLink href="/admin/dashboard/admin">Content</NavLink>
                <NavLink href="/admin/dashboard/admin/order">Order</NavLink>
                <NavLink href="/admin/dashboard/admin/user">User</NavLink>
                <NavLink href="/admin/dashboard/admin/report">Report</NavLink>
              </>
            )}

            {/* Dashboard Logout */}
            {isDashboard && (isAdmin || isSuperAdmin) && (
              <NavLink onClick={handleLogout}>Logout</NavLink>
            )}

            {/* Public Navigation */}
            {!isDashboard && (
              <>
                <NavLink href="/">Home</NavLink>

                <Dropdown
                  label=""
                  dismissOnClick={false}
                  renderTrigger={() => (
                    <button className="text-xs font-semibold text-white transition-colors duration-200 md:py-0 py-2 md:text-center w-full md:w-auto text-left px-3  md:border-0 border-b border-white">
                      Layanan
                    </button>
                  )}
                  className="bg-[#202020] border border-gray-700 rounded-sm mt-2"
                >
                  <Dropdown.Item className="hover:bg-gray-800">
                    <a href="/analisis" className="text-white hover:text-red-600 px-12 text-xs block w-full">
                      Analisis
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item className="hover:bg-gray-800">
                    <a href="/pelatihan" className="text-white hover:text-red-600 px-12 text-xs block w-full">
                      Pelatihan
                    </a>
                  </Dropdown.Item>
                  <Dropdown.Item className="hover:bg-gray-800">
                    <a href="/sertifikasi" className="text-white hover:text-red-600 px-12 text-xs block w-full">
                      Sertifikasi
                    </a>
                  </Dropdown.Item>
                </Dropdown>

                <NavLink href="/about">Tentang Kami</NavLink>
                <NavLink href="/contact">Contact</NavLink>

                {/* User Navigation */}
                {isUser ? (
                  <>
                    <NavLink href="/my_order">Order Saya</NavLink>
                    <NavLink href="/history_order">History Order</NavLink>
                    <NavLink href="/profil">Profile</NavLink>
                    <NavLink onClick={handleLogout}>Logout</NavLink>
                  </>
                ) : (
                    <NavLink href={`/login?prevRoute=${pathname}`}>Login</NavLink>
                  )
                }
              </>
            )}
          </Navbar.Collapse>
        </Navbar>
        
        {/* Red accent bar */}
        <div className="bg-red-700 w-full h-1"></div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  );
}


// "use client";

// import { Avatar, Dropdown, Navbar } from "flowbite-react";
// import { UserContext } from "@/context/userContext";
// import { useContext, useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import axios from "axios";
// import Router from "next/router";
// import Image from "next/image";


// export default function NavbarCustom() {
//   const [login, setLogin] = useState(false);
//   const [role, setRole] = useState("");
//   const path = usePathname();
//   const router = useRouter();
//   const adminPath = path.split("/");
//   const [comp, setComp] = useState(1);

//   useEffect(() => {
//     const user = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         const data = await axios(
//           `${process.env.NEXT_PUBLIC_URL}/api/user/${token}`,
//           { withCredentials: true }
//         );

//         if (data.data.success == true) {
//           setRole(data.data.data.role);
//           if (data.data.data.role == "user") {
//             setLogin(true);
//           }
//         }
//       } catch (err) {
//         return false;
//       }
//     };
//     user();
//   }, []);

//   const toggleNav = () => {
//     setComp((prevComp) => (prevComp === 1 ? 0 : 1));
//   };

//   const handleLogout = async () => {
//     try {
//       localStorage.removeItem("access_token");
//       await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/logout`, {
//         withCredentials: true,
//       });
//       window.location.replace("/");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <>
//       <div className="fixed z-50 w-full text-xs bg-[#202020]">
//         <div>
//           <Navbar fluid className="bg-[#202020] max-w-7xl mx-auto">
//             <Navbar.Brand href="/">
//               <img
//                 src="/footer.png"
//                 className="mt-[1vh] mr-3 h-6 sm:h-9"
//                 alt="Flowbite React Logo"
//               />
//             </Navbar.Brand>

//             <Navbar.Toggle className="bg-white" />
//             <Navbar.Collapse className="md:mr-20 flex items-center h-full">
//               {/* SUPER ADMIN */}
//               {adminPath[2] == "dashboard" && role == "superadmin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/superadmin"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   {" "}
//                   Arsip{" "}
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {/* {adminPath[2] == "dashboard" && role == "superadmin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/superadmin/report"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   {" "}
//                   Report{" "}
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )} */}
//               {/* ADMIN */}
//               {adminPath[2] == "dashboard" && role == "admin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/admin"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   Content
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] == "dashboard" && role == "admin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/admin/order"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   {" "}
//                   Order{" "}
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {/* {adminPath[2] == "dashboard" && role == "admin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/admin/history_order"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   {" "}
//                   History Order
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )} */}

//               {adminPath[2] == "dashboard" && role == "admin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/admin/user"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   {" "}
//                   User{" "}
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] == "dashboard" && role == "admin" ? (
//                 <Navbar.Link
//                   href="/admin/dashboard/admin/report"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   Report
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] == "dashboard" ||
//                 (adminPath[1] == "admin" && role) ? (
//                 <Navbar.Link
//                   onClick={handleLogout}
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   Logout
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {/* UMUM */}

//               {adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href="/"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   <h2>Home</h2>
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] !== "dashboard" ? (
//                 <Dropdown
//                   className="bg-[#202020] border-b-2 border-white"
//                   dismissOnClick={false}
//                   renderTrigger={() => (
//                     <span className="mt-[2vh] font-semibold text-white md:ml-0 sm:ml-0 ml-3">
//                       Layanan
//                     </span>
//                   )}
//                 >
//                   <Dropdown.Item className="text-white flex justify-center">
//                     <Navbar.Link
//                       href="/analisis"
//                       className="text-white flex justify-center"
//                     >
//                       Analisis
//                     </Navbar.Link>
//                   </Dropdown.Item>
//                   <Dropdown.Item className="text-white flex justify-center">
//                     <Navbar.Link
//                       href="/pelatihan"
//                       className="text-white flex justify-center"
//                     >
//                       Pelatihan
//                     </Navbar.Link>
//                   </Dropdown.Item>
//                   <Dropdown.Item className="text-white flex justify-center">
//                     <Navbar.Link
//                       href="/sertifikasi"
//                       className="text-white flex justify-center"
//                     >
//                       Sertifikasi
//                     </Navbar.Link>
//                   </Dropdown.Item>
//                 </Dropdown>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] !== "dashboard" ? (
//                 <h2>
//                   <Navbar.Link
//                     href="/about"
//                     className="mt-[2vh] font-semibold text-white border-t border-white"
//                   >
//                     Tentang Kami
//                   </Navbar.Link>
//                 </h2>
//               ) : (
//                 ""
//               )}

//               {adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href="/contact"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   <h2>Contact</h2>
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {!login && adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href={`/login?prevRoute=${path}`}
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   Login
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {/* LOGIN */}

//               {login && adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href="/my_order"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   Order saya
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {login && adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href="/history_order"
//                   className="mt-[2vh] font-semibold text-white "
//                 >
//                   History order{" "}
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}
//               {login && adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   href="/profil"
//                   className="mt-[2vh] font-semibold   text-white"
//                 >
//                   Profile
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {login && adminPath[2] !== "dashboard" ? (
//                 <Navbar.Link
//                   onClick={handleLogout}
//                   className="mt-[2vh] font-semibold text-white  "
//                 >
//                   Logout
//                 </Navbar.Link>
//               ) : (
//                 ""
//               )}

//               {/* <div className=''>

//               <button onClick={toggleNav} className='md:px-0 px-2'><Image src={"/images/profil.svg"} alt="" width={0} height={0} sizes='100vw' className='w-[50px] h-[50px] ' /></button>
//               {comp == 0 ? (
//                 <>
//                   <div className='md:absolute md:bg-[#CDCCCC]  px-5 py-2 z-50'>
                   
//                   </div>
//                 </>
//               ) : ("")}
//             </div> */}
//             </Navbar.Collapse>
//           </Navbar>
//           <div className="bg-red-700 w-full h-3"></div>
//         </div>
//       </div>
//       <div className="h-20">

//       </div>
//     </>
//   );
// }
