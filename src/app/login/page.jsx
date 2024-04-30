'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import axios from "axios";
import Router from "next/router";
import Image from "next/image";


export default function Login({ searchParams }) {
    const router = useRouter()

    const { prevRoute } = searchParams
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_URL)
        async function user() {
            try {
                const data = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
                    withCredentials: true
                })

                if (data.data.success) {
                    
                    if (prevRoute) {
                        
                        router.replace(prevRoute)
                    } else {

                        // router.replace("/")
                    }
                }
            } catch (err) {
                console.log(err.message)
            }

        }
        user()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const get_user = async () => {     
            try{
                const data = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/login`, userForm, { withCredentials: true })
       
                if (data.data.success == true) {
                    localStorage.setItem('access_token', data.data.token);
              
                        
                        alert("login sukses")
                  
                        if (prevRoute) {
                            window.location.replace(prevRoute)
    
                        } else {
                            window.location.replace("/")
    
                        }
                    
                
                }else{
                    alert(data.data.message)
                }
            }catch(err){
                alert(err.message)
            }

        }
        get_user()
    }

    return (
        <>
            <div className="md:grid grid-cols-2">
                <div className="bg-neutral-900 flex">
                    <Image alt="" src={"/images/gedung.jpg"} width={0} height={0} sizes="100vw" className="w-[800px] md:h-[807px] h-[300px] opacity-50" />
                    <div className="text-white absolute flex flex-col justify-center items-center md:w-6/12 w-full md:h-[807px] h-[300px]">
                        <h1 className="md:text-4xl text-2xl font-bold w-[300px] text-center mb-10">Masuk atau Daftar</h1>
                        <p className="md:text-2xl text-base font-semibold md:w-10/12 w-11/12 text-justify">Laboratorium Kimia Instrumen UPI pengujian dan analisis sampel.</p>
                    </div>
                </div>
                <div className="w-11/12 flex flex-col mx-auto mt-10 md:mt-0">
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex mt-4 gap-5">
                            <Image src={"/footer.png"} width={0} height={0} sizes="100vw" className="w-[123px] h-[34px] my-auto bg-red-700 rounded-full" />
                            <h1 className="font-medium text-[30px] ">Layanan <span className="font-bold">LKI UPI</span></h1>
                        </div>
                        <hr className='text-red-700 bg-gradient-to-r from-red-700 via-red-700 to-rose-950 h-2 mb-8 mt-5 w-10/12 text-center rounded-full' />
                    </div>
                    <form onSubmit={handleSubmit}>


                        <div className=" w-full  flex-col justify-start items-start gap-[33px] inline-flex md:mb-[26px] mb-[20px]">
                            <div className=" w-full flex-col justify-start items-start gap-2 flex">
                                <div className="text-neutral-700 md:text-lg text-sm fon t-medium  tracking-wide">
                                    EMAIL
                                </div>
                                <input
                                    id="email1" name="email" required
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Masukan email di sini"
                                    className="input-style-lki"
                                />
                            </div>
                        </div>
                        <div className=" w-full  flex-col justify-start items-start gap-[33px] inline-flex md:mb-[0px] mb-[20px]">
                            <div className=" w-full flex-col justify-start items-start gap-2 flex">
                                <div className="text-neutral-700 md:text-lg text-sm font-medium  tracking-wide">
                                    PASSWORD
                                </div>
                                <input
                                    id="password" required
                                    onChange={handleChange}
                                    type="password"
                                    name="password"
                                    placeholder="Masukan Password di sini"
                                    className="input-style-lki"
                                />
                            </div>
                        </div>
                        {/* <div className="md:my-8 my-3">
                            <input type="checkbox" id="check" /> <label htmlFor="check">Ingat Saya</label>
                        </div> */}
                        <div className="flex justify-between mt-5 sm:mt-8 md:mt-14 mb-8">
                            <button type="submit" className="md:w-[238px] w-[200px] h-[56px] bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-2xl font-bold text-white flex justify-center items-center rounded-full">
                                Masuk
                            </button>
                            <a href={`/register?prevRoute=${prevRoute}`} className="md:w-[238px] w-[200px] h-[56px] bg-gradient-to-r from-red-700 via-red-700 to-rose-950 text-2xl font-bold text-white flex justify-center items-center rounded-full">
                                Daftar
                            </a>
                        </div>
                    </form>
                    {/* <div className="flex justify-center mt-5 mb-20 font-medium ">
                        <a href="/">Lupa Password?</a>
                    </div> */}



                </div>
            </div>
        </>
    )
}
