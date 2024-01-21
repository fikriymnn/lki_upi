'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

export default function register({ searchParams }) {
    const { prevRoute } = searchParams
    const router = useRouter()

    const [userForm, setUserForm] = useState({
        nama_lengkap: "",
        jenis_institusi: "",
        nama_institusi: "",
        program_studi: "",
        fakultas: "",
        email: "",
        password: "",
        no_telp: "",
        no_whatsapp: ""
    })

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setUserForm(prev => ({ ...prev, [name]: value }))
    }

    useEffect(()=>{
        async function user(){
            try{
                const data = await axios.get("http://localhost:5000/api/user",{
                    withCredentials: true
                })
               
                if (data.data.success) {
                    if (prevRoute) {
                        router.push(prevRoute)
                    }else{
                        router.push("/")
                    }
                }  
            }catch(err){
               console.log(err.message)
            }
                    
        }
        user()
    },[])

    const handleSubmit = (e) => {
        e.preventDefault()
        async function submit(){
            try{
                const data = await axios.post("http://localhost:5000/api/register",userForm,{
                    withCredentials: true
                })
        
                if (data.data.success==true) { 
                    if (prevRoute) {
                        window.location.replace(prevRoute)
                
                    } else {
                        window.location.replace("/")
                       
                    }
                }
            }catch(err){
                console.log(err.message)
            }
            
        }
        submit()
        
    }



    return (
        <>
            <div>
                <p className='text-center text-4xl font-bold text-gray-800 mt-7'>REGISTER</p>
                <div className='flex justify-center'>
                    <hr className='text-red-700 bg-red-600 h-2 mb-8 mt-5 w-56 text-center' />
                </div>
                <form onSubmit={handleSubmit}  className="flex max-w-md flex-col gap-4 m-auto">
                    <div>
                       <div className="mb-2 block">
                            <Label htmlFor="nama_lengkap" value="Nama lengkap" />
                        </div>
                        <TextInput name="nama_lengkap"  type="text" required onChange={handleChange} />
                    </div>
                    <div>
                    <div className="mb-2 block">
                            <Label htmlFor="jenis_institusi" value="Jenis institusi" />
                        </div>
                        <select name="jenis_institusi" placeholder="Pilih jenis institusi" required onChange={handleChange}>
                        <option value="" selected disabled hidden>Pilih jenis institusi</option>
                            <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                            <option value="Perusahaan">Perusahaan</option>
                        </select>
                    </div>
                    {
                        userForm.jenis_institusi ? <div><div>
                            {userForm.jenis_institusi == "Perusahaan" ? <div>
                            <div className="mb-2 block">
                            <Label htmlFor="nama_institusi" value="Nama perusahaan" />
                            </div>
                                <TextInput name="nama_institusi" placeholder="Masukan nama perusahaan" required type="text" onChange={handleChange} />
                            </div> : <>
                                <div>
                                <div className="mb-2 block">
                                <Label htmlFor="nama_institusi" value="Nama perguruan tinggi" />
                               </div>
                                    <TextInput name="nama_institusi" placeholder="Masukan nama perguruan tinggi" required type="text" onChange={handleChange} />
                                </div>
                                <div>
                                <div className="mb-2 block">
                                <Label htmlFor="fakultas" value="Nama fakultas" />
                               </div>
                                    <TextInput name="fakultas" placeholder="Masukan nama fakultas" required type="text" onChange={handleChange} />
                                </div>
                                <div>
                                <div className="mb-2 block">
                                <Label htmlFor="program_studi" value="Nama program studi" />
                               </div>
                                    <TextInput name="program_studi" placeholder="Masukan nama program studi" required type="text" onChange={handleChange} />
                                </div>
                            </>
                            }
                        </div>
                        </div> : ""
                    }
                    <div>  
                    <div className="mb-2 block">
                                <Label htmlFor="no_telp" value="No telepon" />
                               </div>
                        <TextInput name="no_telp" required type="number" onChange={handleChange} />
                    </div>
                    <div>  
                            <div className="mb-2 block">
                                <Label htmlFor="no_whatsapp" value="No whatsapp" />
                               </div>
                        <TextInput name="no_whatsapp" required type="number" onChange={handleChange} />
                    </div>
                    <div>
                          <div className="mb-2 block">
                                <Label htmlFor="email" value="email" />
                               </div>
                        <TextInput name="email" required type="text" onChange={handleChange} />
                    </div>
                    <div>
                    <div className="mb-2 block">
                                <Label htmlFor="password" value="password" />
                               </div>
                        <TextInput name="password" required type="password" onChange={handleChange} />
                    </div>
                    <Button type="submit" color="failure">Submit</Button>
                    <br />
                    <a href={`/login?prevRoute=${prevRoute}`} className="text-center text-red-600 m-auto" >Login</a>
           
                </form>
                </div> 
        </>
    )
}