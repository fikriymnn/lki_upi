'use client'
import { useState, useContext, useEffect } from "react"
import { UserContext } from "@/context/userContext"
import { useRouter } from 'next/navigation'
import axios from 'axios';

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
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nama_lengkap">Nama lengkap</label>
                        <input name="nama_lengkap" type="text" required onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="jenis_institusi">Jenis instansi</label>
                        <select name="jenis_institusi" placeholder="Pilih jenis institusi" required onChange={handleChange}>
                            <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                            <option value="Perusahaan">Perusahaan</option>
                        </select>
                    </div>
                    {
                        userForm.jenis_institusi ? <div><div>
                            {userForm.jenis_institusi == "Perusahaan" ? <div>
                                <label htmlFor="nama_institusi">Nama perusahaan</label>
                                <input name="nama_institusi" placeholder="Masukan nama perusahaan" required type="text" onChange={handleChange} />
                            </div> : <>
                                <div>
                                    <label htmlFor="nama_institusi">Nama perguruan tinggi</label>
                                    <input name="nama_institusi" placeholder="Masukan nama perguruan tinggi" required type="text" onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="fakultas">Fakultas</label>
                                    <input name="fakultas" placeholder="Masukan nama fakultas" required type="text" onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="program_studi">Program studi</label>
                                    <input name="program_studi" placeholder="Masukan nama program studi" required type="text" onChange={handleChange} />
                                </div>
                            </>
                            }
                        </div>
                        </div> : ""
                    }
                    <div>  
                        <label htmlFor="no_telp">No telepon</label>
                        <input name="no_telp" required type="number" onChange={handleChange} />
                    </div>
                    <div>  
                        <label htmlFor="no_whatsapp">No whatsapp</label>
                        <input name="no_whatsapp" required type="number" onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input name="email" required type="text" onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input name="password" required type="password" onChange={handleChange} />
                    </div>
                    
                    <button type="submit">submit</button>
                </form>
                <a href={`/login?prevRoute=${prevRoute}`}>Login</a>
            </div>
        </>
    )
}